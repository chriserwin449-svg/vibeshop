import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Search, Truck, Video, Users as UsersIcon } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useLanguage } from '../contexts/LanguageContext';
import { generateStore, StoreData } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'product_finder' | 'supplier_finder' | 'video_marketing';
}

export const Builder: React.FC = () => {
  const { store, setStore, setIsLoading, isLoading, plan } = useStore();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: t('builder_welcome_msg')
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setIsLoading(true);

    try {
      // System instruction to respect language
      const updatedStore = await generateStore(`${messageText}`, store || undefined);
      setStore(updatedStore);
      
      const assistantResponse = t('builder_success')
        .replace('{name}', updatedStore.name)
        .replace('{count}', updatedStore.products.length.toString())
        .replace('{niche}', updatedStore.niche);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: assistantResponse
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('builder_error')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { id: 'products', icon: Search, label: t('find_products'), prompt: language === 'fr' ? "Trouve-moi des produits gagnants sur AliExpress pour ma boutique." : "Find me winning products on AliExpress for my store." },
    { id: 'suppliers', icon: Truck, label: t('find_suppliers'), prompt: language === 'fr' ? "Analyse les meilleurs fournisseurs pour mes produits." : "Analyze the best suppliers for my products." },
    { id: 'video', icon: Video, label: t('create_video'), prompt: language === 'fr' ? "Génère une vidéo promotionnelle pour mon produit phare." : "Generate a promotional video for my top product." },
    { id: 'collab', icon: UsersIcon, label: t('collaboration'), prompt: language === 'fr' ? "Comment puis-je inviter des collaborateurs ?" : "How can I invite collaborators?" },
  ];

  return (
    <div className="h-full flex flex-col bg-transparent relative z-10">
      <header className="px-10 py-8 border-b border-white/5 flex items-center justify-between glass-cosmic sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">{t('builder_title')}</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">{t('builder_desc')}</p>
        </div>
        {store && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-neon-green/10 text-neon-green rounded-2xl text-xs font-bold border border-neon-green/20 shadow-sm neon-glow-green"
          >
            <Sparkles className="w-4 h-4" />
            {t('store_active')}: {store.name}
          </motion.div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 max-w-5xl mx-auto w-full">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === 'assistant' ? 'bg-neon-yellow text-night-blue neon-glow-yellow' : 'bg-white/10 text-white border border-white/10'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={`max-w-[75%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'assistant' 
                  ? 'glass-cosmic text-slate-200 border border-white/10 rounded-tl-none' 
                  : 'bg-neon-yellow text-night-blue rounded-tr-none neon-glow-yellow'
              }`}>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-inherit prose-headings:text-inherit prose-invert">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-5"
          >
            <div className="w-10 h-10 rounded-2xl bg-neon-yellow text-night-blue flex items-center justify-center shadow-lg neon-glow-yellow animate-pulse">
              <Bot className="w-6 h-6" />
            </div>
            <div className="glass-cosmic px-6 py-4 rounded-[2rem] rounded-tl-none border border-white/10 flex items-center gap-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-neon-yellow rounded-full animate-bounce" />
              </div>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('generating')}</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-10 py-10 border-t border-white/5 glass-cosmic">
        <div className="max-w-4xl mx-auto relative group">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {quickActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleSend(action.prompt)}
                className="btn-modern flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-neon-yellow hover:border-neon-yellow/30 hover:bg-white/10 transition-all"
              >
                <action.icon className="w-3.5 h-3.5" />
                {action.label}
              </button>
            ))}
          </div>

          <div className="absolute -inset-1 bg-gradient-to-r from-neon-yellow to-neon-green rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition-opacity duration-500" />
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat_placeholder')}
              className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-neon-yellow/20 focus:border-neon-yellow transition-all pr-20 text-base font-medium shadow-sm text-white placeholder:text-slate-600"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="absolute right-3 w-14 h-14 bg-neon-yellow text-night-blue rounded-[1.5rem] flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg neon-glow-yellow active:scale-95"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
