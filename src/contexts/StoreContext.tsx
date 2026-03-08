import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreData } from '../lib/gemini';
import { PLANS } from '../constants';
import { useAuth } from './AuthContext';

interface StoreContextType {
  store: StoreData | null;
  setStore: (store: StoreData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  cart: { product: any; quantity: number }[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  plan: typeof PLANS[0];
  setPlan: (planId: string) => void;
  subscription: {
    status: 'active' | 'canceled' | 'none';
    planId: string;
    nextBillingDate?: string;
  };
  cancelSubscription: () => void;
  addProductToStore: (product: any) => void;
  importStoreData: (data: any) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [store, setStore] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [planId, setPlanId] = useState('free');
  const [subscription, setSubscription] = useState<{
    status: 'active' | 'canceled' | 'none';
    planId: string;
    nextBillingDate?: string;
  }>({
    status: 'none',
    planId: 'free'
  });

  // Load store from DB when user changes
  useEffect(() => {
    const loadStore = async () => {
      if (user) {
        const saved = localStorage.getItem('vibe_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.store) {
            setStore({
              ...parsed.store,
              theme: JSON.parse(parsed.store.theme_json),
              pages: JSON.parse(parsed.store.pages_json),
              products: parsed.products
            });
          }
          setPlanId(user.plan_id);
        }
      } else {
        setStore(null);
      }
    };
    loadStore();
  }, [user]);

  // Save to DB and LocalStorage when store changes
  useEffect(() => {
    if (user && store) {
      // Update local storage immediately for responsiveness
      const saved = localStorage.getItem('vibe_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        localStorage.setItem('vibe_user', JSON.stringify({
          ...parsed,
          store: {
            ...store,
            theme_json: JSON.stringify(store.theme),
            pages_json: JSON.stringify(store.pages)
          },
          products: store.products
        }));
      }

      // Sync with server
      fetch('/api/store/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...store,
          products: store.products
        })
      }).catch(err => console.error('Failed to sync store with server:', err));
    }
  }, [store, user]);

  const plan = PLANS.find(p => p.id === planId) || PLANS[0];

  const setPlan = (id: string) => {
    setPlanId(id);
    setSubscription({
      status: id === 'free' ? 'none' : 'active',
      planId: id,
      nextBillingDate: id === 'free' ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
  };

  const cancelSubscription = () => {
    setSubscription(prev => ({ ...prev, status: 'canceled' }));
  };

  const addProductToStore = (product: any) => {
    if (!store) return;
    setStore({
      ...store,
      products: [...store.products, { ...product, id: `prod-${Date.now()}` }]
    });
  };

  const importStoreData = (data: any) => {
    if (!store) {
      setStore({
        name: "Imported Store",
        niche: "Imported",
        description: "Imported from Shopify",
        theme: {
          primaryColor: "#FAFAFA",
          secondaryColor: "#141414",
          darkMode: true,
          fontFamily: "Inter"
        },
        products: data.products,
        pages: data.pages
      });
      return;
    }
    setStore({
      ...store,
      products: [...store.products, ...data.products],
      pages: {
        ...store.pages,
        ...data.pages
      }
    });
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider value={{ 
      store, 
      setStore, 
      isLoading, 
      setIsLoading, 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      plan,
      setPlan,
      subscription,
      cancelSubscription,
      addProductToStore,
      importStoreData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
