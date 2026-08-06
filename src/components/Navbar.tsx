import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Coins,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  TrendingUp,
  Menu,
  X,
  PlusCircle,
  Award,
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Simulated live crypto price updates
  const [prices, setPrices] = useState({
    btc: 91420.50,
    eth: 3415.80,
    trx: 0.241,
    usdt: 1.000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        btc: prev.btc + (Math.random() - 0.48) * 15,
        eth: prev.eth + (Math.random() - 0.48) * 3,
        trx: Number((prev.trx + (Math.random() - 0.49) * 0.001).toFixed(4)),
        usdt: 1.000
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E11]/80 backdrop-blur-xl border-b border-white/5">
      {/* Top Crypto Price Ticker */}
      <div className="bg-black/40 border-b border-white/5 py-1 px-4 text-xs font-mono text-gray-400 flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span className="text-gray-300 font-bold">{t('networkOnline')}</span>
          </span>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-400 text-[11px]">
          <span className="hidden sm:inline">{t('flashSaleHeader')}</span>
          <span className="text-cyan-400 font-bold hidden md:inline">{t('tiktokRateHeader')}</span>

          {/* Quick Language Switcher Button in Top Bar */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 font-sans transition-all text-xs"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">{language === 'ar' ? 'العربية' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-1 w-32 bg-[#12161C] border border-white/10 rounded-xl shadow-2xl py-1 z-50 text-xs font-sans">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left rtl:text-right px-3 py-1.5 flex items-center justify-between hover:bg-white/5 ${
                    language === 'en' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-gray-300'
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {language === 'en' && <span className="text-xs">✓</span>}
                </button>
                <button
                  onClick={() => {
                    setLanguage('ar');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left rtl:text-right px-3 py-1.5 flex items-center justify-between hover:bg-white/5 ${
                    language === 'ar' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-gray-300'
                  }`}
                >
                  <span>🇸🇦 العربية</span>
                  {language === 'ar' && <span className="text-xs">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2.5 rtl:space-x-reverse text-left rtl:text-right focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-black text-lg group-hover:scale-105 transition-transform">
                X
              </div>
              <div>
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent italic">
                    NEXUS REWARDS
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                  TRC20 Gateway & Clipping
                </p>
              </div>
            </button>
          </div>

          {/* Quick Action Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('buy-usdt')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
                activeTab === 'buy-usdt'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>{t('buyUsdt')}</span>
              <span className="ml-1 rtl:mr-1 rtl:ml-0 px-1.5 py-0.5 text-[10px] bg-cyan-500 text-black font-black rounded-md">
                {t('bonus10x')}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('clipping')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
                activeTab === 'clipping'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>{t('tiktokOffer')}</span>
            </button>
          </div>

          {/* Right User Bar */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Main Header Language Button */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all text-xs font-bold shadow-sm"
                title="Change Language / تغيير اللغة"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ar' ? '🇸🇦 العربية' : '🇬🇧 English'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-36 bg-[#12161C] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 text-xs font-sans">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3.5 py-2 flex items-center justify-between hover:bg-white/5 transition-colors ${
                      language === 'en' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-gray-300'
                    }`}
                  >
                    <span className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </span>
                    {language === 'en' && <span className="text-cyan-400 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left rtl:text-right px-3.5 py-2 flex items-center justify-between hover:bg-white/5 transition-colors ${
                      language === 'ar' ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-gray-300'
                    }`}
                  >
                    <span className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span>🇸🇦</span>
                      <span>العربية</span>
                    </span>
                    {language === 'ar' && <span className="text-cyan-400 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* USDT Balance Badge */}
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-cyan-500/30 rounded-xl px-3.5 py-1.5 flex items-center space-x-2.5 rtl:space-x-reverse transition-all shadow-md group"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                    ₮
                  </div>
                  <div className="text-left rtl:text-right">
                    <span className="text-[10px] text-gray-400 block font-medium leading-none">
                      {t('mainBalance')}
                    </span>
                    <span className="text-sm font-bold font-mono text-cyan-400 group-hover:text-cyan-300">
                      ${user.balance.toFixed(2)} USDT
                    </span>
                  </div>
                </button>

                {/* Admin Badge */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className="hidden sm:inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t('admin')}</span>
                  </button>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 rtl:space-x-reverse bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-full pl-3 pr-2 rtl:pl-2 rtl:pr-3 py-1 transition-all"
                  >
                    <span className="hidden sm:block text-xs font-medium text-gray-300">
                      {user.username}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center text-xs shadow">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 bg-[#12161C] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl animate-scale-up">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-xs font-bold text-white truncate">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setProfileOpen(false);
                        }}
                        className="w-full text-left rtl:text-right px-4 py-2 text-xs font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/5 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>{t('profile')}</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setActiveTab('admin');
                            setProfileOpen(false);
                          }}
                          className="w-full text-left rtl:text-right px-4 py-2 text-xs font-medium text-purple-300 hover:bg-purple-500/10 flex items-center space-x-2 rtl:space-x-reverse"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{t('admin')}</span>
                        </button>
                      )}

                      <div className="border-t border-white/5 my-1" />

                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left rtl:text-right px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('signOut')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
                >
                  {t('register')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

