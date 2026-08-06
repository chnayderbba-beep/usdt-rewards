import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PaymentOrder } from './types';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { BuyUsdt } from './pages/BuyUsdt';
import { PaymentPage } from './pages/PaymentPage';
import { TikTokClipping } from './pages/TikTokClipping';
import { PaymentHistory } from './pages/PaymentHistory';
import { Withdraw } from './pages/Withdraw';
import { Profile } from './pages/Profile';
import { AdminPanel } from './pages/AdminPanel';
import { SettingsPage } from './pages/SettingsPage';

function MainAppContent() {
  const { user, loading } = useAuth();
  const { isRTL, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<PaymentOrder | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
        <p className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
          Loading Platform...
        </p>
      </div>
    );
  }

  // Unauthenticated view (unless user clicks around)
  const isAuthPage = activeTab === 'login' || activeTab === 'register';

  if (!user && !isAuthPage) {
    return (
      <div className="min-h-screen bg-[#0B0E11] text-gray-100 flex flex-col">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <div className="flex-1">
          <Login setActiveTab={setActiveTab} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-[#EAECEF] flex flex-col selection:bg-cyan-500 selection:text-gray-950 font-sans relative overflow-x-hidden">
      {/* Background Atmosphere Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] -left-[5%] w-[450px] h-[450px] bg-purple-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <div className="flex flex-1 relative">
          {/* Sidebar Navigation */}
          {user && !isAuthPage && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          )}

          {/* Main Workspace Area */}
          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 pb-12 ${
              user && !isAuthPage ? (isRTL ? 'lg:mr-64' : 'lg:ml-64') : 'max-w-7xl mx-auto w-full'
            }`}
          >
            {activeTab === 'login' && <Login setActiveTab={setActiveTab} />}
            {activeTab === 'register' && <Register setActiveTab={setActiveTab} />}

            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}

            {activeTab === 'buy-usdt' && (
              <BuyUsdt
                setActiveTab={setActiveTab}
                onOrderCreated={(order) => {
                  setCurrentOrder(order);
                }}
              />
            )}

            {activeTab === 'payment-page' && (
              <PaymentPage order={currentOrder} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'clipping' && <TikTokClipping setActiveTab={setActiveTab} />}

            {activeTab === 'payment-history' && (
              <PaymentHistory
                setActiveTab={setActiveTab}
                onSelectOrder={(order) => setCurrentOrder(order)}
              />
            )}

            {activeTab === 'withdraw' && <Withdraw setActiveTab={setActiveTab} />}

            {activeTab === 'profile' && <Profile />}

            {activeTab === 'admin' && <AdminPanel />}

            {activeTab === 'settings' && <SettingsPage />}
          </main>
        </div>

        {/* Footer Status Bar */}
        <footer className="h-9 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center justify-between px-4 sm:px-6 text-[10px] text-gray-400 font-mono tracking-tight z-30 sticky bottom-0">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-gray-300 font-bold">{t('gatewayOnline')}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span>
              USDT/USD: <span className="text-cyan-400 font-bold">$1.0002</span>
            </span>
            <span className="hidden md:inline text-gray-500">
              © 2024 NEXUS REWARDS - TRC20 Gateway
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

