import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Sparkles, Play, Download, Share2, Plus, Bot, Film, Wand2, RefreshCw, Eye, FileText } from 'lucide-react';
import { generateVideoScript, VideoScript } from '../lib/gemini';

export const VideoMarketing: React.FC = () => {
  const { t, language } = useLanguage();
  const { store, plan } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>(store?.products[0]?.id || '');
  const [activeScript, setActiveScript] = useState<VideoScript | null>(null);

  const videoLimits: Record<string, number> = {
    'free': 0,
    'starter': 1,
    'pro': 5,
    'ultra': 8
  };

  const currentLimit = videoLimits[plan.id] || 0;
  const remaining = Math.max(0, currentLimit - generatedVideos.length);

  const handleGenerate = async () => {
    if (remaining <= 0 || !store) return;
    const product = store.products.find(p => p.id === selectedProduct);
    if (!product) return;

    setIsGenerating(true);
    
    try {
      const script = await generateVideoScript(product, language);
      const newVideo = {
        id: Date.now(),
        title: product.name,
        thumbnail: product.image,
        date: new Date().toLocaleDateString(),
        duration: '0:15',
        script: script
      };
      setGeneratedVideos([newVideo, ...generatedVideos]);
      setActiveScript(script);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-10 space-y-10 max-w-7xl mx-auto w-full relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">{t('video_marketing')}</h1>
          <p className="text-slate-400 font-medium mt-1">
            {t('video_marketing_desc')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 glass-cosmic border border-white/10 rounded-xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('videos_remaining')}</p>
            <p className="text-xl font-black text-neon-yellow">{remaining} / {currentLimit}</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || remaining <= 0}
            className="btn-modern px-8 py-3 bg-neon-yellow text-night-blue rounded-xl font-black text-sm uppercase tracking-widest shadow-lg neon-glow-yellow disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {t('generate_videos')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Generation Form / Status */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-cosmic p-8 rounded-[2.5rem] border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-neon-yellow/10 text-neon-yellow rounded-xl flex items-center justify-center border border-neon-yellow/20">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white">{t('ai_config')}</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('product_to_promote')}</label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-neon-yellow/20"
                >
                  {store?.products.map(p => (
                    <option key={p.id} value={p.id} className="bg-night-blue">{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('video_style')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Cinematic', 'TikTok/Reels', 'Minimalist', 'Dynamic'].map(style => (
                    <button key={style} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-neon-yellow hover:border-neon-yellow/30 transition-all">
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-neon-yellow/5 rounded-2xl border border-neon-yellow/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-neon-yellow" />
                  <p className="text-xs font-black text-neon-yellow uppercase tracking-widest">{t('ai_tip')}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {language === 'fr' 
                    ? 'Le style TikTok/Reels génère généralement 30% d\'engagement en plus pour les accessoires.' 
                    : 'TikTok/Reels style usually generates 30% more engagement for accessories.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Library */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white tracking-tight">{t('your_creations')}</h3>
            <div className="flex items-center gap-2 text-slate-500">
              <Film className="w-5 h-5" />
              <span className="text-sm font-bold">{generatedVideos.length} {language === 'fr' ? 'vidéos' : 'videos'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {activeScript && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full glass-cosmic p-8 rounded-[2.5rem] border border-neon-yellow/20 mb-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-white">{t('ai_video_script')}</h3>
                    </div>
                    <button 
                      onClick={() => setActiveScript(null)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {activeScript.scenes.map((scene, i) => (
                      <div key={i} className="flex gap-6 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-neon-yellow font-black shrink-0">
                          {i + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t('visual')}</p>
                            <p className="text-sm font-bold text-white">{scene.visual}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t('audio_voiceover')}</p>
                            <p className="text-sm font-medium text-slate-300 italic">"{scene.audio}"</p>
                          </div>
                        </div>
                        <div className="text-xs font-black text-neon-green self-center">
                          {scene.duration}s
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-neon-green/5 rounded-2xl border border-neon-green/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neon-green mb-1">{language === 'fr' ? 'Appel à l\'Action' : 'Call to Action'}</p>
                      <p className="text-lg font-black text-white">{activeScript.callToAction}</p>
                    </div>
                    <button className="px-6 py-3 bg-neon-green text-night-blue rounded-xl font-black text-xs uppercase tracking-widest shadow-lg neon-glow-green hover:scale-105 transition-all">
                      {t('use_this_script')}
                    </button>
                  </div>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="aspect-video glass-cosmic rounded-3xl border border-neon-yellow/20 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-yellow/10 to-transparent animate-pulse" />
                  <RefreshCw className="w-10 h-10 text-neon-yellow animate-spin" />
                  <p className="text-sm font-black text-neon-yellow uppercase tracking-[0.2em]">{t('generating')}</p>
                </motion.div>
              )}
              {generatedVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group glass-cosmic rounded-3xl border border-white/5 overflow-hidden hover:border-white/10 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button 
                        onClick={() => setActiveScript(video.script)}
                        className="w-12 h-12 bg-neon-yellow text-night-blue rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg neon-glow-yellow"
                      >
                        <Eye className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-white">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-black text-white truncate">{video.title}</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{video.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/5 text-slate-400 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/5 text-slate-400 rounded-lg hover:text-white hover:bg-white/10 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {generatedVideos.length === 0 && !isGenerating && (
              <div className="col-span-full aspect-video glass-cosmic rounded-[2.5rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 mb-6">
                  <Video className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-white mb-2">{t('no_videos_generated')}</h4>
                <p className="text-sm text-slate-500 font-medium max-w-xs">
                  {language === 'fr' 
                    ? 'Utilisez l\'IA pour créer votre première vidéo promotionnelle en un clic.' 
                    : 'Use AI to create your first promotional video with one click.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
