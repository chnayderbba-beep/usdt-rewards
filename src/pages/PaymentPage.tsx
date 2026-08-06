import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentOrder } from '../types';
import { QRCodeModal } from '../components/QRCodeModal';
import { api } from '../lib/api';
import {
  Clock,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Coins,
  ArrowLeft,
  XCircle,
  FileCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface PaymentPageProps {
  order: PaymentOrder | null;
  setActiveTab: (tab: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ order, setActiveTab }) => {
  const { settings, showToast, refreshUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasMarkedPaid, setHasMarkedPaid] = useState(false);

  // 15-minute Countdown Timer logic
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  useEffect(() => {
    if (!order) return;

    const expiryTime = new Date(order.expiresAt).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="text-center py-16 space-y-4">
        <Coins className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold text-white">No Active Order Selected</h2>
        <p className="text-sm text-gray-400">Please choose a USDT offer first to proceed to payment.</p>
        <button
          onClick={() => setActiveTab('buy-usdt')}
          className="px-6 py-3 bg-amber-500 text-gray-950 font-bold rounded-xl hover:bg-amber-400"
        >
          Go to Buy USDT
        </button>
      </div>
    );
  }

  const walletAddress = settings?.trc20WalletAddress || order.walletAddress || 'TQn9Y2khEsLJW1ChVwfMSMeRDow5K33333';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    showToast('TRC20 Wallet Address copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.markOrderPaid(order.id, txHash);
      setHasMarkedPaid(true);
      showToast('Payment submitted! Admin is verifying your TRC20 transaction.', 'success');
      refreshUser();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit payment verification', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft <= 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('buy-usdt')}
          className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5 backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Offers</span>
        </button>

        <span className="text-xs font-mono font-bold text-gray-400">
          Order ID: <strong className="text-cyan-400">{order.id}</strong>
        </span>
      </div>

      {/* Main Payment Card */}
      <div className="bg-white/[0.03] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 15-Minute Countdown Header */}
        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className={`w-5 h-5 ${isExpired ? 'text-rose-400' : 'animate-pulse'}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                15-Minute Payment Window
              </p>
              <p className="text-xs text-gray-300">
                {isExpired ? 'Price lock expired. Please create a new order.' : 'Complete payment before time expires.'}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Time Remaining</span>
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                isExpired ? 'text-rose-500' : minutes < 3 ? 'text-amber-400 animate-pulse' : 'text-cyan-400'
              }`}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Order Summary & Network Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-xs text-gray-400 font-semibold block uppercase">You Receive</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">
              {order.receiveAmount} USDT
            </span>
          </div>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Amount to Pay</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">
              ${order.payAmount} USDT
            </span>
          </div>

          <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-400 font-semibold block uppercase">Network</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              {order.network}
            </span>
          </div>
        </div>

        {/* QR Code & Wallet Address Section */}
        <div className="pt-2">
          <QRCodeModal
            walletAddress={walletAddress}
            network={order.network}
            amount={order.payAmount}
            onCopy={handleCopyAddress}
          />
        </div>

        {/* TRC20 Warning Banner */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 space-y-1">
          <div className="flex items-center space-x-2 font-bold text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>CRITICAL PAYMENT WARNING</span>
          </div>
          <p className="leading-relaxed pl-6">
            Only send USDT using the <strong className="text-white underline">TRC20 network</strong>. Sending funds using another network or blockchain (e.g. ERC20, BEP20) may result in permanent loss of funds.
          </p>
        </div>

        {/* Payment Confirmation Form */}
        {!hasMarkedPaid ? (
          <form onSubmit={handleMarkAsPaid} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Transaction Hash / TxID (Optional)
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Paste TRC20 TxID (e.g. 0x3a9b8f...)"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Providing your TxID speeds up automatic confirmation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting || isExpired}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{submitting ? 'Submitting...' : 'I Have Paid'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('buy-usdt')}
                className="py-4 px-6 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-gray-400 hover:text-white font-bold text-sm transition-all"
              >
                Cancel Order
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <FileCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white">Payment Submission Received!</h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Status: <strong className="text-cyan-400">Pending Admin Verification</strong>. Once verified on TRC20 blockchain, {order.receiveAmount} USDT will be added to your available balance.
            </p>
            <button
              onClick={() => setActiveTab('payment-history')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400"
            >
              View Order in Payment History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
