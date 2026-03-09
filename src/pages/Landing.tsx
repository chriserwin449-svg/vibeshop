import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Zap, Shield, Globe, ArrowRight, Play, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Stars } from '../components/Stars';
import { cn } from '../lib/utils';
import { Pricing } from '../components/Pricing';
import { Logo } from '../components/Logo';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const Landing: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-cosmic-dark text-white font-sans selection:bg-neon-yellow/30 overflow-x-hidden">
      <Stars />
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-cosmic border-b border-white/5">
        <div className="container mx-auto px-8 h-20 flex items-center justify-between">
          <Logo showText variant="gold" className="w-10 h-10" />
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-neon-yellow transition-colors">{t('features')}</a>
            <a href="#how-it-works" className="hover:text-neon-yellow transition-colors">{t('process')}</a>
            <a href="#pricing" className="hover:text-neon-yellow transition-colors">{t('pricing')}</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-bold text-slate-300 hover:text-white">{t('sign_in')}</Link>
            <Link to="/builder" className="bg-white text-night-blue px-6 py-2.5 rounded-full text-sm font-bold hover:bg-neon-yellow transition-all shadow-lg neon-glow-yellow">
              {t('get_started')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-yellow/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-neon-green/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass-cosmic rounded-full text-xs font-bold mb-10 shadow-sm border-white/10"
          >
            <span className="flex h-2 w-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-slate-300 uppercase tracking-widest">{language === 'fr' ? 'v2.0 est maintenant disponible' : 'v2.0 is now live'}</span>
            <div className="w-px h-3 bg-white/10 mx-1" />
            <span className="text-neon-yellow flex items-center gap-1">{language === 'fr' ? 'En savoir plus' : 'Read more'} <ArrowRight className="w-3 h-3" /></span>
          </motion.div>
          
          <div className="relative mb-12 py-16 px-4">
            <div className="absolute inset-0 bg-night-blue/40 rounded-[32px] overflow-hidden border border-white/5 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-yellow/5 via-transparent to-neon-green/5" />
            </div>
            
            <motion.h1
              {...fadeInUp}
              className="relative text-7xl md:text-[92px] font-black tracking-tight leading-[0.88] text-white"
            >
              {language === 'fr' ? <>Votre boutique, <br /><span className="text-neon-yellow">créée par l'IA.</span></> : <>Your store, <br /><span className="text-neon-yellow">built with AI.</span></>}
            </motion.h1>
          </div>
          
          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
          >
            {language === 'fr' 
              ? "VibeShop est la première plateforme e-commerce nativement IA. Décrivez votre vision, et nous générerons les produits, les images et une boutique optimisée en quelques secondes." 
              : "VibeShop is the first AI-native ecommerce platform. Describe your vision, and we'll generate the products, images, and high-converting storefront in seconds."}
          </motion.p>
          
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link to="/builder" className="w-full sm:w-auto bg-neon-green text-night-blue px-10 py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 neon-glow-green group">
              {language === 'fr' ? 'Commencer Gratuitement' : 'Start Building Free'} 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto glass-cosmic text-white border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              {language === 'fr' ? 'Voir la Démo' : 'Watch Demo'}
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-8"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">{language === 'fr' ? 'Intégré Parfaitement Avec' : 'Seamlessly Integrated With'}</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              {['Shopify', 'Stripe', 'PayPal', 'Meta', 'Google'].map(brand => (
                <span key={brand} className="text-2xl md:text-4xl font-black tracking-tighter text-white/80 hover:text-neon-yellow transition-all duration-300 cursor-default hover:scale-110">
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 bg-night-blue/20">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">{language === 'fr' ? <>Tout ce dont vous avez besoin <br /> pour lancer en quelques minutes.</> : <>Everything you need <br /> to launch in minutes.</>}</h2>
            <p className="text-lg text-slate-300 font-medium">{language === 'fr' ? "Nous avons automatisé toute la pile e-commerce pour que vous puissiez vous concentrer sur l'essentiel : vendre." : "We've automated the entire ecommerce stack so you can focus on what matters: selling."}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 glass-cosmic p-10 flex flex-col justify-between overflow-hidden relative group border-white/5"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-neon-yellow text-night-blue rounded-2xl flex items-center justify-center mb-8 shadow-lg neon-glow-yellow">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">{t('builder_title')}</h3>
                <p className="text-slate-300 text-lg max-w-md leading-relaxed">{language === 'fr' ? "Notre moteur alimenté par Gemini crée des boutiques uniques adaptées à votre niche. Aucune boutique ne se ressemble." : "Our Gemini-powered engine creates unique storefronts tailored to your niche. No two stores look the same."}</p>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[60%] bg-white/5 rounded-[3rem] rotate-12 group-hover:rotate-6 transition-transform duration-700" />
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 glass-cosmic p-10 bg-night-blue/60 text-white border-white/5"
            >
              <div className="w-14 h-14 bg-white/10 text-neon-green rounded-2xl flex items-center justify-center mb-8 neon-glow-green">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{language === 'fr' ? 'Produits Instantanés' : 'Instant Products'}</h3>
              <p className="text-slate-300 leading-relaxed">{language === 'fr' ? "L'IA génère des descriptions de produits à fort taux de conversion et trouve des images de haute qualité automatiquement." : "AI generates high-converting product descriptions and finds high-quality images automatically."}</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 glass-cosmic p-10 border-white/5"
            >
              <div className="w-14 h-14 bg-white/5 text-neon-yellow rounded-2xl flex items-center justify-center mb-8 neon-glow-yellow">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">{language === 'fr' ? 'Paiements Sécurisés' : 'Secure Payments'}</h3>
              <p className="text-slate-300 leading-relaxed">
                {language === 'fr' ? <>L'intégration de <span className="text-neon-yellow font-bold">PayPal</span> et <span className="text-neon-green font-bold">Stripe</span> garantit que vos clients peuvent payer en toute sécurité partout dans le monde.</> : <>Integrated <span className="text-neon-yellow font-bold">PayPal</span> and <span className="text-neon-green font-bold">Stripe</span> checkout ensures your customers can pay safely from anywhere in the world.</>}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 glass-cosmic p-10 flex flex-col justify-between border-neon-green/20 bg-neon-green/5"
            >
              <div>
                <div className="w-14 h-14 bg-neon-green text-night-blue rounded-2xl flex items-center justify-center mb-8 neon-glow-green">
                  <Globe className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">{language === 'fr' ? 'Prêt pour l\'International' : 'Global Ready'}</h3>
                <p className="text-slate-300 text-lg max-w-md leading-relaxed">{language === 'fr' ? "Support intégré pour l'anglais et le français. Étendez votre portée aux marchés internationaux en un clic." : "Built-in support for English and French. Expand your reach to international markets with a single click."}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">{language === 'fr' ? 'Trois étapes pour lancer' : 'Three steps to launch'}</h2>
            <p className="text-slate-500 font-medium">{language === 'fr' ? 'Le chemin le plus rapide de l\'idée à la première vente.' : 'The fastest path from idea to first sale.'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -z-10" />
            {[
              { step: '01', title: language === 'fr' ? 'Décrire' : 'Describe', desc: language === 'fr' ? 'Dites à notre assistant IA ce que vous voulez vendre et qui est votre public.' : 'Tell our AI assistant what you want to sell and who your audience is.' },
              { step: '02', title: language === 'fr' ? 'Affiner' : 'Refine', desc: language === 'fr' ? 'Discutez avec l\'IA pour ajuster les designs, ajouter des produits ou changer l\'ambiance.' : 'Chat with the AI to tweak designs, add products, or change the vibe.' },
              { step: '03', title: language === 'fr' ? 'Lancer' : 'Launch', desc: language === 'fr' ? 'Connectez votre <span class="text-neon-yellow">PayPal</span> ou <span class="text-neon-green">Stripe</span> et commencez à prendre des commandes immédiatement.' : 'Connect your <span class="text-neon-yellow">PayPal</span> or <span class="text-neon-green">Stripe</span> and start taking orders immediately.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4 relative">
                <div className="w-16 h-16 bg-night-blue border-2 border-neon-yellow rounded-full flex items-center justify-center text-xl font-black mb-8 shadow-xl text-white neon-glow-yellow">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{item.title}</h3>
                <p 
                  className="text-slate-400 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-neon-yellow/5 blur-[160px] rounded-full" />
        </div>
        
        <div className="container mx-auto px-8">
          <Pricing />
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-8">
          <div className="bg-night-blue rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05),transparent)]" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white">{t('ready_to_start')}</h2>
              <p className="text-xl text-slate-300 mb-12 max-w-xl mx-auto font-medium">{t('join_community')}</p>
              <Link to="/builder" className="inline-flex items-center gap-2 bg-neon-yellow text-night-blue px-12 py-6 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl neon-glow-yellow">
                {t('build_now')} <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-cosmic-dark relative z-10">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-xs">
              <Logo showText variant="gold" className="w-10 h-10" />
              <p className="text-slate-400 leading-relaxed">{language === 'fr' ? "La plateforme e-commerce nativement IA pour la prochaine génération d'entrepreneurs." : "The AI-native ecommerce platform for the next generation of entrepreneurs."}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Product</h4>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">{language === 'fr' ? 'Constructeur' : 'Builder'}</a></li>
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">{language === 'fr' ? 'Modèles' : 'Templates'}</a></li>
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">{language === 'fr' ? 'Analyses' : 'Analytics'}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Company</h4>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">{language === 'fr' ? 'À propos' : 'About'}</a></li>
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">{language === 'fr' ? 'Carrières' : 'Careers'}</a></li>
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">{language === 'fr' ? 'Confidentialité' : 'Privacy'}</a></li>
                </ul>
              </div>
              <div className="hidden sm:block">
                <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-slate-500">Social</h4>
                <ul className="space-y-4 text-slate-400 font-medium">
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">Instagram</a></li>
                  <li><a href="#" className="hover:text-neon-yellow transition-colors">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-sm font-medium">
            <p>© 2024 VibeShop AI. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-slate-300 transition-colors">{language === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Service'}</a>
              <a href="#" className="hover:text-slate-300 transition-colors">{language === 'fr' ? 'Politique de cookies' : 'Cookie Policy'}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
