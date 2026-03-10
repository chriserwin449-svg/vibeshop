import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError(language === 'fr' ? 'Identifiants invalides' : 'Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-cosmic-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-yellow/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Logo showText variant="gold" className="w-20 h-20 mx-auto mb-4" />
          <p className="text-slate-400 font-medium mt-4">{language === 'fr' ? 'Bon retour parmi nous !' : 'Welcome back!'}</p>
        </div>

        <div className="glass-cosmic p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                <Mail className="w-3 h-3" /> {t('email_address')}
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                <Lock className="w-3 h-3" /> {t('password_label')}
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 text-neon-yellow focus:ring-neon-yellow/20" />
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">{language === 'fr' ? 'Se souvenir de moi' : 'Remember me'}</span>
              </label>
              <button type="button" className="text-xs font-bold text-neon-yellow hover:underline">{language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}</button>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-500 text-xs font-bold text-center"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-neon-yellow text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl neon-glow-yellow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{language === 'fr' ? 'Se Connecter' : 'Login'} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {language === 'fr' ? 'Nouveau sur VibeShop ?' : 'New to VibeShop?'}
              <Link to="/register" className="ml-2 text-neon-yellow hover:underline">{language === 'fr' ? 'Créer un compte' : 'Create account'}</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
