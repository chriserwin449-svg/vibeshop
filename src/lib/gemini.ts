import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface StoreData {
  name: string;
  niche: string;
  description: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    fontFamily: string;
  };
  products: Product[];
  pages: {
    about: string;
    contact: {
      email: string;
      address: string;
      phone: string;
    };
  };
}

export interface Supplier {
  name: string;
  rating: number;
  shippingTime: string;
  reliability: number; // 0-100
}

export interface WinningProduct extends Product {
  cost: number;
  profit: number;
  trend: string;
  demand: 'High' | 'Medium' | 'Low';
  competition: 'High' | 'Medium' | 'Low';
  suppliers: Supplier[];
}

export interface VideoScript {
  title: string;
  scenes: {
    visual: string;
    audio: string;
    duration: number;
  }[];
  callToAction: string;
}

export const generateWinningProducts = async (niche: string, language: string): Promise<WinningProduct[]> => {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    You are an Ultra-Intelligent AI Winning Product Detector for high-ticket dropshipping.
    
    TASKS:
    1. MARKET ANALYSIS: Analyze social media trends (TikTok Viral, Instagram Reels, Pinterest Trends), passionate forums (Reddit, specialized communities), and search volume.
    2. PRODUCT SELECTION: Identify 6 products with:
       - High Passion Factor: Products people LOVE and talk about.
       - High Purchasing Power: Target audiences with disposable income.
       - High Revenue Potential: Healthy margins (at least 3x markup).
    3. SUPPLIER RANKING: For each product, find 5-8 top-tier suppliers. Rank them by:
       - Reliability Score (0-100): Based on historical fulfillment.
       - Quality Assurance: Review sentiment analysis.
       - Shipping Speed: Prioritize local warehouses or fast international lines.
       - Profitability: Best cost-to-quality ratio.
    
    The response must be in ${language === 'fr' ? 'French' : 'English'}.
    
    Return a valid JSON array of WinningProduct objects.
    Use picsum.photos for images: https://picsum.photos/seed/{keyword}/800/600
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: "user", parts: [{ text: `Find 6 winning products for the niche: ${niche}` }] }
    ],
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.NUMBER },
            cost: { type: Type.NUMBER },
            profit: { type: Type.NUMBER },
            image: { type: Type.STRING },
            category: { type: Type.STRING },
            trend: { type: Type.STRING },
            demand: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            competition: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            suppliers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  shippingTime: { type: Type.STRING },
                  reliability: { type: Type.NUMBER }
                },
                required: ["name", "rating", "shippingTime", "reliability"]
              }
            }
          },
          required: ["id", "name", "description", "price", "cost", "profit", "image", "category", "trend", "demand", "competition", "suppliers"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]") as WinningProduct[];
};

export const generateVideoScript = async (product: Product, language: string): Promise<VideoScript> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an AI Video Marketing Expert for dropshipping.
    Create a high-converting short-form video script (TikTok/Reels style) for the product: ${product.name}.
    
    The response must be in ${language === 'fr' ? 'French' : 'English'}.
    
    Focus on:
    - Hook: Catch attention in the first 3 seconds.
    - Value Proposition: Show the problem it solves.
    - Call to Action: Strong finish.
    
    Return a valid JSON object matching the VideoScript interface.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: "user", parts: [{ text: `Create a video script for ${product.name}` }] }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                visual: { type: Type.STRING },
                audio: { type: Type.STRING },
                duration: { type: Type.NUMBER }
              },
              required: ["visual", "audio", "duration"]
            }
          },
          callToAction: { type: Type.STRING }
        },
        required: ["title", "scenes", "callToAction"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as VideoScript;
};

export interface ShopifyImportResult {
  products: Product[];
  pages: { about: string; contact: any };
}

export const importShopifyData = async (url: string, apiKey: string, language: string): Promise<ShopifyImportResult> => {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    You are an AI Shopify Migration Expert.
    Simulate fetching data from a Shopify store URL: ${url}.
    Generate 10 realistic products and store pages based on the store URL or niche implied by the URL.
    
    The response must be in ${language === 'fr' ? 'French' : 'English'}.
    
    Return a valid JSON object matching the ShopifyImportResult interface.
    Use picsum.photos for images: https://picsum.photos/seed/{keyword}/800/600
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: "user", parts: [{ text: `Migrate store from URL: ${url}` }] }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
                image: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["id", "name", "description", "price", "image", "category"]
            }
          },
          pages: {
            type: Type.OBJECT,
            properties: {
              about: { type: Type.STRING },
              contact: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING }
                },
                required: ["email", "address", "phone"]
              }
            },
            required: ["about", "contact"]
          }
        },
        required: ["products", "pages"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as ShopifyImportResult;
};

export const generateStore = async (prompt: string, currentStore?: StoreData): Promise<StoreData> => {
  const model = "gemini-3.1-pro-preview";
  
  const systemInstruction = `
    You are an Elite Ecommerce Architect and Conversion Rate Optimization (CRO) Expert.
    
    GOAL: Build or update a high-converting dropshipping store that resonates with passionate communities.
    
    INTELLIGENCE:
    - NICHE SELECTION: If the user is vague, identify a profitable, passionate sub-niche (e.g., instead of "makeup", suggest "eco-friendly vegan skincare for Gen Z").
    - BRANDING: Create a compelling brand story in the 'about' page.
    - PRODUCT CURATION: Select products that solve real problems or satisfy deep desires.
    - DESIGN: Use color psychology. (e.g., Emerald for trust/nature, Indigo for tech/luxury).
    
    If currentStore is provided, perform a surgical update based on the user's request while maintaining brand consistency.
    
    Return a valid JSON object matching the StoreData interface.
    
    For images, use high-quality Unsplash URLs via picsum.photos: https://picsum.photos/seed/{keyword}/800/600
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      { role: "user", parts: [{ text: `User request: ${prompt}${currentStore ? `\n\nCurrent Store State: ${JSON.stringify(currentStore)}` : ""}` }] }
    ],
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          niche: { type: Type.STRING },
          description: { type: Type.STRING },
          theme: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              darkMode: { type: Type.BOOLEAN },
              fontFamily: { type: Type.STRING }
            },
            required: ["primaryColor", "secondaryColor", "darkMode", "fontFamily"]
          },
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
                image: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["id", "name", "description", "price", "image", "category"]
            }
          },
          pages: {
            type: Type.OBJECT,
            properties: {
              about: { type: Type.STRING },
              contact: {
                type: Type.OBJECT,
                properties: {
                  email: { type: Type.STRING },
                  address: { type: Type.STRING },
                  phone: { type: Type.STRING }
                },
                required: ["email", "address", "phone"]
              }
            },
            required: ["about", "contact"]
          }
        },
        required: ["name", "niche", "description", "theme", "products", "pages"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as StoreData;
};
