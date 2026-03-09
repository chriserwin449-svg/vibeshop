import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { WinningProducts } from './pages/WinningProducts';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { Preview } from './pages/Preview';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { VideoMarketing } from './pages/VideoMarketing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Logo } from './components/Logo';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-night-blue flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-white/5 border-t-neon-yellow rounded-full animate-spin" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Logo variant="gold" className="w-12 h-12" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[#FDE047] font-black uppercase tracking-[0.3em] text-sm">VibeShop</p>
            <p className="text-[#FDE047]/40 font-bold uppercase tracking-[0.1em] text-[8px] mt-1">Your online store powered by AI</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StoreProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/builder" element={<ProtectedRoute><Layout><Builder /></Layout></ProtectedRoute>} />
              <Route path="/winning-products" element={<ProtectedRoute><Layout><WinningProducts /></Layout></ProtectedRoute>} />
              <Route path="/video" element={<ProtectedRoute><Layout><VideoMarketing /></Layout></ProtectedRoute>} />
              <Route path="/preview" element={<ProtectedRoute><Layout><Preview /></Layout></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </StoreProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
