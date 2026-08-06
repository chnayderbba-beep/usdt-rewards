import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Common
    dashboard: 'Dashboard',
    buyUsdt: 'Buy USDT',
    tiktokOffer: 'TikTok Offer',
    tiktokClipping: 'TikTok Clipping Rewards',
    paymentHistory: 'Payment History',
    withdraw: 'Withdraw Funds',
    profile: 'My Profile',
    settings: 'Settings',
    admin: 'Admin Panel',
    login: 'Log In',
    register: 'Sign Up',
    signOut: 'Sign Out',
    mainBalance: 'Main Balance',
    bonus10x: '10x Bonus',
    networkOnline: 'TRC20 NETWORK ONLINE',
    flashSaleHeader: '90% OFF USDT Flash Sale',
    tiktokRateHeader: 'TikTok $1.00 / 1k Views',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    gatewayOnline: 'TRC20 GATEWAY ONLINE',
    
    // Quick labels & Forms
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    quickBuy: 'Quick Buy USDT',
    clipSubmit: 'Submit TikTok Video',
    withdrawUSDT: 'Withdraw USDT',
    totalEarned: 'Total Rewards Earned',
    ordersCompleted: 'Completed Orders',
    ratePer1k: 'Rate per 1,000 Views',
    minWithdrawal: 'Min Withdrawal',
    fullName: 'Full Name',
    username: 'Username',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signInNow: 'Sign in now',
    signUpNow: 'Sign up now',
    recentActivity: 'Recent Activity',
    accountBalance: 'Account Balance',
    status: 'Status',
    amount: 'Amount',
    date: 'Date',
    action: 'Action',
    pending: 'Pending',
    completed: 'Completed',
    approved: 'Approved',
    rejected: 'Rejected',
    accessPortal: 'Access your USDT exchange portal & reward earnings',
    joinRewards: 'Join NEXUS REWARDS to access exclusive USDT rates & TikTok payouts',
  },
  ar: {
    // Navigation & Common
    dashboard: 'لوحة التحكم',
    buyUsdt: 'شراء USDT',
    tiktokOffer: 'عرض تيك توك',
    tiktokClipping: 'مكافآت كليب تيك توك',
    paymentHistory: 'سجل الدفعات',
    withdraw: 'سحب الأموال',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    admin: 'لوحة التحكم للمسؤول',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    mainBalance: 'الرصيد الرئيسي',
    bonus10x: 'مكافأة 10x',
    networkOnline: 'شبكة TRC20 متصلة',
    flashSaleHeader: 'تخفيضات 90% على USDT',
    tiktokRateHeader: 'تيك توك $1.00 / 1000 مشاهدة',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    gatewayOnline: 'بوابة TRC20 متصلة',

    // Quick labels & Forms
    welcomeBack: 'مرحباً بعودتك',
    createAccount: 'إنشاء حساب جديد',
    quickBuy: 'شراء USDT سريع',
    clipSubmit: 'إرسال فيديو تيك توك',
    withdrawUSDT: 'سحب USDT',
    totalEarned: 'إجمالي المكافآت المكتسبة',
    ordersCompleted: 'الطلبات المكتملة',
    ratePer1k: 'المعدل لكل 1,000 مشاهدة',
    minWithdrawal: 'الحد الأدنى للسحب',
    fullName: 'الاسم الكامل',
    username: 'اسم المستخدم',
    emailAddress: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    rememberMe: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInNow: 'سجل الدخول الآن',
    signUpNow: 'سجل حسابك الآن',
    recentActivity: 'النشاط الأخير',
    accountBalance: 'رصيد الحساب',
    status: 'الحالة',
    amount: 'المبلغ',
    date: 'التاريخ',
    action: 'الإجراء',
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    approved: 'مقبول',
    rejected: 'مرفوض',
    accessPortal: 'الدخول إلى بوابة تبادل USDT وأرباح المكافآت',
    joinRewards: 'انضم إلى NEXUS REWARDS للحصول على أسعار USDT الحصرية ومدفوعات تيك توك',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nexus_app_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus_app_lang', lang);
  };

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
