import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("vibeshop.db");
db.pragma('foreign_keys = ON');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    plan_id TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    niche TEXT,
    description TEXT,
    theme_json TEXT,
    pages_json TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_id INTEGER,
    name TEXT,
    description TEXT,
    price REAL,
    image TEXT,
    category TEXT,
    FOREIGN KEY(store_id) REFERENCES stores(id)
  );

  CREATE TABLE IF NOT EXISTS winning_products_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    niche TEXT,
    language TEXT,
    products_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // Auth Routes
  app.get("/api/winning-products", (req, res) => {
    const { niche, language } = req.query;
    
    // Check cache (valid for 3 days)
    const cache = db.prepare(`
      SELECT products_json FROM winning_products_cache 
      WHERE niche = ? AND language = ? 
      AND created_at > datetime('now', '-3 days')
      ORDER BY created_at DESC LIMIT 1
    `).get(niche, language);

    if (cache) {
      console.log(`Serving cached winning products for ${niche}`);
      return res.json({ success: true, products: JSON.parse(cache.products_json) });
    }

    res.json({ success: false, message: "No cache found" });
  });

  app.post("/api/winning-products/cache", (req, res) => {
    const { niche, language, products } = req.body;
    try {
      db.prepare("INSERT INTO winning_products_cache (niche, language, products_json) VALUES (?, ?, ?)").run(
        niche, language, JSON.stringify(products)
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/register", (req, res) => {
    const { name, email, password, plan_id } = req.body;
    console.log(`Registering user: ${email}`);
    try {
      const stmt = db.prepare("INSERT INTO users (name, email, password, plan_id) VALUES (?, ?, ?, ?)");
      const result = stmt.run(name, email, password, plan_id || 'free');
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error(`Registration error: ${error.message}`);
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
      if (user) {
        // Fetch store if exists
        const store = db.prepare("SELECT * FROM stores WHERE user_id = ?").get(user.id);
        let products = [];
        if (store) {
          products = db.prepare("SELECT * FROM products WHERE store_id = ?").all(store.id);
        }
        res.json({ success: true, user, store, products });
      } else {
        res.status(401).json({ success: false, error: "Invalid credentials" });
      }
    } catch (error: any) {
      console.error(`Login error: ${error.message}`);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Store Routes
  app.post("/api/store/save", (req, res) => {
    const { user_id, name, niche, description, theme, pages, products } = req.body;
    console.log(`Saving store for user: ${user_id}`);
    
    if (!user_id) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    try {
      // Check if user exists first
      const user = db.prepare("SELECT id FROM users WHERE id = ?").get(user_id);
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      db.transaction(() => {
        // Upsert store
        const existingStore = db.prepare("SELECT id FROM stores WHERE user_id = ?").get(user_id);
        let storeId;
        
        if (existingStore) {
          db.prepare("UPDATE stores SET name = ?, niche = ?, description = ?, theme_json = ?, pages_json = ? WHERE id = ?")
            .run(name, niche, description, JSON.stringify(theme), JSON.stringify(pages), existingStore.id);
          storeId = existingStore.id;
        } else {
          const result = db.prepare("INSERT INTO stores (user_id, name, niche, description, theme_json, pages_json) VALUES (?, ?, ?, ?, ?, ?)")
            .run(user_id, name, niche, description, JSON.stringify(theme), JSON.stringify(pages));
          storeId = result.lastInsertRowid;
        }

        // Sync products
        db.prepare("DELETE FROM products WHERE store_id = ?").run(storeId);
        const insertProduct = db.prepare("INSERT INTO products (store_id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?, ?)");
        for (const p of products) {
          insertProduct.run(storeId, p.name, p.description, p.price, p.image, p.category);
        }
      })();
      res.json({ success: true });
    } catch (error: any) {
      console.error(`Store save error: ${error.message}`);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
