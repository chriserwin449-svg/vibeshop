import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';

export const Favorites: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { addProductToStore } = useStore();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const fetchFavorites = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const favsRef = collection(db, 'favorites');
      const q = query(favsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const favs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavorites(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.uid]);

  const removeFavorite = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'favorites', id));
      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleAddProduct = (product: any) => {
    addProductToStore(product);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full relative z-10">
      <header>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow">{t('favorites')}</span>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight text-white">{language === 'fr' ? 'Produits Sauvegardés' : 'Saved Products'}</h1>
        <p className="text-slate-400 font-medium mt-2 max-w-2xl">
          {language === 'fr' 
            ? 'Retrouvez ici tous les produits gagnants que vous avez mis de côté pour plus tard.' 
            : 'Find all the winning products you have set aside for later here.'}
        </p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-white/5 border-t-neon-yellow rounded-full animate-spin" />
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {favorites.map((fav, i) => (
              <motion.div
                key={fav.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass-cosmic rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-neon-yellow/30 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={fav.product.image} 
                    alt={fav.product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6">
                    <div className="px-3 py-1 bg-night-blue/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-neon-yellow uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      {fav.product.trend}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFavorite(fav.id)}
                    className="absolute top-6 right-6 w-10 h-10 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all backdrop-blur-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-neon-yellow transition-colors">{fav.product.name}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{fav.product.category}</p>
                    </div>
                    <p className="text-2xl font-black text-white">${fav.product.price}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('profit')}</p>
                      <p className="text-sm font-black text-neon-green">+${fav.product.profit}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('shipping')}</p>
                      <p className="text-sm font-black text-white">{fav.product.suppliers[0]?.shippingTime || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => handleAddProduct(fav.product)}
                      disabled={addedIds.includes(fav.product.id)}
                      className={cn(
                        "flex-1 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg",
                        addedIds.includes(fav.product.id)
                          ? "bg-neon-green text-night-blue"
                          : "bg-neon-yellow text-night-blue hover:scale-[1.02] active:scale-95 neon-glow-yellow"
                      )}
                    >
                      {addedIds.includes(fav.product.id) ? t('added') : t('add_to_store')}
                    </button>
                    <a 
                      href="#" 
                      className="p-5 glass-cosmic border border-white/10 rounded-2xl text-slate-400 hover:text-neon-yellow hover:border-neon-yellow/30 transition-all"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5">
            <Star className="w-12 h-12 text-slate-700" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">{language === 'fr' ? 'Aucun favori' : 'No favorites yet'}</h3>
          <p className="text-slate-500 max-w-xs mb-10 font-medium">
            {language === 'fr' 
              ? 'Explorez les produits gagnants et sauvegardez ceux qui vous intéressent.' 
              : 'Explore winning products and save the ones that interest you.'}
          </p>
          <Link 
            to="/winning-products"
            className="px-10 py-4 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-105 transition-all"
          >
            {t('find_winning_products')}
          </Link>
        </div>
      )}
    </div>
  );
};
