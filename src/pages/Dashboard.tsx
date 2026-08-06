import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentOrder, ClippingApplication } from '../types';
import { api } from '../lib/api';
import {
  Wallet,
  TrendingUp,
  Coins,
  Video,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { user, refreshUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState<PaymentOrder[]>([]);
  const [clippingApps, setClippingApps] = useState<ClippingApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await refreshUser();
      const [ordersRes, clippingRes] = await Promise.all([
        api.getMyOrders(),
        api.getMyClippingApps()
      ]);
      setRecentOrders(ordersRes.orders || []);
      setClippingApps(clippingRes.applications || []);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (!user) return null;

  const totalBoughtUsdt = recentOrders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.receiveAmount, 0);

  const activeOrdersCount = recentOrders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-[#12161C] to-blue-950/50 border border-cyan-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Pro Member</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">{user.fullName || user.username}</span> 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 max-w-xl leading-relaxed">
              Buy USDT at an incredible <strong className="text-cyan-400 font-bold">90% discount</strong> (Pay $10 for 100 USDT) and convert TikTok video views into instant TRC20 crypto payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('buy-usdt')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center space-x-2"
            >
              <Coins className="w-4 h-4" />
              <span>Buy USDT Now</span>
            </button>
            <button
              onClick={() => setActiveTab('clipping')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30 font-bold text-xs transition-all flex items-center space-x-2"
            >
              <Video className="w-4 h-4 text-purple-400" />
              <span>TikTok Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Professional Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Balance */}
        <div className="bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-5 backdrop-blur-xl transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            ${user.balance.toFixed(2)} <span className="text-xs text-gray-400 font-sans font-bold">USDT</span>
          </p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">TRC20 Network</span>
            <button
              onClick={() => setActiveTab('withdraw')}
              className="text-cyan-400 font-bold hover:underline flex items-center space-x-0.5"
            >
              <span>Withdraw</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 2: Total Purchased USDT */}
        <div className="bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-5 backdrop-blur-xl transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Purchased
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-cyan-400 tracking-tight">
            ${totalBoughtUsdt.toFixed(2)} <span className="text-xs text-gray-400 font-sans font-bold">USDT</span>
          </p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Discount Orders</span>
            <span className="text-emerald-400 font-bold">{recentOrders.filter(o => o.status === 'Completed').length} Done</span>
          </div>
        </div>

        {/* Card 3: TikTok Clipping Earnings */}
        <div className="bg-white/[0.03] border border-white/5 hover:border-purple-500/30 rounded-3xl p-5 backdrop-blur-xl transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              TikTok Rewards
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-purple-300 tracking-tight">
            ${(user.totalEarnings || 0).toFixed(2)} <span className="text-xs text-gray-400 font-sans font-bold">USDT</span>
          </p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Rate: $1.00 / 1k views</span>
            <span className="text-cyan-400 font-bold">{clippingApps.length} Submissions</span>
          </div>
        </div>

        {/* Card 4: Active Orders */}
        <div className="bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 rounded-3xl p-5 backdrop-blur-xl transition-all shadow-lg group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-white tracking-tight">
            {activeOrdersCount} <span className="text-xs text-gray-400 font-sans font-bold">Pending</span>
          </p>
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">15-min TRC20 Window</span>
            <button
              onClick={() => setActiveTab('payment-history')}
              className="text-cyan-400 font-bold hover:underline flex items-center space-x-0.5"
            >
              <span>History</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Offers Preview + TikTok Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Featured Buy USDT Offers */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Coins className="w-5 h-5 text-cyan-400" />
                <span>Featured USDT Discount Deals</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Instant automated delivery upon TRC20 deposit confirmation
              </p>
            </div>
            <button
              onClick={() => setActiveTab('buy-usdt')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View All Offers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Offer Item 1 */}
            <div className="bg-gradient-to-br from-cyan-950/40 via-black/40 to-blue-950/40 border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-400 transition-all">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500 text-black uppercase">
                90% OFF
              </div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Receive</p>
              <p className="text-3xl font-black text-cyan-400 font-mono mb-2">100 USDT</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block">Pay Only</span>
                  <span className="font-bold text-white text-base">10 USDT</span>
                </div>
                <button
                  onClick={() => setActiveTab('buy-usdt')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Offer Item 2 */}
            <div className="bg-gradient-to-br from-purple-950/40 via-black/40 to-blue-950/40 border border-purple-500/30 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-400 transition-all">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500 text-white uppercase">
                POPULAR
              </div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Receive</p>
              <p className="text-3xl font-black text-purple-300 font-mono mb-2">250 USDT</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 block">Pay Only</span>
                  <span className="font-bold text-white text-base">25 USDT</span>
                </div>
                <button
                  onClick={() => setActiveTab('buy-usdt')}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: TikTok Clipping Promo */}
        <div className="bg-gradient-to-br from-blue-950/60 via-purple-950/40 to-black/60 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">TikTok Clipping Offer</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Publish short crypto clips on TikTok. Keep them online for at least 30 days and get paid <strong className="text-cyan-400">$1.00 USD for every 1,000 valid views</strong> directly in USDT TRC20!
            </p>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>$20 Minimum withdrawal threshold</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant submission proof via TikTok Studio</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('clipping')}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center space-x-2"
          >
            <span>Submit Video Application</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-gray-400">Your latest USDT orders and reward submissions</p>
          </div>
          <button
            onClick={loadDashboardData}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs">
            No recent transaction history found. Start by purchasing USDT!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Purchased</th>
                  <th className="pb-3 px-3">Paid</th>
                  <th className="pb-3 px-3">Network</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-bold text-cyan-400">{order.id}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">{order.receiveAmount} USDT</td>
                    <td className="py-3 px-3 text-gray-200">{order.payAmount} USDT</td>
                    <td className="py-3 px-3 text-gray-400">{order.network}</td>
                    <td className="py-3 px-3 text-gray-400 font-sans">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'Pending'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {order.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'Pending' && <Clock className="w-3 h-3 animate-spin" />}
                        {order.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        <span>{order.status}</span>
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
