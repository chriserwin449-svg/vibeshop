import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
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
  updateProduct: (productId: string, updates: any) => void;
  deleteProduct: (productId: string) => void;
  importStoreData: (data: any) => void;
  saveStore: (data: StoreData) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [store, setStore] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Load store from Firestore when user changes
  useEffect(() => {
    const loadStore = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Find store by userId
          const shopsRef = collection(db, 'shops');
          const q = query(shopsRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const storeDoc = querySnapshot.docs[0];
            const storeData = storeDoc.data() as any;
            
            // Fetch products for this store
            const productsRef = collection(db, 'products');
            const pq = query(productsRef, where('shopId', '==', storeDoc.id));
            const productsSnapshot = await getDocs(pq);
            const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setStore({
              ...storeData,
              id: storeDoc.id,
              products: products
            });
          } else {
            setStore(null);
          }
          setPlanId(user.planId || 'free');
        } catch (e) {
          console.error('Error loading store from Firestore:', e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setStore(null);
        setIsLoading(false);
      }
    };
    loadStore();
  }, [user]);

  const saveStore = useCallback(async (data: StoreData) => {
    if (!user) return;
    
    try {
      const storeId = String(data.id || `shop-${user.uid}`);
      const storeRef = doc(db, 'shops', storeId);
      
      const { products, ...storeMeta } = data;
      
      await setDoc(storeRef, {
        ...storeMeta,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Sync products
      if (products) {
        for (const product of products) {
          const productId = product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          await setDoc(doc(db, 'products', productId), {
            ...product,
            shopId: storeId,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      }
      
      setStore({ ...data, id: storeId } as any);
    } catch (error) {
      console.error('Error saving store:', error);
      throw error;
    }
  }, [user]);

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

  const addProductToStore = async (product: any) => {
    if (!store || !user) return;
    const productId = `prod-${Date.now()}`;
    const newProduct = { ...product, id: productId, shopId: store.id };
    
    try {
      await setDoc(doc(db, 'products', productId), newProduct);
      setStore({
        ...store,
        products: [...store.products, newProduct]
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (productId: string, updates: any) => {
    if (!store) return;
    try {
      await setDoc(doc(db, 'products', productId), updates, { merge: true });
      setStore({
        ...store,
        products: store.products.map(p => p.id === productId ? { ...p, ...updates } : p)
      });
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!store) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      setStore({
        ...store,
        products: store.products.filter(p => p.id !== productId)
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const importStoreData = (data: any) => {
    // This will be handled by saveStore after import
    if (!store) {
      const newStore: StoreData = {
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
      };
      setStore(newStore);
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
      updateProduct,
      deleteProduct,
      importStoreData,
      saveStore
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
