import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Database, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Onboarding: React.FC = () => {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('vibe_onboarding_seen');
    if (!hasSeen) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      title: t('onboarding_welcome'),
      desc: t('onboarding_step1'),
      icon: Sparkles,
      color: 'text-neon-yellow',
      bg: 'bg-neon-yellow/10'
    },
    {
      title: t('winning_products'),
      desc: t('onboarding_step2'),
      icon: ShoppingBag,
      color: 'text-neon-green',
      bg: 'bg-neon-green/10'
    },
    {
      title: t('shopify_importer'),
      desc: t('onboarding_step3'),
      icon: Database,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    }
  ];

  const handleClose = () => {
    setShow(false);
    localStorage.setItem('vibe_onboarding_seen', 'true');
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (!show) return null;

  const current = steps[step];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-night-blue/60 backdrop-blur-md"
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg glass-cosmic rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative z-10 p-10 text-center"
        >
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center gap-8">
            <motion.div 
              key={step}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-24 h-24 ${current.bg} ${current.color} rounded-[2rem] flex items-center justify-center shadow-2xl`}
            >
              <current.icon className="w-12 h-12" />
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-3xl font-black text-white tracking-tight">{current.title}</h2>
              <p className="text-slate-400 font-medium leading-relaxed">{current.desc}</p>
            </div>

            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-neon-yellow' : 'bg-white/10'}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-5 bg-white text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {step === steps.length - 1 ? (
                <><CheckCircle2 className="w-5 h-5" /> {t('got_it')}</>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
