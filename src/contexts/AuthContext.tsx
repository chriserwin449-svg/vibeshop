import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, planId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('vibe_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed.user);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Login failed with status ${res.status}: ${errorText}`);
        return false;
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibe_user', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Network error during login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, planId: string) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan_id: planId })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Registration failed with status ${res.status}: ${errorText}`);
        return false;
      }

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('vibe_user', JSON.stringify({ user: data.user }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Network error during registration:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibe_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
