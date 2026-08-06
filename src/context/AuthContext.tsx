import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PaymentOrder, SystemSettings } from '../types';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../lib/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  settings: SystemSettings | null;
  activeOrder: PaymentOrder | null;
  toasts: Toast[];
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, username: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  setActiveOrder: (order: PaymentOrder | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [activeOrder, setActiveOrderState] = useState<PaymentOrder | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setActiveOrder = (order: PaymentOrder | null) => {
    setActiveOrderState(order);
    if (order) {
      localStorage.setItem('active_order_id', order.id);
    } else {
      localStorage.removeItem('active_order_id');
    }
  };

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load system settings:', e);
    }
  };

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (e) {
      console.error('Failed to fetch current user:', e);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    setAuthToken(data.token);
    setUser(data.user);
    showToast(`Welcome back, ${data.user.fullName || data.user.username}!`, 'success');
  };

  const register = async (fullName: string, username: string, email: string, pass: string) => {
    const data = await api.register(fullName, username, email, pass);
    setAuthToken(data.token);
    setUser(data.user);
    showToast('Account created successfully!', 'success');
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setActiveOrder(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        settings,
        activeOrder,
        toasts,
        login,
        register,
        logout,
        refreshUser,
        refreshSettings,
        setActiveOrder,
        showToast,
        removeToast,
      }}
    >
      {children}
      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-medium border backdrop-blur-xl transition-all duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                : 'bg-gray-900/90 text-amber-200 border-amber-500/40'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                toast.type === 'success'
                  ? 'bg-emerald-400 animate-ping'
                  : toast.type === 'error'
                  ? 'bg-rose-400 animate-ping'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
