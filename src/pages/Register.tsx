import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Loader2, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PLANS } from '../constants';

export const Register: React.FC = () => {
  const { t, language } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const success = await register(name, email, password, selectedPlan);
    if (success) {
      navigate('/');
    } else {
      setError(language === 'fr' ? 'Une erreur est survenue' : 'An error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-cosmic-dark flex items-center justify-center p-6 relative overflow-hidden py-20">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-yellow/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-green/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-neon-yellow/10 text-neon-yellow rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl neon-glow-yellow border border-neon-yellow/20"
          >
            <ShoppingBag className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">VibeShop</h1>
          <p className="text-slate-400 font-medium">{language === 'fr' ? 'Commencez votre empire aujourd\'hui' : 'Start your empire today'}</p>
        </div>

        <div className="glass-cosmic p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                  <User className="w-3 h-3" /> {t('full_name')}
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white"
                />
              </div>

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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> {language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                </label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-neon-yellow/10 focus:border-neon-yellow transition-all font-bold text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{language === 'fr' ? 'Choisir un Forfait' : 'Select a Plan'}</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PLANS.map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${selectedPlan === plan.id ? 'bg-neon-yellow/10 border-neon-yellow text-white neon-glow-yellow' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">{plan.name}</p>
                    <p className="text-lg font-black">${plan.price}</p>
                  </button>
                ))}
              </div>
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
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{language === 'fr' ? 'Créer mon Compte' : 'Create Account'} <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {language === 'fr' ? 'Déjà un compte ?' : 'Already have an account?'}
              <Link to="/login" className="ml-2 text-neon-yellow hover:underline">{language === 'fr' ? 'Se connecter' : 'Login'}</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
