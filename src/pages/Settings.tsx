import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  User, 
  Shield, 
  Settings as SettingsIcon,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { Pricing } from '../components/Pricing';
import { PLANS } from '../constants';
import { ShopifyImporter } from '../components/ShopifyImporter';

export const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { plan, subscription, cancelSubscription } = useStore();
  const { user, logout } = useAuth();
  const [isShopifyModalOpen, setIsShopifyModalOpen] = useState(false);

  const currentPlan = PLANS.find(p => p.id === subscription.planId) || PLANS[0];

  const sections = [
    {
      title: t('profile_info'),
      icon: User,
      description: t('profile_desc'),
      fields: [
        { label: t('full_name'), value: user?.name || 'User', type: 'text' },
        { label: t('email_address'), value: user?.email || 'email@example.com', type: 'email' },
      ]
    },
    {
      title: t('preferences'),
      icon: Globe,
      description: t('preferences_desc'),
      fields: [
        { label: t('language_label'), value: language === 'en' ? 'English' : 'Français', type: 'select' },
        { label: t('timezone_label'), value: 'UTC (GMT+00:00)', type: 'select' },
      ]
    },
    {
      title: t('security'),
      icon: Shield,
      description: t('security_desc'),
      fields: [
        { label: t('password_label'), value: '••••••••', type: 'password' },
        { label: t('two_factor'), value: t('disabled'), type: 'toggle' },
      ]
    }
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const expectedText = language === 'fr' ? 'SUPPRIMER' : 'DELETE';

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== expectedText) return;
    // Implement actual deletion logic here
    alert(language === 'fr' ? 'Compte supprimé avec succès.' : 'Account successfully deleted.');
    logout();
  };

  return (
    <div className="p-10 space-y-12 max-w-5xl mx-auto relative z-10">
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-night-blue/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-cosmic p-10 rounded-[3rem] border border-rose-500/30 max-w-md w-full shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-white text-center mb-4 tracking-tight">
                {language === 'fr' ? 'Êtes-vous sûr ?' : 'Are you sure?'}
              </h3>
              <p className="text-slate-400 text-center mb-8 font-medium leading-relaxed">
                {language === 'fr' 
                  ? 'Cette action est irréversible. Toutes vos boutiques, produits et données seront définitivement supprimés.' 
                  : 'This action is irreversible. All your stores, products, and data will be permanently deleted.'}
              </p>
              
              <div className="space-y-4 mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
                  {language === 'fr' 
                    ? `Tapez "${expectedText}" pour confirmer` 
                    : `Type "${expectedText}" to confirm`}
                </p>
                <input 
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  placeholder={expectedText}
                  className="w-full px-6 py-4 bg-white/5 border border-rose-500/20 rounded-2xl text-center font-black text-xl text-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  {language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== expectedText}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'fr' ? 'Supprimer' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex items-end justify-between">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow">{t('account_settings')}</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-white">{t('settings')}</h1>
        </div>
        <button 
          onClick={logout}
          className="px-6 py-3 bg-white/5 text-slate-400 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-500 transition-all flex items-center gap-2 border border-white/5"
        >
          <LogOut className="w-4 h-4" />
          {language === 'fr' ? 'Déconnexion' : 'Logout'}
        </button>
      </header>

      <div className="space-y-10">
        {/* Shopify Migration Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-cosmic rounded-[2.5rem] border border-neon-yellow/20 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl neon-glow-yellow/5"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-neon-yellow/10 text-neon-yellow rounded-[1.5rem] flex items-center justify-center border border-neon-yellow/20 shadow-xl neon-glow-yellow">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">{t('shopify_importer')}</h2>
              <p className="text-slate-400 font-medium">{t('shopify_desc')}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsShopifyModalOpen(true)}
            className="px-8 py-4 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-105 active:scale-95 transition-all"
          >
            {t('import_from_shopify')}
          </button>
        </motion.section>

        {/* Billing Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-cosmic rounded-[2.5rem] border border-white/5 overflow-hidden"
        >
          <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/5 text-neon-yellow rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">{t('billing')} & {t('subscription')}</h2>
                <p className="text-slate-400 font-medium">{t('billing_desc')}</p>
              </div>
            </div>
            {subscription.status === 'active' && (
              <button 
                onClick={cancelSubscription}
                className="px-6 py-3 bg-rose-500/10 text-rose-500 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-rose-500/20 transition-colors border border-rose-500/20"
              >
                {t('cancel_sub')}
              </button>
            )}
          </div>
          <div className="p-10 bg-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-night-blue/50 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t('current_plan')}</p>
                <h3 className="text-2xl font-black text-white mb-1">{currentPlan.name}</h3>
                <p className="text-neon-yellow font-bold text-sm">${currentPlan.price}/{t('month_short')}</p>
              </div>
              <div className="p-6 bg-night-blue/50 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t('status')}</p>
                <div className="flex items-center gap-2">
                  {subscription.status === 'active' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-neon-green" />
                      <span className="text-lg font-bold text-white uppercase tracking-tight">{t('active')}</span>
                    </>
                  ) : subscription.status === 'canceled' ? (
                    <>
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span className="text-lg font-bold text-white uppercase tracking-tight">{t('ending_soon')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-slate-500" />
                      <span className="text-lg font-bold text-white uppercase tracking-tight">{t('none')}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-6 bg-night-blue/50 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t('payment_method')}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center text-[8px] font-black text-white">PAYPAL</div>
                  <span className="text-sm font-bold text-white">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-black text-white mb-8 tracking-tight">{t('change_plan')}</h3>
              <Pricing compact />
            </div>
          </div>
        </motion.section>

        {sections.map((section, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-cosmic rounded-[2.5rem] border border-white/5 overflow-hidden"
          >
            <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/5 text-neon-yellow rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
                  <section.icon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white">{section.title}</h2>
                  <p className="text-slate-400 font-medium">{section.description}</p>
                </div>
              </div>
              <div className="flex gap-4">
                {section.title === t('preferences') && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${language === 'en' ? 'bg-neon-yellow text-night-blue shadow-lg neon-glow-yellow' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLanguage('fr')}
                      className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${language === 'fr' ? 'bg-neon-yellow text-night-blue shadow-lg neon-glow-yellow' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      FR
                    </button>
                  </div>
                )}
                <button className="px-6 py-3 bg-white/5 text-slate-300 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/5">
                  {t('edit')}
                </button>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/5">
              {section.fields.map((field, j) => (
                <div key={j} className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{field.label}</label>
                  <div className="relative group">
                    <input 
                      type={field.type} 
                      value={field.value} 
                      readOnly 
                      className="w-full px-6 py-4 bg-night-blue/50 border border-white/10 rounded-2xl font-bold text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all cursor-default"
                    />
                    {field.type === 'select' && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500">
                        <Globe className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ))}

        <section className="glass-cosmic rounded-[2.5rem] border border-rose-500/20 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/20">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">{t('danger_zone')}</h2>
              <p className="text-rose-500/70 font-medium">{t('danger_desc')}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20"
          >
            {t('delete_account')}
          </button>
        </section>
      </div>

      <ShopifyImporter isOpen={isShopifyModalOpen} onClose={() => setIsShopifyModalOpen(false)} />
    </div>
  );
};
