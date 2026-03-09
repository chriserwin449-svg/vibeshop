import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BarChart3, Settings, Eye, ShoppingBag, Crown, Video, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Stars } from './Stars';
import { Logo } from './Logo';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const { plan, store } = useStore();
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), path: '/dashboard' },
    { icon: MessageSquare, label: t('builder_title'), path: '/builder' },
    { icon: Sparkles, label: t('winning_products'), path: '/winning-products' },
    { icon: Video, label: t('video_marketing'), path: '/video' },
    { icon: Eye, label: t('live_preview'), path: '/preview' },
    { icon: BarChart3, label: t('reports'), path: '/reports' },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-cosmic-dark text-white font-sans overflow-hidden relative">
      <Stars />
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 glass-cosmic flex flex-col relative z-20">
        <div className="p-8">
          <Logo showText variant="gold" className="w-12 h-12" />
        </div>

        <div className="px-4 mb-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{t('current_store')}</p>
            <p className="text-sm font-bold text-white truncate">{store?.name || 'My Awesome Shop'}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group",
                location.pathname === item.path
                  ? "bg-neon-yellow text-night-blue shadow-xl neon-glow-yellow"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                location.pathname === item.path ? "text-night-blue" : "text-slate-500 group-hover:text-white"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="bg-night-blue rounded-[1.5rem] p-5 text-white relative overflow-hidden group cursor-pointer border border-white/5">
            <div className="absolute top-0 right-0 w-20 h-20 bg-neon-yellow/10 blur-2xl rounded-full -mr-10 -mt-10" />
            <p className="text-xs font-bold text-neon-yellow mb-1 uppercase tracking-widest">{t('payment_status')}</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <p className="text-sm font-bold">{t('gateways_active')}</p>
            </div>
            <button className="w-full py-2 bg-white/5 text-white border border-white/10 rounded-xl text-xs font-black hover:bg-neon-yellow hover:text-night-blue transition-colors">
              {t('manage_gateway')}
            </button>
          </div>
          
          <div className="bg-night-blue rounded-[1.5rem] p-5 text-white relative overflow-hidden group cursor-pointer border border-white/5">
            <div className={cn(
              "absolute top-0 right-0 w-20 h-20 blur-2xl rounded-full -mr-10 -mt-10",
              plan.id === 'ultra' ? "bg-rose-500/10" : plan.id === 'pro' ? "bg-neon-yellow/10" : "bg-neon-green/10"
            )} />
            <p className={cn(
              "text-xs font-bold mb-1 uppercase tracking-widest",
              plan.id === 'ultra' ? "text-rose-500" : plan.id === 'pro' ? "text-neon-yellow" : "text-neon-green"
            )}>{plan.name}</p>
            <p className="text-sm font-bold mb-3">{plan.id === 'free' ? t('unlock_insights') : t('plan_active')}</p>
            <Link 
              to="/settings"
              className={cn(
                "w-full py-2 rounded-xl text-xs font-black text-center block transition-colors",
                plan.id === 'free' ? "bg-white text-night-blue hover:bg-neon-green" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              )}
            >
              {plan.id === 'free' ? t('upgrade') : t('manage_plan')}
            </Link>
          </div>
          
          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-yellow to-neon-green flex items-center justify-center text-night-blue font-bold text-sm">
              {user?.name ? getInitials(user.name) : 'VS'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate text-white">{user?.name || 'User'}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('store_owner')}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="min-h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};
