import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { USDTOffer, PaymentOrder } from '../types';
import { api } from '../lib/api';
import {
  Coins,
  Calculator,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  Layers,
  Star
} from 'lucide-react';

interface BuyUsdtProps {
  setActiveTab: (tab: string) => void;
  onOrderCreated: (order: PaymentOrder) => void;
}

export const BuyUsdt: React.FC<BuyUsdtProps> = ({ setActiveTab, onOrderCreated }) => {
  const { user, showToast } = useAuth();
  const { t } = useLanguage();
  const [offers, setOffers] = useState<USDTOffer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'special' | 'standard'>('all');
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Live Calculator State
  const [desiredUsdt, setDesiredUsdt] = useState<number | string>(250);
  const [customPayAmount, setCustomPayAmount] = useState<number>(25);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await api.getOffers();
        setOffers(data.offers || []);
      } catch (e) {
        console.error('Error loading offers:', e);
      }
    };
    fetchOffers();

    // Ticking interval every second for live countdown
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatRemainingTime = (expiresAtStr: string) => {
    const diff = new Date(expiresAtStr).getTime() - now;
    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const activeOffers = offers.filter((o) => {
    if (o.expiresAt && new Date(o.expiresAt).getTime() <= now) return false;
    if (selectedCategory === 'special') {
      return o.category?.toLowerCase() === 'special';
    }
    if (selectedCategory === 'standard') {
      return !o.category || o.category.toLowerCase() === 'standard';
    }
    return true;
  });

  // Update calculation instantly as user types
  const handleCalculatorInputChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      setDesiredUsdt(val);
      setCustomPayAmount(0);
    } else {
      setDesiredUsdt(num);
      // Formula: Amount to Pay = Desired USDT * 0.10
      setCustomPayAmount(Number((num * 0.10).toFixed(2)));
    }
  };

  const handleCreateOrder = async (receiveAmt: number, payAmt: number) => {
    if (!user) {
      showToast('Please sign in to place an order', 'error');
      setActiveTab('login');
      return;
    }

    if (payAmt <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createOrder(receiveAmt || payAmt, payAmt);
      showToast('Order created! Complete payment within 15 minutes.', 'success');
      onOrderCreated(res.order);
      setActiveTab('payment-page');
    } catch (err: any) {
      showToast(err.message || 'Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{t('flashDeals')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t('buyUsdtTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          {t('buyUsdtSubtitle')}
        </p>
      </div>

      {/* --- LIVE USDT CALCULATOR SECTION --- */}
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-cyan-950/40 via-black/50 to-blue-950/40 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <h2 className="text-lg font-black text-white">{t('calculatorTitle')}</h2>
              <p className="text-xs text-gray-400">{t('calcSubtitle')}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500 text-black px-2.5 py-1 rounded-lg">
            Pay = Desired × 0.10
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Input: Desired USDT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 text-left rtl:text-right">
              {t('desiredAmount')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={desiredUsdt}
                onChange={(e) => handleCalculatorInputChange(e.target.value)}
                placeholder="250"
                className="w-full bg-black/60 border border-cyan-500/40 rounded-2xl px-4 py-3.5 text-xl font-bold font-mono text-cyan-400 placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="absolute right-4 rtl:right-auto rtl:left-4 top-4 text-xs font-bold text-cyan-400/80 font-mono">
                USDT
              </span>
            </div>
          </div>

          {/* Output: Amount to Pay */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 text-left rtl:text-right">
              {t('youWillPay')}
            </label>
            <div className="bg-black/60 border border-emerald-500/40 rounded-2xl px-4 py-3.5 text-xl font-bold font-mono text-emerald-400 flex items-center justify-between">
              <span>${customPayAmount.toFixed(2)}</span>
              <span className="text-xs font-bold text-emerald-400/80 font-mono">USDT (TRC20)</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- PRE-DEFINED OFFER CARDS --- */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Coins className="w-5 h-5 text-cyan-400" />
              <span>{t('discountOffers')}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">TRC20 Instant Delivery</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse bg-black/50 border border-white/10 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('allCategories')}
            </button>
            <button
              onClick={() => setSelectedCategory('special')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
                selectedCategory === 'special'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>{t('specialCategory')}</span>
            </button>
            <button
              onClick={() => setSelectedCategory('standard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === 'standard'
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('standardCategory')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeOffers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white/[0.02] border border-white/5 rounded-3xl">
              <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm text-gray-400 font-semibold">{t('noOffersYet')}</p>
            </div>
          ) : (
            activeOffers.map((offer) => {
              const remainingTimeStr = offer.expiresAt ? formatRemainingTime(offer.expiresAt) : null;
              const isSpecial = offer.category?.toLowerCase() === 'special';

              return (
                <div
                  key={offer.id}
                  className={`bg-white/[0.03] border rounded-3xl p-6 relative flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                    isSpecial
                      ? 'border-purple-500/50 shadow-2xl shadow-purple-500/10 ring-1 ring-purple-500/30'
                      : offer.popular
                      ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'border-white/5 hover:border-cyan-500/40 shadow-xl'
                  }`}
                >
                  {/* Badge & Timer Header */}
                  <div className="flex items-center justify-between -mt-3 mb-2">
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${
                        isSpecial
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : offer.popular
                          ? 'bg-emerald-500 text-black'
                          : 'bg-cyan-500 text-black'
                      }`}
                    >
                      {offer.discountBadge}
                    </div>

                    {remainingTimeStr && (
                      <div className="inline-flex items-center space-x-1 rtl:space-x-reverse px-2.5 py-1 rounded-full text-[10px] font-black font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{remainingTimeStr}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
                          {offer.title || (isSpecial ? 'Special Offer' : t('receive'))}
                        </span>
                        {isSpecial && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {t('specialCategory')}
                          </span>
                        )}
                      </div>

                      {offer.receiveAmount ? (
                        <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
                          {offer.receiveAmount} <span className="text-sm text-gray-300 font-sans font-bold">USDT</span>
                        </div>
                      ) : (
                        <div className="text-3xl font-black text-purple-300 font-sans mt-1">
                          {offer.title || 'Generator'}
                        </div>
                      )}
                    </div>

                    <div className={`rounded-2xl p-3 border ${
                      isSpecial
                        ? 'bg-purple-950/30 border-purple-500/30'
                        : 'bg-black/40 border-white/10'
                    }`}>
                      <span className="text-xs text-gray-400 block font-medium">
                        {isSpecial ? 'Price' : t('payOnly')}
                      </span>
                      <span className={`text-xl font-black font-mono ${
                        isSpecial ? 'text-purple-300' : 'text-white'
                      }`}>
                        {offer.payAmount} USDT{offer.billingPeriod || ''}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-snug">
                      {offer.description || 'Includes priority processing on TRC20 network.'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCreateOrder(offer.receiveAmount || offer.payAmount, offer.payAmount)}
                    disabled={loading}
                    className={`mt-6 w-full py-3 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                      isSpecial
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-110 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : offer.popular
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    }`}
                  >
                    <span>{t('buyNow')}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Security & TRC20 Information Banner */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300 backdrop-blur-xl">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">TRC20 Blockchain Verification</h4>
            <p className="text-gray-400 leading-snug">
              Every deposit is auto-verified against TRON blockchain transactions for instant release.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">15-Minute Price Lock</h4>
            <p className="text-gray-400 leading-snug">
              Your 90% discount rate is locked for 15 minutes upon placing an order.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-0.5">Zero Hidden Fees</h4>
            <p className="text-gray-400 leading-snug">
              The exact payment amount shown is all you pay. No additional commissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
