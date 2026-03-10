import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Package,
  User,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { cn } from '../lib/utils';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  createdAt: any;
}

export const Orders: React.FC = () => {
  const { t, language } = useLanguage();
  const { store } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!store?.id) return;
    setLoading(true);

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef, 
      where('shopId', '==', store.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [store?.id]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      // The onSnapshot will update the UI
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full relative z-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-neon-yellow text-night-blue rounded-xl flex items-center justify-center shadow-lg neon-glow-yellow">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neon-yellow">{t('orders')}</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">{language === 'fr' ? 'Gestion des Commandes' : 'Order Management'}</h1>
          <p className="text-slate-400 font-medium mt-2 max-w-2xl">
            {language === 'fr' ? 'Suivez et gérez les commandes de vos clients en temps réel.' : 'Track and manage your customer orders in real-time.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder={language === 'fr' ? 'Rechercher une commande...' : 'Search orders...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-neon-yellow/20 focus:border-neon-yellow transition-all w-64"
            />
          </div>
          
          <div className="flex items-center gap-2 glass-cosmic px-4 py-2 rounded-xl border border-white/10">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-300 focus:outline-none"
            >
              <option value="all" className="bg-night-blue">{t('all_categories')}</option>
              <option value="pending" className="bg-night-blue">Pending</option>
              <option value="processing" className="bg-night-blue">Processing</option>
              <option value="shipped" className="bg-night-blue">Shipped</option>
              <option value="delivered" className="bg-night-blue">Delivered</option>
              <option value="cancelled" className="bg-night-blue">Cancelled</option>
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-white/5 border-t-neon-yellow rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t('loading')}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="glass-cosmic rounded-[2.5rem] border border-white/5 p-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{language === 'fr' ? 'Aucune commande trouvée' : 'No orders found'}</h3>
              <p className="text-slate-500">{language === 'fr' ? 'Les commandes de vos clients apparaîtront ici.' : 'Your customer orders will appear here.'}</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                layoutId={`order-${order.id}`}
                onClick={() => setSelectedOrder(order)}
                className={cn(
                  "glass-cosmic rounded-3xl border p-6 cursor-pointer transition-all duration-300 group",
                  selectedOrder?.id === order.id ? "border-neon-yellow bg-white/10" : "border-white/5 hover:border-white/20"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <Package className="w-7 h-7 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-white">Order #{order.id}</h3>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          getStatusColor(order.status)
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm font-medium mt-1">{order.customerName} • {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="text-xl font-black text-white">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{order.items.length} items</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-neon-yellow transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-cosmic rounded-[2.5rem] border border-white/10 p-8 sticky top-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white tracking-tight">Order Details</h2>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Status Update */}
                  <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Update Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateOrderStatus(selectedOrder.id, s)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            selectedOrder.status === s 
                              ? getStatusColor(s)
                              : "border-white/5 text-slate-500 hover:border-white/20 hover:text-white"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4 text-neon-yellow" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">{selectedOrder.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">123 E-commerce St, Digital City</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-300">{selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate().toLocaleString() : new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Package className="w-4 h-4 text-neon-yellow" />
                      Order Items
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-night-blue rounded-xl overflow-hidden border border-white/10">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-slate-500">Qty: {item.quantity || 1}</p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-white">${item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 font-medium">Total Amount</p>
                      <p className="text-3xl font-black text-neon-yellow neon-glow-yellow">${selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 glass-cosmic rounded-[3rem] border border-dashed border-white/10">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <ChevronRight className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-black text-slate-500 mb-2">Select an order</h3>
                <p className="text-sm text-slate-600 max-w-xs">Click on an order from the list to view full details and manage its status.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
