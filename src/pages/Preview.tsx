import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ShoppingBag,
  Mail,
  Phone
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Preview: React.FC = () => {
  const { store, cart, addToCart, removeFromCart } = useStore();
  const { t, language } = useLanguage();
  const [view, setView] = useState<'home' | 'product' | 'cart' | 'checkout' | 'about' | 'contact'>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!store) {
    return (
      <div className="h-full flex items-center justify-center bg-transparent p-8 relative z-10">
        <div className="text-center max-w-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-neon-yellow/10 text-neon-yellow rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl neon-glow-yellow border border-neon-yellow/20"
          >
            <ShoppingBag className="w-10 h-10" />
          </motion.div>
          <h2 className="text-3xl font-black mb-3 tracking-tight text-white">{language === 'fr' ? 'Aucune boutique générée' : 'No Store Generated'}</h2>
          <p className="text-slate-400 mb-10 font-medium">{language === 'fr' ? 'Rendez-vous dans le constructeur IA pour créer votre première boutique e-commerce en quelques secondes.' : 'Head over to the AI Builder to create your first ecommerce store in seconds.'}</p>
          <Link 
            to="/builder"
            className="inline-block bg-neon-yellow text-night-blue px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg neon-glow-yellow"
          >
            {language === 'fr' ? 'Aller au Constructeur' : 'Go to Builder'}
          </Link>
        </div>
      </div>
    );
  }

  const theme = store.theme;
  const primaryStyle = { backgroundColor: theme.primaryColor, color: theme.darkMode ? '#fff' : '#000' };
  const textPrimaryStyle = { color: theme.primaryColor };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-24 pb-24"
    >
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          src={`https://picsum.photos/seed/${store.niche}/1920/1080`} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Hero"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="relative container mx-auto px-10 z-10 text-white max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8">
              {language === 'fr' ? 'Nouvelle Collection 2024' : 'New Collection 2024'}
            </span>
            <h1 className="text-7xl md:text-9xl font-black mb-10 leading-[0.85] tracking-tighter">
              {store.description}
            </h1>
            <div className="flex flex-wrap gap-6">
              <button 
                style={primaryStyle}
                className="px-12 py-6 rounded-full font-black text-xl hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl shadow-black/20"
              >
                {language === 'fr' ? 'Acheter Maintenant' : 'Shop Now'} <ArrowRight className="w-6 h-6" />
              </button>
              <button className="px-12 py-6 rounded-full font-black text-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                {language === 'fr' ? 'En savoir plus' : 'Learn More'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow mb-4 block">{language === 'fr' ? 'Sélection Curatée' : 'Curated Selection'}</span>
            <h2 className="text-5xl font-black tracking-tight text-white">{language === 'fr' ? 'Produits Vedettes' : 'Featured Products'}</h2>
          </div>
          <button style={textPrimaryStyle} className="font-black text-lg flex items-center gap-2 group text-neon-yellow">
            {language === 'fr' ? 'Tout Explorer' : 'Explore All'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {store.products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => { setSelectedProduct(product); setView('product'); }}
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/5 mb-6 border border-white/5 group-hover:border-neon-yellow/30 transition-all duration-500">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-neon-yellow text-night-blue neon-glow-yellow"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl tracking-tight group-hover:text-neon-yellow transition-colors text-white">{product.name}</h3>
                  <p className="font-black text-xl text-neon-green">${product.price}</p>
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{product.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white/5 py-24 border-y border-white/5">
        <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            { icon: Truck, title: language === 'fr' ? 'Livraison Gratuite' : 'Free Shipping', desc: language === 'fr' ? 'Sur toutes les commandes de plus de 50$' : 'On all orders over $50' },
            { icon: ShieldCheck, title: language === 'fr' ? 'Paiement Sécurisé' : 'Secure Payment', desc: language === 'fr' ? 'Paiement 100% sécurisé' : '100% secure checkout' },
            { icon: RotateCcw, title: language === 'fr' ? 'Retours Faciles' : 'Easy Returns', desc: language === 'fr' ? 'Garantie de remboursement de 30 jours' : '30-day money back guarantee' },
            { icon: Star, title: language === 'fr' ? 'Qualité Supérieure' : 'Top Quality', desc: language === 'fr' ? 'Matériaux premium sélectionnés' : 'Selected premium materials' },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center glass-cosmic p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-white/5 text-neon-yellow rounded-3xl flex items-center justify-center mb-6 neon-glow-yellow border border-white/5">
                <item.icon className="w-8 h-8" />
              </div>
              <h4 className="font-black text-lg mb-2 text-white">{item.title}</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );

  const renderProduct = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="container mx-auto px-10 py-24 max-w-7xl relative z-10"
    >
      <button 
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs mb-12 hover:text-neon-yellow transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> {language === 'fr' ? 'Retour à la Collection' : 'Back to Collection'}
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/5 border border-white/5 shadow-2xl">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-neon-yellow/10 text-neon-yellow rounded-full text-xs font-black uppercase tracking-[0.2em] border border-neon-yellow/20">
              {selectedProduct.category}
            </span>
            <div className="flex items-center gap-1.5 text-neon-yellow">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-slate-500 text-xs font-bold ml-2 uppercase tracking-widest">({language === 'fr' ? '48 avis' : '48 reviews'})</span>
            </div>
          </div>
          <h1 className="text-6xl font-black mb-6 tracking-tighter leading-tight text-white">{selectedProduct.name}</h1>
          <p className="text-5xl font-black mb-10 text-neon-green">${selectedProduct.price}</p>
          <div className="h-px bg-white/5 w-full mb-10" />
          <p className="text-slate-400 mb-12 leading-relaxed text-xl font-medium">
            {selectedProduct.description}
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => addToCart(selectedProduct)}
              className="flex-1 py-6 rounded-3xl font-black text-xl bg-neon-yellow text-night-blue hover:scale-[1.02] transition-all shadow-2xl neon-glow-yellow active:scale-95"
            >
              {language === 'fr' ? 'Ajouter au Panier' : 'Add to Cart'}
            </button>
            <button className="w-20 h-20 border-2 border-white/5 rounded-3xl flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 text-slate-500 hover:text-neon-yellow">
              <Star className="w-8 h-8" />
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-yellow border border-white/5">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{language === 'fr' ? 'Livraison' : 'Shipping'}</p>
                <p className="text-sm font-bold text-white">{language === 'fr' ? '2-4 Jours Ouvrables' : '2-4 Business Days'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-yellow border border-white/5">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{language === 'fr' ? 'Retours' : 'Returns'}</p>
                <p className="text-sm font-bold text-white">{language === 'fr' ? 'Gratuit sous 30 jours' : 'Free within 30 days'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCart = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-10 py-24 max-w-5xl relative z-10"
    >
      <h1 className="text-5xl font-black mb-16 tracking-tight text-white">{language === 'fr' ? 'Votre Panier' : 'Your Shopping Bag'}</h1>
      {cart.length === 0 ? (
        <div className="text-center py-32 glass-cosmic rounded-[3rem] border-2 border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-white/5">
            <ShoppingCart className="w-10 h-10 text-slate-600" />
          </div>
          <p className="text-slate-500 mb-10 font-bold text-xl">{language === 'fr' ? 'Votre panier est actuellement vide.' : 'Your bag is currently empty.'}</p>
          <button onClick={() => setView('home')} className="font-black text-lg uppercase tracking-widest flex items-center gap-2 mx-auto text-neon-yellow hover:scale-105 transition-transform">
            {language === 'fr' ? 'Commencer vos Achats' : 'Start Shopping'} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-8 items-center group">
                <div className="w-32 h-40 rounded-3xl overflow-hidden bg-white/5 border border-white/5 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img src={item.product.image} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-2xl tracking-tight text-white">{item.product.name}</h3>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-6">{item.product.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">{language === 'fr' ? 'Qté' : 'Qty'}</span>
                      <span className="font-black text-white">{item.quantity}</span>
                    </div>
                    <p className="font-black text-2xl text-neon-green">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="glass-cosmic p-10 rounded-[3rem] h-fit sticky top-32 border border-white/5">
            <h3 className="font-black text-2xl mb-8 tracking-tight text-white">{language === 'fr' ? 'Résumé de la Commande' : 'Order Summary'}</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-xs">
                <span>{language === 'fr' ? 'Sous-total' : 'Subtotal'}</span>
                <span className="text-white">${cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-xs">
                <span>{language === 'fr' ? 'Livraison' : 'Shipping'}</span>
                <span className="text-neon-green">{language === 'fr' ? 'Gratuit' : 'Free'}</span>
              </div>
              <div className="h-px bg-white/5 w-full my-6" />
              <div className="flex justify-between items-end">
                <span className="font-black text-xl tracking-tight text-white">Total</span>
                <span className="text-4xl font-black text-neon-yellow">${cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => setView('checkout')}
              className="w-full py-6 rounded-[2rem] font-black text-xl bg-neon-yellow text-night-blue shadow-2xl neon-glow-yellow hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {language === 'fr' ? 'Passer à la Caisse' : 'Checkout Now'}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderCheckout = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="container mx-auto px-10 py-24 max-w-3xl relative z-10"
    >
      <h1 className="text-5xl font-black mb-16 tracking-tight text-center text-white">{language === 'fr' ? 'Paiement' : 'Checkout'}</h1>
      <div className="glass-cosmic p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-2xl tracking-tight text-white">{language === 'fr' ? 'Vérifier la Commande' : 'Review Order'}</h3>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">{cart.length} {language === 'fr' ? 'Articles' : 'Items'}</span>
          </div>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center py-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <img src={item.product.image} className="w-12 h-12 rounded-xl object-cover border border-white/5" alt="" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-sm text-white">{item.product.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{language === 'fr' ? 'Qté' : 'Qty'}: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-lg text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/5 p-8 rounded-3xl flex justify-between items-center border border-white/5">
            <span className="font-black text-xl tracking-tight text-white">{language === 'fr' ? 'Total Général' : 'Grand Total'}</span>
            <span className="text-4xl font-black text-neon-yellow">${cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center neon-glow-yellow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-black text-2xl tracking-tight text-white">{language === 'fr' ? 'Paiement Sécurisé' : 'Secure Payment'}</h3>
          </div>
          <PayPalScriptProvider options={{ clientId: "test" }}>
            <PayPalButtons 
              style={{ layout: "vertical", shape: "pill", label: "pay" }} 
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [{
                    amount: {
                      currency_code: "USD",
                      value: cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)
                    }
                  }]
                });
              }}
            />
          </PayPalScriptProvider>
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
            {language === 'fr' ? 'Votre paiement est crypté et sécurisé.' : 'Your payment is encrypted and secure.'}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`min-h-full bg-cosmic-dark/50 backdrop-blur-sm font-[${theme.fontFamily}] selection:bg-neon-yellow/30 relative z-10`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-cosmic border-b border-white/5">
        <div className="container mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <button 
              onClick={() => setView('home')} 
              className="text-3xl font-black tracking-tighter hover:scale-105 transition-transform text-white"
            >
              {store.name.toUpperCase()}
            </button>
            <div className="hidden md:flex items-center gap-10 text-xs font-black uppercase tracking-[0.3em] text-slate-500">
              <button onClick={() => setView('home')} className={cn("hover:text-neon-yellow transition-colors", view === 'home' && "text-neon-yellow")}>{language === 'fr' ? 'Accueil' : 'Home'}</button>
              <button onClick={() => setView('about')} className={cn("hover:text-neon-yellow transition-colors", view === 'about' && "text-neon-yellow")}>{language === 'fr' ? 'À Propos' : 'About'}</button>
              <button onClick={() => setView('contact')} className={cn("hover:text-neon-yellow transition-colors", view === 'contact' && "text-neon-yellow")}>{language === 'fr' ? 'Contact' : 'Contact'}</button>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={() => setView('cart')} className="relative group">
              <div className="p-3 hover:bg-white/5 rounded-2xl transition-all group-active:scale-90 text-white">
                <ShoppingCart className="w-7 h-7" />
              </div>
              {cart.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-neon-yellow text-night-blue text-[10px] font-black rounded-full flex items-center justify-center shadow-lg neon-glow-yellow"
                >
                  {cart.length}
                </motion.span>
              )}
            </button>
            <button className="md:hidden p-3 hover:bg-white/5 rounded-2xl text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <AnimatePresence mode="wait">
        <main key={view}>
          {view === 'home' && renderHome()}
          {view === 'product' && renderProduct()}
          {view === 'cart' && renderCart()}
          {view === 'checkout' && renderCheckout()}
          {view === 'about' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="container mx-auto px-10 py-32 max-w-4xl relative z-10"
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow mb-6 block">{language === 'fr' ? 'Notre Histoire' : 'Our Story'}</span>
              <h1 className="text-7xl font-black mb-16 tracking-tighter leading-tight text-white">{language === 'fr' ? <>Créer des expériences, <br /> pas seulement des produits.</> : <>Crafting experiences, <br /> not just products.</>}</h1>
              <div className="prose prose-2xl text-slate-400 leading-relaxed font-medium prose-invert">
                {store.pages.about}
              </div>
            </motion.div>
          )}
          {view === 'contact' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="container mx-auto px-10 py-32 max-w-6xl relative z-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow mb-6 block">{language === 'fr' ? 'Contactez-nous' : 'Get in Touch'}</span>
                  <h1 className="text-7xl font-black mb-10 tracking-tighter leading-tight text-white">{language === 'fr' ? <>Nous sommes là <br /> pour vous aider.</> : <>We're here <br /> to help.</>}</h1>
                  <p className="text-xl text-slate-400 mb-16 font-medium leading-relaxed">{language === 'fr' ? 'Vous avez une question sur nos produits ou une commande existante ? Notre équipe est prête à vous aider.' : 'Have a question about our products or an existing order? Our team is ready to assist you.'}</p>
                  
                  <div className="space-y-10">
                    <div className="flex items-center gap-6 group">
                      <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-neon-yellow group-hover:bg-neon-yellow group-hover:text-night-blue transition-all duration-500 border border-white/5">
                        <Mail className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{language === 'fr' ? 'Support Email' : 'Email Support'}</p>
                        <p className="text-xl font-black text-white">{store.pages.contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                      <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-neon-yellow group-hover:bg-neon-yellow group-hover:text-night-blue transition-all duration-500 border border-white/5">
                        <Phone className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{language === 'fr' ? 'Ligne Directe' : 'Direct Line'}</p>
                        <p className="text-xl font-black text-white">{store.pages.contact.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-cosmic p-12 rounded-[3.5rem] border border-white/5">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{language === 'fr' ? 'Nom Complet' : 'Full Name'}</label>
                      <input type="text" placeholder="John Doe" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{language === 'fr' ? 'Adresse Email' : 'Email Address'}</label>
                      <input type="email" placeholder="john@example.com" className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{language === 'fr' ? 'Message' : 'Message'}</label>
                      <textarea placeholder={language === 'fr' ? 'Comment pouvons-nous vous aider ?' : 'How can we help?'} rows={5} className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold resize-none text-white"></textarea>
                    </div>
                    <button 
                      className="w-full py-6 rounded-2xl font-black text-xl bg-neon-yellow text-night-blue shadow-2xl neon-glow-yellow hover:scale-[1.02] active:scale-[0.98] transition-all"
                      onClick={(e) => e.preventDefault()}
                    >
                      {language === 'fr' ? 'Envoyer le Message' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-cosmic-dark text-white py-32 border-t border-white/5">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-24">
            <div className="md:col-span-6">
              <h3 className="text-5xl font-black mb-10 tracking-tighter text-white">{store.name.toUpperCase()}</h3>
              <p className="text-slate-400 max-w-md leading-relaxed text-lg font-medium">{store.description}</p>
              <div className="mt-12 flex gap-6">
                {['Instagram', 'Twitter', 'Facebook'].map(social => (
                  <button key={social} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5">
                    <Star className="w-5 h-5 text-neon-yellow shadow-sm" />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-10">{language === 'fr' ? 'Boutique' : 'Shop'}</h4>
              <ul className="space-y-6 text-lg font-bold">
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Nouveautés' : 'New Arrivals'}</button></li>
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Meilleures Ventes' : 'Best Sellers'}</button></li>
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Collections' : 'Collections'}</button></li>
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Soldes' : 'Sale'}</button></li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-10">{language === 'fr' ? 'Support' : 'Support'}</h4>
              <ul className="space-y-6 text-lg font-bold">
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Politique de Livraison' : 'Shipping Policy'}</button></li>
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Politique de Retour' : 'Return Policy'}</button></li>
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}</button></li>
                <li><button className="hover:text-neon-yellow transition-colors text-slate-300">{language === 'fr' ? 'Conditions d\'Utilisation' : 'Terms of Service'}</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
            <div className="flex items-center gap-8">
              <p>© 2024 {store.name}. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
              <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <span className="text-white font-black tracking-tighter text-sm">STRIPE</span>
                <span className="text-white font-black tracking-tighter text-sm">PAYPAL</span>
                <span className="text-white font-black tracking-tighter text-sm">APPLE PAY</span>
              </div>
            </div>
            <div className="flex gap-12">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">{language === 'fr' ? 'Confidentialité' : 'Privacy'}</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">{language === 'fr' ? 'Conditions' : 'Terms'}</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">{language === 'fr' ? 'Cookies' : 'Cookies'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
