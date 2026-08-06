import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { WithdrawalRequest } from '../types';
import { api } from '../lib/api';
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  Send,
  AlertCircle
} from 'lucide-react';

interface WithdrawProps {
  setActiveTab: (tab: string) => void;
}

export const Withdraw: React.FC<WithdrawProps> = ({ setActiveTab }) => {
  const { user, settings, showToast, refreshUser } = useAuth();
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState<number | string>(20);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  const minAmount = settings?.minWithdrawalAmount || 20;

  const loadWithdrawals = async () => {
    try {
      await refreshUser();
      const res = await api.getMyWithdrawals();
      setWithdrawals(res.withdrawals || []);
    } catch (e) {
      console.error('Failed to load withdrawals:', e);
    }
  };

  useEffect(() => {
    if (user) {
      loadWithdrawals();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    const numAmt = Number(amount);

    if (isNaN(numAmt) || numAmt < minAmount) {
      showToast(`Minimum withdrawal amount is $${minAmount} USDT`, 'error');
      return;
    }

    if (user.balance < numAmt) {
      showToast('Insufficient USDT balance', 'error');
      return;
    }

    if (!walletAddress || walletAddress.trim().length < 10) {
      showToast('Please enter a valid USDT TRC20 wallet address', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.requestWithdrawal(walletAddress, numAmt);
      showToast('Withdrawal request submitted successfully!', 'success');
      setAmount(minAmount);
      setWalletAddress('');
      await loadWithdrawals();
    } catch (err: any) {
      showToast(err.message || 'Withdrawal failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-cyan-400" />
          <span>Withdraw USDT Earnings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Transfer your purchased or TikTok clipping earnings to any TRC20 wallet
        </p>
      </div>

      {/* 3 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-cyan-500/30 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Available Balance
          </span>
          <span className="text-2xl font-black text-cyan-400 font-mono">
            ${user.balance.toFixed(2)} <span className="text-xs text-gray-300">USDT</span>
          </span>
          <span className="text-[11px] text-gray-400 block mt-1">Ready for withdrawal</span>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Total Earnings
          </span>
          <span className="text-2xl font-black text-white font-mono">
            ${(user.totalEarnings || 0).toFixed(2)} <span className="text-xs text-gray-300">USDT</span>
          </span>
          <span className="text-[11px] text-gray-400 block mt-1">Lifetime rewards earned</span>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
            Pending Earnings
          </span>
          <span className="text-2xl font-black text-purple-400 font-mono">
            ${(user.pendingEarnings || 0).toFixed(2)} <span className="text-xs text-gray-300">USDT</span>
          </span>
          <span className="text-[11px] text-gray-400 block mt-1">Under review</span>
        </div>
      </div>

      {/* Withdrawal Form Card */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Withdrawal Request Form</h2>
            <p className="text-xs text-gray-400">Withdrawal method: USDT TRC20</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Network: TRC20
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wallet Address Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
              Destination USDT TRC20 Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="e.g. TFAx9K3jLs82PqNm10WzXyC49102837465"
              required
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Ensure this address supports TRON TRC20 USDT deposits.
            </p>
          </div>

          {/* Amount Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Amount to Withdraw
              </label>
              <button
                type="button"
                onClick={() => setAmount(user.balance)}
                className="text-xs text-cyan-400 font-bold hover:underline"
              >
                Max (${user.balance.toFixed(2)})
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                min={minAmount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-lg font-bold font-mono text-cyan-400 focus:outline-none focus:border-cyan-400"
              />
              <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400 font-mono">
                USDT
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Minimum withdrawal threshold: <strong className="text-cyan-400">${minAmount}.00 USDT</strong>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || user.balance < minAmount}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Processing Request...' : 'Request Withdrawal'}</span>
          </button>
        </form>
      </div>

      {/* Withdrawal Requests History */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <h3 className="text-base font-bold text-white">Withdrawal History</h3>

        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No withdrawal requests recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-3">Req ID</th>
                  <th className="pb-3 px-3">Wallet Address</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="py-3.5 px-3 text-cyan-400 font-bold">{w.id}</td>
                    <td className="py-3.5 px-3 text-gray-300 max-w-[160px] truncate" title={w.walletAddress}>
                      {w.walletAddress}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 font-bold">
                      ${w.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 font-sans">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          w.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : w.status === 'Pending'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
