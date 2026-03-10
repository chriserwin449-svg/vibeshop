import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  User, 
  Send, 
  MoreVertical, 
  Check, 
  CheckCheck,
  Clock,
  Filter,
  Trash2,
  Mail,
  Phone,
  Info
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  sender: string;
  email?: string;
  content: string;
  read: boolean;
  createdAt: any;
  shopId: string;
  recipient?: string;
}

export const Messages: React.FC = () => {
  const { t, language } = useLanguage();
  const { store } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSender, setSelectedSender] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!store?.id) return;
    setLoading(true);

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef, 
      where('shopId', '==', store.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [store?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSender, messages]);

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedSender || !store?.id) return;
    try {
      await addDoc(collection(db, 'messages'), {
        shopId: store.id,
        sender: 'Store Admin',
        content: reply,
        read: true,
        createdAt: serverTimestamp(),
        recipient: selectedSender
      });
      setReply('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const senders = Array.from(new Set(messages.filter(m => m.sender !== 'Store Admin').map(m => m.sender)));
  const chatMessages = messages.filter(m => 
    m.sender === selectedSender || (m.sender === 'Store Admin' && m.recipient === selectedSender)
  );

  return (
    <div className="h-full flex flex-col bg-transparent relative z-10 overflow-hidden">
      <header className="px-10 py-8 border-b border-white/5 flex items-center justify-between glass-cosmic sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-neon-yellow text-night-blue rounded-lg flex items-center justify-center shadow-lg neon-glow-yellow">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">{language === 'fr' ? 'Messages Clients' : 'Customer Messages'}</h1>
          </div>
          <p className="text-slate-400 text-xs font-medium">{language === 'fr' ? 'Communiquez avec vos clients et répondez à leurs questions.' : 'Communicate with your customers and answer their questions.'}</p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Senders List */}
        <div className="w-80 border-r border-white/5 flex flex-col glass-cosmic">
          <div className="p-6 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-neon-yellow/20 focus:border-neon-yellow transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-white/5 border-t-neon-yellow rounded-full animate-spin" />
              </div>
            ) : senders.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No conversations yet</p>
              </div>
            ) : (
              senders.map(sender => {
                const lastMsg = [...messages].reverse().find(m => m.sender === sender);
                return (
                  <button
                    key={sender}
                    onClick={() => setSelectedSender(sender)}
                    className={cn(
                      "w-full p-4 rounded-2xl flex items-center gap-4 transition-all group",
                      selectedSender === sender ? "bg-neon-yellow text-night-blue neon-glow-yellow" : "hover:bg-white/5 text-slate-400"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border",
                      selectedSender === sender ? "bg-night-blue/10 border-night-blue/20" : "bg-white/5 border-white/10"
                    )}>
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <p className={cn("font-black text-sm truncate", selectedSender === sender ? "text-night-blue" : "text-white")}>{sender}</p>
                        <span className="text-[9px] opacity-60">{lastMsg ? (lastMsg.createdAt?.toDate ? lastMsg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : ''}</span>
                      </div>
                      <p className={cn("text-xs truncate opacity-70", selectedSender === sender ? "text-night-blue" : "text-slate-500")}>
                        {lastMsg?.content}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {selectedSender ? (
            <>
              <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between glass-cosmic">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <User className="w-6 h-6 text-neon-yellow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">{selectedSender}</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-6">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 max-w-[70%]",
                      msg.sender === 'Store Admin' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                      msg.sender === 'Store Admin' ? "bg-neon-yellow text-night-blue" : "bg-white/10 text-white"
                    )}>
                      {msg.sender === 'Store Admin' ? <MessageSquare className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1">
                      <div className={cn(
                        "px-6 py-3 rounded-2xl text-sm shadow-sm",
                        msg.sender === 'Store Admin' 
                          ? "bg-neon-yellow text-night-blue rounded-tr-none" 
                          : "glass-cosmic text-slate-200 border border-white/10 rounded-tl-none"
                      )}>
                        {msg.content}
                      </div>
                      <div className={cn(
                        "flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest opacity-40",
                        msg.sender === 'Store Admin' ? "justify-end" : ""
                      )}>
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.sender === 'Store Admin' && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-8 border-t border-white/5 glass-cosmic">
                <div className="relative flex items-center gap-4 max-w-4xl mx-auto">
                  <input 
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    placeholder={language === 'fr' ? 'Écrivez votre réponse...' : 'Type your reply...'}
                    className="flex-1 px-8 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-neon-yellow/20 focus:border-neon-yellow transition-all"
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={!reply.trim()}
                    className="w-14 h-14 bg-neon-yellow text-night-blue rounded-[1.5rem] flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg neon-glow-yellow"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5">
                <MessageSquare className="w-12 h-12 text-slate-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-500 mb-2">{language === 'fr' ? 'Sélectionnez une conversation' : 'Select a conversation'}</h3>
              <p className="text-slate-600 max-w-xs">{language === 'fr' ? 'Choisissez un client dans la liste pour commencer à discuter.' : 'Choose a customer from the list to start chatting.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
