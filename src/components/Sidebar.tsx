import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Coins,
  Video,
  History,
  Wallet,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { user, logout } = useAuth();
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'buy-usdt', label: t('buyUsdt'), icon: Coins, badge: '90% OFF' },
    { id: 'clipping', label: t('tiktokOffer'), icon: Video, badge: '$1 / 1k' },
    { id: 'payment-history', label: t('paymentHistory'), icon: History },
    { id: 'withdraw', label: t('withdraw'), icon: Wallet },
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: t('admin'), icon: ShieldAlert, badge: 'ADMIN' });
  }

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-9 left-0 rtl:left-auto rtl:right-0 w-60 bg-black/20 border-r rtl:border-r-0 rtl:border-l border-white/5 z-40 flex flex-col transition-transform duration-300 backdrop-blur-md lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-1 overflow-y-auto flex-1 scrollbar-thin">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {isRTL ? 'قائمة التنقل' : 'Navigation Menu'}
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-white/5 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.badge === 'ADMIN'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : item.badge === '90% OFF'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180 ${
                      isActive ? 'opacity-100 text-cyan-400' : 'text-gray-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Tier Status & Guarantee Card */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-4 rounded-2xl">
            <p className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider mb-1">
              {isRTL ? 'حالة المستوى' : 'Tier Status'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{isRTL ? 'خطة احترافية' : 'PRO PLAN'}</span>
              <span className="text-xs text-cyan-400 font-mono">Lv. 2</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{isRTL ? 'تأكيد TRC20 فوري 100%' : '100% Instant TRC20 Verification'}</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

