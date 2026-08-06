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
  Lock
} from 'lucide-react';

interface BuyUsdtProps {
  setActiveTab: (tab: string) => void;
  onOrderCreated: (order: PaymentOrder) => void;
}

export const BuyUsdt: React.FC<BuyUsdtProps> = ({ setActiveTab, onOrderCreated }) => {
  const { user, showToast } = useAuth();
  const { t } = useLanguage();
  const [offers, setOffers] = useState<USDTOffer[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, []);

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

    if (receiveAmt <= 0 || payAmt <= 0) {
      showToast('Please enter a valid USDT amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createOrder(receiveAmt, payAmt);
      showToast('USDT order created! Complete payment within 15 minutes.', 'success');
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

        {/* Instant Buy Calculated Amount Button */}
        <button
          onClick={() =>
            handleCreateOrder(Number(desiredUsdt) || 0, customPayAmount)
          }
          disabled={loading || !desiredUsdt || Number(desiredUsdt) <= 0}
          className="mt-6 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-sm sm:text-base shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
        >
          <span>{t('buyNow')} ({desiredUsdt || 0} USDT - ${customPayAmount} USDT)</span>
          <ArrowRight className="w-5 h-5 rtl:rotate-180" />
        </button>
      </div>

      {/* --- PRE-DEFINED OFFER CARDS --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white flex items-center space-x-2 rtl:space-x-reverse">
            <Coins className="w-5 h-5 text-cyan-400" />
            <span>{t('discountOffers')}</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">TRC20 Instant Delivery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white/[0.03] border rounded-3xl p-6 relative flex flex-col justify-between backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
                offer.popular
                  ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'border-white/5 hover:border-cyan-500/40 shadow-xl'
              }`}
            >
              {/* Badge */}
              <div
                className={`absolute -top-3 left-6 rtl:left-auto rtl:right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg ${
                  offer.popular
                    ? 'bg-emerald-500 text-black'
                    : 'bg-cyan-500 text-black'
                }`}
              >
                {offer.discountBadge}
              </div>

              <div className="mt-2 space-y-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">
                    {t('receive')}
                  </span>
                  <div className="text-3xl font-black text-cyan-400 font-mono mt-1">
                    {offer.receiveAmount} <span className="text-sm text-gray-300 font-sans font-bold">USDT</span>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
                  <span className="text-xs text-gray-400 block font-medium">{t('payOnly')}</span>
                  <span className="text-xl font-black text-white font-mono">
                    {offer.payAmount} USDT
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-snug">
                  {offer.description || 'Includes priority processing on TRC20 network.'}
                </p>
              </div>

              <button
                onClick={() => handleCreateOrder(offer.receiveAmount, offer.payAmount)}
                disabled={loading}
                className={`mt-6 w-full py-3 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse ${
                  offer.popular
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                }`}
              >
                <span>{t('buyNow')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          ))}
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
