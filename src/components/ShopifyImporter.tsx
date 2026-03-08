import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Database,
  Globe,
  Key,
  ChevronRight,
  Package,
  FileText,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { importShopifyData, ShopifyImportResult } from '../lib/gemini';
import { cn } from '../lib/utils';

interface ShopifyImporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopifyImporter: React.FC<ShopifyImporterProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { importStoreData } = useStore();
  const [step, setStep] = useState<'connect' | 'select' | 'confirm' | 'success'>('connect');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [importData, setImportData] = useState<ShopifyImportResult | null>(null);
  const [selectedItems, setSelectedItems] = useState({
    products: true,
    pages: true
  });

  const handleConnect = async () => {
    if (!url || !apiKey) return;
    setLoading(true);
    try {
      const data = await importShopifyData(url, apiKey, language);
      setImportData(data);
      setStep('select');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!importData) return;
    setLoading(true);
    
    setTimeout(() => {
      const finalData = {
        products: selectedItems.products ? importData.products : [],
        pages: selectedItems.pages ? importData.pages : { about: '', contact: { email: '', address: '', phone: '' } }
      };
      importStoreData(finalData);
      setStep('success');
      setLoading(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-night-blue/80 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-4xl glass-cosmic rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative z-10"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neon-yellow/10 text-neon-yellow rounded-2xl flex items-center justify-center shadow-lg border border-neon-yellow/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{t('shopify_importer')}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('shopify_desc')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {['connect', 'select', 'confirm', 'success'].map((s, i) => (
                <React.Fragment key={s}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                    step === s ? "bg-neon-yellow text-night-blue shadow-lg neon-glow-yellow" : 
                    i < ['connect', 'select', 'confirm', 'success'].indexOf(step) ? "bg-neon-green text-night-blue" : "bg-white/5 text-slate-500"
                  )}>
                    {i < ['connect', 'select', 'confirm', 'success'].indexOf(step) ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < 3 && <div className="w-4 h-px bg-white/10" />}
                </React.Fragment>
              ))}
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/5 text-slate-500 rounded-xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-10 min-h-[500px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 'connect' && (
              <motion.div 
                key="connect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto w-full space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> {t('shopify_url')}
                    </label>
                    <input 
                      type="text" 
                      placeholder="mystore.myshopify.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                      <Key className="w-3 h-3" /> {t('shopify_api_key')}
                    </label>
                    <input 
                      type="password" 
                      placeholder="shpat_xxxxxxxxxxxxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleConnect}
                  disabled={loading || !url || !apiKey}
                  className="w-full py-5 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="animate-pulse">{t('fetching_shopify')}</span>
                    </div>
                  ) : (
                    <><Database className="w-5 h-5" /> {t('connect_shopify')}</>
                  )}
                </button>
              </motion.div>
            )}

            {step === 'select' && importData && (
              <motion.div 
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-black text-white tracking-tight mb-2">{t('select_data')}</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{importData.products.length} {t('products_imported')} & {t('pages_imported')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div 
                    onClick={() => setSelectedItems(prev => ({ ...prev, products: !prev.products }))}
                    className={cn(
                      "p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-4",
                      selectedItems.products ? "bg-neon-yellow/10 border-neon-yellow shadow-lg neon-glow-yellow" : "bg-white/5 border-white/5 text-slate-500"
                    )}
                  >
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", selectedItems.products ? "bg-neon-yellow text-night-blue" : "bg-white/5")}>
                      <Package className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className={cn("text-lg font-black", selectedItems.products ? "text-white" : "text-slate-500")}>{t('import_products')}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest mt-1">{importData.products.length} {t('items')}</p>
                    </div>
                    {selectedItems.products && <CheckCircle2 className="w-6 h-6 text-neon-yellow mt-2" />}
                  </div>

                  <div 
                    onClick={() => setSelectedItems(prev => ({ ...prev, pages: !prev.pages }))}
                    className={cn(
                      "p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-4",
                      selectedItems.pages ? "bg-neon-green/10 border-neon-green shadow-lg neon-glow-green" : "bg-white/5 border-white/5 text-slate-500"
                    )}
                  >
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", selectedItems.pages ? "bg-neon-green text-night-blue" : "bg-white/5")}>
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className={cn("text-lg font-black", selectedItems.pages ? "text-white" : "text-slate-500")}>{t('import_pages')}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest mt-1">{t('about_contact')}</p>
                    </div>
                    {selectedItems.pages && <CheckCircle2 className="w-6 h-6 text-neon-green mt-2" />}
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <button 
                    onClick={() => setStep('confirm')}
                    className="px-12 py-5 bg-white text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                  >
                    {t('confirm_import')} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'confirm' && importData && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto w-full space-y-10"
              >
                <div className="text-center">
                  <h3 className="text-3xl font-black text-white tracking-tight mb-2">{t('migration_summary')}</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t('review_selection')}</p>
                </div>

                <div className="glass-cosmic p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neon-yellow/10 text-neon-yellow rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-white">{t('import_products')}</span>
                    </div>
                    <span className="font-black text-neon-yellow">{selectedItems.products ? importData.products.length : 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-neon-green/10 text-neon-green rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-white">{t('import_pages')}</span>
                    </div>
                    <span className="font-black text-neon-green">{selectedItems.pages ? 2 : 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 text-slate-400 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-white">{t('source_url')}</span>
                    </div>
                    <span className="font-bold text-slate-500 text-sm">{url}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('select')}
                    className="flex-1 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    {t('back')}
                  </button>
                  <button 
                    onClick={handleImport}
                    disabled={loading}
                    className="flex-[2] py-5 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> {t('confirm_import')}</>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-neon-green text-night-blue rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl neon-glow-green">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white tracking-tight mb-2">{t('migration_success')}</h3>
                  <p className="text-slate-400 font-medium">{t('migration_summary')}: {selectedItems.products ? importData?.products.length : 0} {t('products_imported')}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-12 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  {t('done')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
