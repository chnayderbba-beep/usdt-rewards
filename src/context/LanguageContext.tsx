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

    // Dashboard & Stats
    verifiedMember: 'Verified Pro Member',
    welcomeBackUser: 'Welcome back',
    heroDescription: 'Buy USDT at an incredible 90% discount (Pay $10 for 100 USDT) and convert TikTok video views into instant TRC20 crypto payouts.',
    buyUsdtNow: 'Buy USDT Now',
    availableBalance: 'Available Balance',
    totalPurchased: 'Total Purchased',
    tiktokRewards: 'TikTok Rewards',
    activeOrders: 'Active Orders',
    featuredDeals: 'Featured USDT Discount Deals',
    featuredDealsSub: 'Instant automated delivery upon TRC20 deposit confirmation',
    viewAllOffers: 'View All Offers',
    payOnly: 'Pay Only',
    receive: 'Receive',
    buyNow: 'Buy Now',
    popular: 'POPULAR',
    tiktokClippingPromo: 'Publish short crypto clips on TikTok. Keep them online for at least 30 days and get paid $1.00 USD for every 1,000 valid views directly in USDT TRC20!',
    minThreshold: '$20 Minimum withdrawal threshold',
    instantProof: 'Instant submission proof via TikTok Studio',
    submitVideoApp: 'Submit Video Application',
    recentTransactions: 'Recent Transactions',
    recentTxSub: 'Your latest USDT orders and reward submissions',
    noHistory: 'No recent transaction history found.',
    orderId: 'Order ID',
    purchased: 'Purchased',
    paid: 'Paid',
    network: 'Network',

    // Buy USDT
    flashDeals: 'INSTANT TRC20 FLASH DEALS',
    buyUsdtTitle: 'Buy USDT at Exclusive Discount Rates',
    buyUsdtSubtitle: 'Purchase USDT with 90% instant subsidy. All transactions are securely processed via USDT TRC20 network.',
    calculatorTitle: 'Custom USDT Amount Calculator',
    calcSubtitle: 'Enter the USDT amount you want to receive and get your discounted price',
    desiredAmount: 'How much USDT do you want to receive?',
    youWillPay: 'You Will Pay Only',
    proceedOrder: 'Proceed to Order',
    discountOffers: 'Pre-configured Discount Packages',
    selectPackage: 'Select a Package',

    // Clipping & Withdraw
    videoLink: 'TikTok Video URL',
    viewsCount: 'Total Video Views',
    estimatedPayout: 'Estimated Payout',
    submitClaim: 'Submit Claim for Review',
    trc20Address: 'TRC20 Wallet Address',
    withdrawAmount: 'Withdrawal Amount',
    requestWithdrawal: 'Request Withdrawal',
    accountSettings: 'Account Settings',
    changePassword: 'Change Password',
    saveChanges: 'Save Changes',
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

    // Dashboard & Stats
    verifiedMember: 'عضو محترف موثق',
    welcomeBackUser: 'مرحباً بعودتك',
    heroDescription: 'اشترِ USDT بخصم 90% مذهل (ادفع 10 دولارات مقابل 100 USDT) وحول مشاهدات فيديوهات تيك توك إلى أرباح كريبتو فورية عبر TRC20.',
    buyUsdtNow: 'اشترِ USDT الآن',
    availableBalance: 'الرصيد المتاح',
    totalPurchased: 'إجمالي المشتريات',
    tiktokRewards: 'مكافآت تيك توك',
    activeOrders: 'الطلبات النشطة',
    featuredDeals: 'عروض خصم USDT المميزة',
    featuredDealsSub: 'تسليم تلقائي فوري بمجرد تأكيد إيداع TRC20',
    viewAllOffers: 'عرض جميع العروض',
    payOnly: 'ادفع فقط',
    receive: 'ستستلم',
    buyNow: 'اشترِ الآن',
    popular: 'شائع',
    tiktokClippingPromo: 'انشر مقاطع فيديو قصيرة حول الكريبتو على تيك توك. احتفظ بها لمدة 30 يومًا على الأقل واحصل على 1.00 $ مقابل كل 1000 مشاهدة مقبولة مباشرة كـ USDT TRC20!',
    minThreshold: '20$ الحد الأدنى لسحب الأرباح',
    instantProof: 'إثبات تقديم فوري عبر استوديو تيك توك',
    submitVideoApp: 'تقديم طلب الفيديو',
    recentTransactions: 'المعاملات الأخيرة',
    recentTxSub: 'أحدث طلبات USDT وإرساليات المكافآت الخاصة بك',
    noHistory: 'لم يتم العثور على سجل معاملات حديث. ابدأ بشراء USDT الآن!',
    orderId: 'معرف الطلب',
    purchased: 'المشترات',
    paid: 'المدفوع',
    network: 'الشبكة',

    // Buy USDT
    flashDeals: 'عروض TRC20 الخاطفة الفورية',
    buyUsdtTitle: 'اشترِ USDT بأسعار خصم حصرية',
    buyUsdtSubtitle: 'احصل على USDT مع دعم فوري بنسبة 90%. تتم معالجة جميع المعاملات بأمان عبر شبكة USDT TRC20.',
    calculatorTitle: 'حاسبة كمية USDT المخصصة',
    calcSubtitle: 'أدخل كمية USDT التي تريد استلامها واحصل على سعرك المخفض فوراً',
    desiredAmount: 'كم من USDT تريد أن تستلم؟',
    youWillPay: 'ستدفع فقط',
    proceedOrder: 'متابعة الطلب',
    discountOffers: 'باقات الخصم المجهزة مسبقاً',
    selectPackage: 'اختر باقة',

    // Clipping & Withdraw
    videoLink: 'رابط فيديو تيك توك',
    viewsCount: 'إجمالي مشاهدات الفيديو',
    estimatedPayout: 'الأرباح المقدرة',
    submitClaim: 'إرسال الطلب للمراجعة',
    trc20Address: 'عنوان محفظة TRC20',
    withdrawAmount: 'مبلغ السحب',
    requestWithdrawal: 'طلب السحب',
    accountSettings: 'إعدادات الحساب',
    changePassword: 'تغيير كلمة المرور',
    saveChanges: 'حفظ التغييرات',
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
