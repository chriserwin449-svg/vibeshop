import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Search,
  Truck,
  CreditCard,
  UserCheck,
  Package,
  Bot,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Onboarding } from '../components/Onboarding';

const data = [
  { name: 'Mon', sales: 4000, traffic: 2400 },
  { name: 'Tue', sales: 3000, traffic: 1398 },
  { name: 'Wed', sales: 2000, traffic: 9800 },
  { name: 'Thu', sales: 2780, traffic: 3908 },
  { name: 'Fri', sales: 1890, traffic: 4800 },
  { name: 'Sat', sales: 2390, traffic: 3800 },
  { name: 'Sun', sales: 3490, traffic: 4300 },
];

const StatCard = ({ title, value, change, icon: Icon, positive }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-cosmic p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-500"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-yellow border border-white/5 neon-glow-yellow">
        <Icon className="w-6 h-6" />
      </div>
      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${positive ? 'bg-neon-green/10 text-neon-green' : 'bg-rose-500/10 text-rose-500'}`}>
        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
    <p className="text-3xl font-black mt-2 tracking-tight text-white">{value}</p>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { store } = useStore();

  if (!store) {
    return (
      <div className="p-10 space-y-10 max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-neon-yellow/10 text-neon-yellow rounded-[2rem] flex items-center justify-center mb-8 shadow-xl neon-glow-yellow border border-neon-yellow/20"
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">
          {language === 'fr' ? 'Bienvenue sur VibeShop' : 'Welcome to VibeShop'}
        </h1>
        <p className="text-xl text-slate-400 font-medium mb-10 max-w-2xl">
          {language === 'fr' 
            ? 'Commencez par créer votre première boutique pour débloquer les analyses, les suggestions IA et les outils produits.' 
            : 'Start by creating your first store to unlock analytics, AI suggestions, and product tools.'}
        </p>
        <Link 
          to="/builder"
          className="px-10 py-5 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-105 transition-all flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          {language === 'fr' ? 'Créer ma Boutique' : 'Create My Store'}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full relative z-10">
      <Onboarding />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">{t('dashboard')}</h1>
          <p className="text-slate-400 font-medium mt-1">
            {t('welcome_dashboard')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/winning-products"
            className="px-5 py-2.5 bg-white/5 text-neon-yellow border border-neon-yellow/30 rounded-xl text-sm font-bold hover:bg-neon-yellow/10 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {t('find_winning_products')}
          </Link>
          <button className="px-5 py-2.5 glass-cosmic border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors">
            {t('export_data')}
          </button>
          <button className="px-5 py-2.5 bg-neon-yellow text-night-blue rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-lg neon-glow-yellow">
            {t('create_order')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <StatCard title={t('revenue')} value="$0.00" change="0" icon={DollarSign} positive />
        <StatCard title={t('orders')} value="0" change="0" icon={ShoppingBag} positive />
        <StatCard title={t('conversion_rate')} value="0%" change="0" icon={TrendingUp} positive />
        <StatCard title={t('customers')} value="0" change="0" icon={Users} positive />
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-cosmic p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{t('gateways')}</h3>
            <div className="flex gap-3 mt-4">
              <div className="px-3 py-1 bg-neon-green/10 border border-neon-green/20 rounded-lg text-[10px] font-black text-neon-green">PAYPAL</div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('connected')}</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-cosmic p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black tracking-tight text-white">{t('revenue_overview')}</h3>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-neon-yellow/20">
              <option className="bg-night-blue">{t('last_7_days')}</option>
              <option className="bg-night-blue">{t('last_30_days')}</option>
              <option className="bg-night-blue">{t('this_year')}</option>
            </select>
          </div>
          <div className="h-[350px] flex items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t('no_data_available')}</p>
          </div>
        </div>

        <div className="glass-cosmic p-10 rounded-[2.5rem] border border-white/5 flex flex-col">
          <h3 className="text-xl font-black tracking-tight mb-8 text-white">{t('best_sellers')}</h3>
          <div className="space-y-6 flex-1">
            {store?.products.slice(0, 5).map((product, i) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/5">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-14 h-14 object-cover group-hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-neon-yellow transition-colors text-white">{product.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">0 {t('units_sold')}</p>
                </div>
                <p className="text-sm font-black text-neon-green">${product.price}</p>
              </motion.div>
            )) || (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <ShoppingBag className="w-10 h-10 text-slate-600 mb-4" />
                <p className="text-sm text-slate-500 font-medium">{t('no_sales_data')}<br />{t('generate_to_start')}</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-4 bg-white/5 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/5">
            {t('view_all')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Table */}
        <div className="glass-cosmic p-10 rounded-[2.5rem] border border-white/5">
          <h3 className="text-xl font-black tracking-tight text-white mb-8">{t('orders')}</h3>
          <div className="h-[300px] flex items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t('no_orders_yet')}</p>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="glass-cosmic p-10 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">{t('ai_suggestions')}</h3>
          </div>
          <div className="space-y-4">
            {[
              { icon: TrendingUp, text: t('suggestion_price') },
              { icon: Users, text: t('suggestion_tiktok') },
              { icon: Package, text: t('suggestion_eco') },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <tip.icon className="w-5 h-5 text-neon-yellow shrink-0 mt-1" />
                <p className="text-sm font-medium text-slate-300 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
