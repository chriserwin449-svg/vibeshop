import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PLANS } from '../constants';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';

import { useLanguage } from '../contexts/LanguageContext';

interface PricingProps {
  compact?: boolean;
}

export const Pricing: React.FC<PricingProps> = ({ compact = false }) => {
  const { t, language } = useLanguage();
  const { plan: currentPlan, setPlan, subscription } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (plan: typeof PLANS[0]) => {
    if (plan.id === 'free') {
      setPlan('free');
      return;
    }
    setSelectedPlan(plan);
  };

  return (
    <div className={cn("w-full", compact ? "" : "py-20")}>
      {!compact && (
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">{language === 'fr' ? <>Tarification simple <br /> et transparente.</> : <>Simple, transparent <br /> pricing.</>}</h2>
          <p className="text-xl text-slate-400 font-medium">{language === 'fr' ? 'Choisissez le forfait qui correspond à votre ambition.' : 'Choose the plan that fits your ambition.'}</p>
        </div>
      )}

      <div className={cn(
        "grid grid-cols-1 gap-8 mx-auto",
        compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4 max-w-7xl"
      )}>
        {PLANS.map((plan, i) => {
          const isCurrent = currentPlan.id === plan.id;
          const isSelected = selectedPlan?.id === plan.id;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className={cn(
                "relative p-8 rounded-[2.5rem] border flex flex-col transition-all duration-500",
                plan.popular 
                  ? "glass-cosmic border-neon-yellow/30 shadow-[0_0_40px_rgba(250,204,21,0.1)] scale-105 z-10" 
                  : "bg-white/5 border-white/5 hover:border-white/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-neon-yellow text-night-blue px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {language === 'fr' ? 'Plus Populaire' : 'Most Popular'}
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">/mo</span>
                </div>
                <p className="mt-4 text-slate-400 text-xs font-medium leading-relaxed">{language === 'fr' ? plan.descFr : plan.desc}</p>
                <div className="mt-2 text-neon-green text-[10px] font-black uppercase tracking-widest">
                  {plan.commission} {language === 'fr' ? 'Commission sur les ventes' : 'Commission on sales'}
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {(language === 'fr' ? plan.featuresFr : plan.features).map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={cn(
                      "w-4 h-4 mt-0.5 rounded-full flex items-center justify-center shrink-0",
                      plan.popular ? "bg-neon-yellow/20 text-neon-yellow" : "bg-white/10 text-slate-400"
                    )}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 leading-tight">{feature}</span>
                  </div>
                ))}
                {(language === 'fr' ? plan.limitationsFr : plan.limitations)?.map((limitation, idx) => (
                  <div key={idx} className="flex items-start gap-3 opacity-40">
                    <div className="w-4 h-4 mt-0.5 rounded-full flex items-center justify-center shrink-0 bg-white/5 text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 leading-tight">{limitation}</span>
                  </div>
                ))}
              </div>

              {isSelected && plan.id !== 'free' ? (
                <div className="space-y-4">
                  <PayPalScriptProvider options={{ clientId: "test", components: "buttons", intent: "subscription", vault: true }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', shape: 'pill', label: 'subscribe' }}
                      createSubscription={(data, actions) => {
                        return actions.subscription.create({
                          plan_id: 'P-TEST', // In real app, use actual PayPal Plan ID
                        });
                      }}
                      onApprove={async (data, actions) => {
                        setIsProcessing(true);
                        // Simulate API call
                        await new Promise(r => setTimeout(r, 1500));
                        setPlan(plan.id);
                        setSelectedPlan(null);
                        setIsProcessing(false);
                      }}
                    />
                  </PayPalScriptProvider>
                  <button 
                    onClick={() => setSelectedPlan(null)}
                    className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                  >
                    {language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCurrent}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl",
                    isCurrent 
                      ? "bg-white/10 text-slate-500 cursor-not-allowed"
                      : plan.popular 
                        ? "bg-neon-yellow text-night-blue neon-glow-yellow hover:scale-105" 
                        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  )}
                >
                  {isCurrent ? (language === 'fr' ? 'Forfait Actuel' : 'Current Plan') : (language === 'fr' ? plan.buttonTextFr : plan.buttonText)}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
