import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Star, 
  Plus, 
  Filter, 
  Search,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { generateWinningProducts, WinningProduct } from '../lib/gemini';
import { cn } from '../lib/utils';

export const WinningProducts: React.FC = () => {
  const { t, language } = useLanguage();
  const { store, plan, addProductToStore } = useStore();
  const [products, setProducts] = useState<WinningProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    category: 'all',
    minProfit: 0,
    sortBy: 'popularity'
  });
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const fetchProducts = async () => {
    if (!store?.niche) return;
    setLoading(true);
    try {
      const data = await generateWinningProducts(store.niche, language);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [store?.niche, language]);

  const handleAddProduct = (product: WinningProduct) => {
    addProductToStore(product);
    setAddedIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const filteredProducts = products.filter(p => {
    if (filter.category !== 'all' && p.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    if (p.profit < filter.minProfit) return false;
    return true;
  }).sort((a, b) => {
    if (filter.sortBy === 'profit') return b.profit - a.profit;
    if (filter.sortBy === 'price') return b.price - a.price;
    return 0; // Default popularity (as returned by AI)
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))];

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow">{t('winning_products')}</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-white">{t('find_winning_products')}</h1>
          <p className="text-slate-400 font-medium mt-2 max-w-2xl">
            {t('detector_desc')}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 glass-cosmic px-4 py-2 rounded-xl border border-white/10">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="bg-transparent text-sm font-bold text-slate-300 focus:outline-none capitalize"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-night-blue">{cat === 'all' ? t('all_categories') : cat}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 glass-cosmic px-4 py-2 rounded-xl border border-white/10">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <select 
              value={filter.sortBy}
              onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))}
              className="bg-transparent text-sm font-bold text-slate-300 focus:outline-none"
            >
              <option value="popularity" className="bg-night-blue">{t('popularity')}</option>
              <option value="profit" className="bg-night-blue">{t('profit_margin')}</option>
              <option value="price" className="bg-night-blue">{t('price')}</option>
            </select>
          </div>

          <button 
            onClick={fetchProducts}
            disabled={loading}
            className="p-3 glass-cosmic border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/5 border-t-neon-yellow rounded-full animate-spin" />
            <Sparkles className="w-8 h-8 text-neon-yellow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-xl font-black text-white uppercase tracking-widest animate-pulse">{t('analyzing_market')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass-cosmic rounded-[2.5rem] border border-white/5 overflow-hidden group hover:border-neon-yellow/30 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="px-3 py-1 bg-night-blue/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-neon-yellow uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" />
                      {product.trend}
                    </div>
                    <div className={cn(
                      "px-3 py-1 backdrop-blur-md border rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      product.demand === 'High' ? "bg-neon-green/20 border-neon-green/30 text-neon-green" : "bg-amber-500/20 border-amber-500/30 text-amber-500"
                    )}>
                      <ShoppingBag className="w-3 h-3" />
                      {t('demand_level')}: {t(product.demand.toLowerCase())}
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-neon-green text-night-blue rounded-2xl font-black text-sm shadow-xl neon-glow-green">
                    +${product.profit} {t('profit')}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-neon-yellow transition-colors">{product.name}</h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">${product.price}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('estimated_profit')}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('competition')}</p>
                      <p className={cn(
                        "text-sm font-black uppercase",
                        product.competition === 'Low' ? "text-neon-green" : product.competition === 'Medium' ? "text-amber-500" : "text-rose-500"
                      )}>{t(product.competition.toLowerCase())}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('trending_on')}</p>
                      <p className="text-sm font-black text-white">TikTok / IG</p>
                    </div>
                  </div>

                  {/* Supplier Info - Plan Based */}
                  <div className="mb-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Truck className="w-4 h-4 text-neon-yellow" />
                        {t('suppliers')}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500">
                        {plan.id === 'ultra' ? 'Full List' : plan.id === 'pro' ? 'Top 5' : 'Basic'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {product.suppliers.slice(0, plan.id === 'ultra' ? 10 : plan.id === 'pro' ? 5 : 1).map((supplier, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-night-blue rounded-lg flex items-center justify-center text-neon-yellow font-black border border-white/5">
                              {supplier.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-white">{supplier.name}</p>
                              <div className="flex items-center gap-1 text-[10px] text-neon-yellow">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                {supplier.rating}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400 font-medium">{supplier.shippingTime}</p>
                            <p className="text-[10px] font-bold text-neon-green">{supplier.reliability}% {t('reliability')}</p>
                          </div>
                        </div>
                      ))}
                      {plan.id === 'free' && (
                        <button className="w-full py-2 text-[10px] font-black text-neon-yellow uppercase tracking-widest border border-dashed border-neon-yellow/30 rounded-xl hover:bg-neon-yellow/5 transition-colors">
                          {t('upgrade_suppliers')}
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddProduct(product)}
                    disabled={addedIds.includes(product.id)}
                    className={cn(
                      "w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg",
                      addedIds.includes(product.id)
                        ? "bg-neon-green text-night-blue"
                        : "bg-neon-yellow text-night-blue hover:scale-[1.02] active:scale-95 neon-glow-yellow"
                    )}
                  >
                    {addedIds.includes(product.id) ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        {t('added_to_store')}
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        {t('add_to_store')}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
