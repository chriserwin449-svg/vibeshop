import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  X,
  Save,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Products: React.FC = () => {
  const { t, language } = useLanguage();
  const { store, updateProduct, deleteProduct, addProductToStore } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: ''
  });

  const filteredProducts = store?.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        description: '',
        image: '',
        category: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProductToStore(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer ce produit ?' : 'Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow">{language === 'fr' ? 'Gestion de Stock' : 'Inventory Management'}</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-white">{language === 'fr' ? 'Produits' : 'Products'}</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-8 py-4 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          {language === 'fr' ? 'Ajouter un Produit' : 'Add Product'}
        </button>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder={language === 'fr' ? 'Rechercher un produit...' : 'Search products...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all"
          />
        </div>
        <button className="px-6 py-4 glass-cosmic border border-white/10 rounded-2xl text-slate-300 hover:bg-white/5 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" /> {language === 'fr' ? 'Filtres' : 'Filters'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group glass-cosmic rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 py-3 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neon-yellow hover:text-night-blue transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> {t('edit')}
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="w-12 h-12 bg-rose-500/20 backdrop-blur-md text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-night-blue/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black text-neon-yellow uppercase tracking-widest">
                {product.category}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-neon-yellow transition-colors">{product.name}</h3>
                <span className="text-xl font-black text-neon-green">${product.price}</span>
              </div>
              <p className="text-slate-400 text-sm font-medium line-clamp-2 mb-6 flex-1">{product.description}</p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Tag className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{language === 'fr' ? 'En Stock' : 'In Stock'}</span>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-night-blue/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-cosmic p-10 rounded-[3rem] border border-white/10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {editingProduct ? (language === 'fr' ? 'Modifier le Produit' : 'Edit Product') : (language === 'fr' ? 'Nouveau Produit' : 'New Product')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{language === 'fr' ? 'Nom du Produit' : 'Product Name'}</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{language === 'fr' ? 'Prix ($)' : 'Price ($)'}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{language === 'fr' ? 'Catégorie' : 'Category'}</label>
                  <input 
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{language === 'fr' ? 'URL de l\'Image' : 'Image URL'}</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('description')}</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 bg-white/5 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-5 bg-neon-yellow text-night-blue rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {t('save')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
