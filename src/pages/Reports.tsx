import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Zap,
  AlertCircle,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

export const Reports: React.FC = () => {
  const { t, language } = useLanguage();
  const { store } = useStore();

  const insights = [
    {
      title: language === 'fr' ? 'Opportunité de Conversion' : 'Conversion Opportunity',
      description: language === 'fr' ? 'Votre "Collection d\'Été" a un trafic élevé mais une faible conversion. Envisagez d\'ajouter une remise limitée.' : 'Your "Summer Collection" has high traffic but low conversion. Consider adding a limited-time discount.',
      impact: language === 'fr' ? 'Élevé' : 'High',
      icon: TrendingUp,
      color: 'text-neon-green',
      bg: 'bg-neon-green/10',
    },
    {
      title: language === 'fr' ? 'Alerte Inventaire' : 'Inventory Alert',
      description: language === 'fr' ? '3 produits sont en rupture de stock. Réapprovisionnez bientôt pour éviter de perdre des ventes.' : '3 products are running low on stock. Restock soon to avoid losing sales.',
      impact: language === 'fr' ? 'Moyen' : 'Medium',
      icon: AlertCircle,
      color: 'text-neon-yellow',
      bg: 'bg-neon-yellow/10',
    },
    {
      title: language === 'fr' ? 'Fidélisation Client' : 'Customer Loyalty',
      description: language === 'fr' ? 'Les clients fidèles dépensent 40% de plus que les nouveaux. Lancez un programme de fidélité.' : 'Repeat customers spend 40% more than new ones. Launch a loyalty program.',
      impact: language === 'fr' ? 'Élevé' : 'High',
      icon: Users,
      color: 'text-neon-yellow',
      bg: 'bg-neon-yellow/10',
    },
  ];

  return (
    <div className="p-10 space-y-12 max-w-7xl mx-auto relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow">{language === 'fr' ? 'Analyses et Perspectives' : 'Analytics & Insights'}</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-white">{language === 'fr' ? 'Rapports de Performance' : 'Performance Reports'}</h1>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 glass-cosmic border border-white/10 rounded-2xl font-bold text-slate-300 hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-5 h-5" /> {language === 'fr' ? 'Exporter PDF' : 'Export PDF'}
          </button>
          <button className="px-6 py-3 bg-neon-yellow text-night-blue rounded-2xl font-bold hover:scale-105 transition-all shadow-lg neon-glow-yellow">
            {language === 'fr' ? 'Planifier le Rapport' : 'Schedule Report'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* AI Insights Section */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-white/5 text-neon-yellow rounded-lg flex items-center justify-center border border-white/5">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">{language === 'fr' ? 'Perspectives Générées par l\'IA' : 'AI Generated Insights'}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group glass-cosmic p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 flex gap-8 items-start"
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner border border-white/5", insight.bg, insight.color)}>
                    <insight.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-black tracking-tight group-hover:text-neon-yellow transition-colors text-white">{insight.title}</h3>
                      <span className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5", insight.bg, insight.color)}>
                        {insight.impact} {language === 'fr' ? 'Impact' : 'Impact'}
                      </span>
                    </div>
                    <p className="text-slate-400 font-medium leading-relaxed mb-6">{insight.description}</p>
                    <button className="text-neon-yellow font-black text-xs uppercase tracking-widest flex items-center gap-2 group/btn">
                      {language === 'fr' ? 'Appliquer la Suggestion' : 'Apply Suggestion'} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-white/5 text-neon-yellow rounded-lg flex items-center justify-center border border-white/5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">{language === 'fr' ? 'Sources de Trafic' : 'Traffic Sources'}</h2>
            </div>
            <div className="glass-cosmic p-10 rounded-[3rem] border border-white/5">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: language === 'fr' ? 'Direct' : 'Direct', value: 4500, color: '#FACC15' },
                    { name: language === 'fr' ? 'Social' : 'Social', value: 3200, color: '#10B981' },
                    { name: language === 'fr' ? 'Recherche' : 'Search', value: 2800, color: '#FFFFFF' },
                    { name: language === 'fr' ? 'Référence' : 'Referral', value: 1500, color: '#6366F1' },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFFFFF08" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: '#FFFFFF05' }}
                      contentStyle={{ backgroundColor: '#0B1E3F', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                      itemStyle={{ color: '#FACC15', fontWeight: 700 }}
                      labelStyle={{ color: '#FFFFFF', fontWeight: 800 }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                      {
                        [
                          { name: 'Direct', value: 4500, color: '#FACC15' },
                          { name: 'Social', value: 3200, color: '#10B981' },
                          { name: 'Search', value: 2800, color: '#FFFFFF' },
                          { name: 'Referral', value: 1500, color: '#6366F1' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Reports */}
        <div className="space-y-10">
          <section className="bg-night-blue text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-yellow/10 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-8 tracking-tight">{language === 'fr' ? 'Statistiques Résumées' : 'Summary Stats'}</h3>
              <div className="space-y-8">
                {[
                  { label: language === 'fr' ? 'Revenu Total' : 'Total Revenue', value: '$128,430', change: '+12.5%' },
                  { label: language === 'fr' ? 'Valeur Moyenne de Commande' : 'Avg. Order Value', value: '$84.20', change: '+5.2%' },
                  { label: language === 'fr' ? 'Taux de Conversion' : 'Conversion Rate', value: '3.42%', change: '-0.8%' },
                  { label: language === 'fr' ? 'Clients Actifs' : 'Active Customers', value: '12,450', change: '+18.2%' },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-6">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-3xl font-black tracking-tight text-white">{stat.value}</p>
                    </div>
                    <span className={cn("text-xs font-black px-3 py-1 rounded-full", stat.change.startsWith('+') ? "bg-neon-green/10 text-neon-green" : "bg-rose-500/10 text-rose-500")}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-12 py-5 bg-white text-night-blue rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-neon-yellow transition-colors">
                {language === 'fr' ? 'Voir l\'Audit Complet' : 'View Full Audit'}
              </button>
            </div>
          </section>

          <section className="bg-neon-yellow text-night-blue p-10 rounded-[3rem] shadow-xl neon-glow-yellow">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-night-blue/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black tracking-tight">{language === 'fr' ? 'Prévisions de Croissance' : 'Growth Forecast'}</h3>
            </div>
            <p className="text-night-blue/70 font-medium leading-relaxed mb-10">
              {language === 'fr' 
                ? <>Sur la base des tendances actuelles, votre revenu devrait croître de <span className="text-night-blue font-black">24%</span> au cours du prochain trimestre.</> 
                : <>Based on current trends, your revenue is projected to grow by <span className="text-night-blue font-black">24%</span> in the next quarter.</>}
            </p>
            <div className="h-2 bg-night-blue/10 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="h-full bg-night-blue"
              />
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-night-blue/40">
              <span>{language === 'fr' ? 'Actuel' : 'Current'}</span>
              <span>{language === 'fr' ? 'Cible' : 'Target'}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
