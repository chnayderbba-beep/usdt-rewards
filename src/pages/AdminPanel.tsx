import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  PaymentOrder,
  ClippingApplication,
  WithdrawalRequest,
  DashboardStats,
  SystemSettings,
  USDTOffer
} from '../types';
import { api } from '../lib/api';
import {
  ShieldAlert,
  Users,
  ShoppingBag,
  Video,
  Wallet,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Edit3,
  Save,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Coins,
  FileText,
  Plus,
  Trash2,
  Zap
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user, showToast, refreshSettings } = useAuth();
  const { t } = useLanguage();
  const [activeAdminTab, setActiveAdminTab] = useState<
    'stats' | 'orders' | 'clipping' | 'withdrawals' | 'users' | 'settings'
  >('stats');

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [clippingApps, setClippingApps] = useState<ClippingApplication[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [offersList, setOffersList] = useState<USDTOffer[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Screenshot Viewer Modal
  const [screenshotModal, setScreenshotModal] = useState<string | null>(null);

  // Settings Edit State
  const [trc20Address, setTrc20Address] = useState('');
  const [clippingRate, setClippingRate] = useState(1.0);
  const [minWithdrawal, setMinWithdrawal] = useState(20.0);

  // New Offer Form State
  const [newOfferReceive, setNewOfferReceive] = useState<number | string>(500);
  const [newOfferPay, setNewOfferPay] = useState<number | string>(50);
  const [newOfferBadge, setNewOfferBadge] = useState('90% OFF');
  const [newOfferPopular, setNewOfferPopular] = useState(false);
  const [newOfferDesc, setNewOfferDesc] = useState('');
  const [newOfferDuration, setNewOfferDuration] = useState<number | string>(30); // 30 minutes default

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        usersRes,
        ordersRes,
        clippingRes,
        withdrawalsRes,
        settingsRes,
        offersRes
      ] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminOrders(),
        api.getAdminClippingApps(),
        api.getAdminWithdrawals(),
        api.getSettings(),
        api.getAdminOffers()
      ]);

      setStats(statsRes.stats);
      setUsers(usersRes.users || []);
      setOrders(ordersRes.orders || []);
      setClippingApps(clippingRes.applications || []);
      setWithdrawals(withdrawalsRes.withdrawals || []);
      setSettings(settingsRes);
      setOffersList(offersRes.offers || []);

      setTrc20Address(settingsRes.trc20WalletAddress);
      setClippingRate(settingsRes.clippingRatePer1k);
      setMinWithdrawal(settingsRes.minWithdrawalAmount);
    } catch (e: any) {
      showToast(e.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiveNum = Number(newOfferReceive);
    const payNum = Number(newOfferPay);
    const durationNum = Number(newOfferDuration);

    if (isNaN(receiveNum) || receiveNum <= 0 || isNaN(payNum) || payNum <= 0) {
      showToast('Please enter valid USDT receive and pay amounts', 'error');
      return;
    }

    try {
      await api.createOffer({
        receiveAmount: receiveNum,
        payAmount: payNum,
        discountBadge: newOfferBadge || 'SPECIAL DEAL',
        popular: newOfferPopular,
        description: newOfferDesc || undefined,
        durationMinutes: durationNum > 0 ? durationNum : undefined
      });

      showToast('New USDT discount offer created successfully!', 'success');
      setNewOfferDesc('');
      await loadAdminData();
      await refreshSettings();
    } catch (err: any) {
      showToast(err.message || 'Failed to create offer', 'error');
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    try {
      await api.deleteOffer(offerId);
      showToast('Offer deleted successfully!', 'success');
      await loadAdminData();
      await refreshSettings();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete offer', 'error');
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-16 space-y-4">
        <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-gray-400">You must be logged in as an administrator to view this page.</p>
      </div>
    );
  }

  // Handle Order Status Approval / Rejection
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order ${orderId} marked as ${newStatus}!`, 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  // Handle Clipping App Approval / Rejection
  const handleUpdateClippingStatus = async (
    id: string,
    newStatus: string,
    views?: number,
    rewardAmount?: number
  ) => {
    try {
      await api.updateClippingStatus(id, newStatus, views, rewardAmount);
      showToast(`Clipping submission ${id} marked as ${newStatus}!`, 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Clipping update failed', 'error');
    }
  };

  // Handle Withdrawal Approval / Rejection
  const handleUpdateWithdrawalStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateWithdrawalStatus(id, newStatus);
      showToast(`Withdrawal request ${id} marked as ${newStatus}!`, 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Withdrawal update failed', 'error');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAdminSettings({
        trc20WalletAddress: trc20Address,
        clippingRatePer1k: Number(clippingRate),
        minWithdrawalAmount: Number(minWithdrawal)
      });
      await refreshSettings();
      showToast('Platform configuration settings saved successfully!', 'success');
      await loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CONTROL PANEL</span>
          </div>
          <h1 className="text-2xl font-black text-white">Platform Admin Dashboard</h1>
          <p className="text-xs text-gray-400">
            Manage users, approve USDT orders, verify TikTok clipping proofs & wallet settings
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5 self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('stats')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeAdminTab === 'stats'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Statistics</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeAdminTab === 'orders'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>USDT Orders ({orders.filter(o => o.status === 'Pending').length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('clipping')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeAdminTab === 'clipping'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>TikTok Clipping ({clippingApps.filter(c => c.status === 'Pending').length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('withdrawals')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeAdminTab === 'withdrawals'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Withdrawals ({withdrawals.filter(w => w.status === 'Pending').length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeAdminTab === 'users'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeAdminTab === 'settings'
              ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* --- TAB 1: STATISTICS OVERVIEW --- */}
      {activeAdminTab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/[0.03] border border-cyan-500/30 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Total Revenue
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              ${stats.totalRevenue.toFixed(2)} USDT
            </span>
            <span className="text-[11px] text-gray-400 block mt-1">Paid by users for discounted USDT</span>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Total Users
            </span>
            <span className="text-2xl font-black text-white font-mono">{stats.totalUsers}</span>
            <span className="text-[11px] text-gray-400 block mt-1">Registered members</span>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              USDT Orders
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              {stats.completedOrders} / {stats.totalOrders}
            </span>
            <span className="text-[11px] text-gray-400 block mt-1">{stats.pendingOrders} Orders Pending</span>
          </div>

          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 shadow-lg backdrop-blur-xl">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              TikTok Clipping Apps
            </span>
            <span className="text-2xl font-black text-purple-300 font-mono">
              {stats.approvedClippingApps} / {stats.totalClippingApps}
            </span>
            <span className="text-[11px] text-gray-400 block mt-1">Approved applications</span>
          </div>
        </div>
      )}

      {/* --- TAB 2: USDT ORDERS MANAGEMENT --- */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <h3 className="text-base font-bold text-white">Manage USDT Payment Orders</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, order ID, or txHash..."
              className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">User</th>
                  <th className="pb-3 px-3">Receive</th>
                  <th className="pb-3 px-3">Pay Amount</th>
                  <th className="pb-3 px-3">TxID</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {orders
                  .filter(
                    (o) =>
                      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      o.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (o.txHash && o.txHash.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((order) => (
                    <tr key={order.id}>
                      <td className="py-3.5 px-3 font-bold text-cyan-400">{order.id}</td>
                      <td className="py-3.5 px-3 text-gray-200 font-sans">
                        <span className="font-bold">{order.username}</span>
                        <span className="text-[10px] text-gray-500 block">{order.userEmail}</span>
                      </td>
                      <td className="py-3.5 px-3 text-emerald-400 font-bold">{order.receiveAmount} USDT</td>
                      <td className="py-3.5 px-3 text-white font-bold">${order.payAmount} USDT</td>
                      <td className="py-3.5 px-3 text-purple-300 max-w-[120px] truncate" title={order.txHash || ''}>
                        {order.txHash || 'None'}
                      </td>
                      <td className="py-3.5 px-3 font-sans">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : order.status === 'Pending'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-2 font-sans">
                        {order.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px]"
                          >
                            Approve
                          </button>
                        )}
                        {order.status !== 'Rejected' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: TIKTOK CLIPPING APPLICATIONS --- */}
      {activeAdminTab === 'clipping' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white">Review TikTok Clipping Submissions</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-3">App ID</th>
                  <th className="pb-3 px-3">User</th>
                  <th className="pb-3 px-3">TikTok Link</th>
                  <th className="pb-3 px-3">Proof Screenshot</th>
                  <th className="pb-3 px-3">Views & Reward</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {clippingApps.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3.5 px-3 text-cyan-400 font-bold">{app.id}</td>
                    <td className="py-3.5 px-3 text-gray-200 font-sans">
                      <span className="font-bold">{app.username}</span>
                      <span className="text-[10px] text-gray-500 block">{app.userEmail}</span>
                    </td>
                    <td className="py-3.5 px-3 max-w-xs truncate text-purple-300 underline font-sans">
                      <a href={app.videoUrl} target="_blank" rel="noopener noreferrer">
                        {app.videoUrl}
                      </a>
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      {app.screenshotDataUrl ? (
                        <button
                          onClick={() => setScreenshotModal(app.screenshotDataUrl || null)}
                          className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-gray-300 hover:text-white text-[11px] font-semibold flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-gray-500 italic">No proof image</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      <span className="text-white font-bold block">
                        {app.views ? `${app.views.toLocaleString()} views` : 'Unassigned'}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">
                        ${app.estimatedReward ? app.estimatedReward.toFixed(2) : '0.00'} USDT
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : app.status === 'Pending'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2 font-sans">
                      <button
                        onClick={() => {
                          const viewsInput = prompt('Enter verified TikTok view count:', '45000');
                          if (!viewsInput) return;
                          const viewsNum = parseInt(viewsInput, 10);
                          const rewardNum = Number(((viewsNum / 1000) * settings!.clippingRatePer1k).toFixed(2));
                          handleUpdateClippingStatus(app.id, 'Approved', viewsNum, rewardNum);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-500 hover:bg-purple-400 text-black font-bold text-[11px]"
                      >
                        Set Views & Approve
                      </button>
                      <button
                        onClick={() => handleUpdateClippingStatus(app.id, 'Rejected')}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-[11px]"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: WITHDRAWAL REQUESTS --- */}
      {activeAdminTab === 'withdrawals' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white">Manage Withdrawal Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-3">Req ID</th>
                  <th className="pb-3 px-3">User</th>
                  <th className="pb-3 px-3">Wallet Address</th>
                  <th className="pb-3 px-3">Amount</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {withdrawals.map((w) => (
                  <tr key={w.id}>
                    <td className="py-3.5 px-3 text-cyan-400 font-bold">{w.id}</td>
                    <td className="py-3.5 px-3 text-gray-200 font-sans">
                      <span className="font-bold">{w.username}</span>
                      <span className="text-[10px] text-gray-500 block">{w.userEmail}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 max-w-[160px] truncate" title={w.walletAddress}>
                      {w.walletAddress}
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 font-bold">${w.amount.toFixed(2)} USDT</td>
                    <td className="py-3.5 px-3 font-sans">
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
                    <td className="py-3.5 px-3 text-right space-x-2 font-sans">
                      {w.status !== 'Approved' && (
                        <button
                          onClick={() => handleUpdateWithdrawalStatus(w.id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-bold text-[11px]"
                        >
                          Approve
                        </button>
                      )}
                      {w.status !== 'Rejected' && (
                        <button
                          onClick={() => handleUpdateWithdrawalStatus(w.id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold text-[11px]"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 5: USER MANAGEMENT --- */}
      {activeAdminTab === 'users' && (
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white">Registered Platform Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-3">User ID</th>
                  <th className="pb-3 px-3">User Details</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">USDT Balance</th>
                  <th className="pb-3 px-3">Total Earnings</th>
                  <th className="pb-3 px-3 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3.5 px-3 text-cyan-400 font-bold">{u.id}</td>
                    <td className="py-3.5 px-3 font-sans">
                      <span className="text-white font-bold block">{u.fullName || u.username}</span>
                      <span className="text-[10px] text-gray-400">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-black/40 text-gray-300 border border-white/10'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-400 font-bold">
                      ${u.balance.toFixed(2)} USDT
                    </td>
                    <td className="py-3.5 px-3 text-purple-300 font-bold">
                      ${(u.totalEarnings || 0).toFixed(2)} USDT
                    </td>
                    <td className="py-3.5 px-3 text-right text-gray-400 font-sans">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 6: SETTINGS & CONFIGURATION --- */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          {/* General Financial Settings */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
              <Settings className="w-5 h-5 text-cyan-400" />
              <span>Platform Financial Settings</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                  TRC20 Wallet Address (For User USDT Deposits)
                </label>
                <input
                  type="text"
                  value={trc20Address}
                  onChange={(e) => setTrc20Address(e.target.value)}
                  required
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    TikTok Reward Rate ($ USD per 1,000 Views)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={clippingRate}
                    onChange={(e) => setClippingRate(parseFloat(e.target.value))}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    Minimum Withdrawal Threshold ($ USD)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={minWithdrawal}
                    onChange={(e) => setMinWithdrawal(parseFloat(e.target.value))}
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </form>
          </div>

          {/* Manage Offers & Expiration Timers */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  <span>{t('manageOffers')}</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Create discount USDT packages with optional expiration timers. When time ends, offers disappear automatically.
                </p>
              </div>
            </div>

            {/* Create New Offer Form */}
            <form onSubmit={handleCreateOffer} className="bg-black/40 border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-extrabold text-cyan-400 flex items-center space-x-2 rtl:space-x-reverse">
                <Plus className="w-4 h-4" />
                <span>{t('createNewOffer')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    Receive (USDT)
                  </label>
                  <input
                    type="number"
                    value={newOfferReceive}
                    onChange={(e) => setNewOfferReceive(e.target.value)}
                    placeholder="e.g. 500"
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    Pay Amount (USDT)
                  </label>
                  <input
                    type="number"
                    value={newOfferPay}
                    onChange={(e) => setNewOfferPay(e.target.value)}
                    placeholder="e.g. 50"
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    {t('badgeLabel')}
                  </label>
                  <input
                    type="text"
                    value={newOfferBadge}
                    onChange={(e) => setNewOfferBadge(e.target.value)}
                    placeholder="e.g. 90% OFF"
                    required
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    {t('offerDuration')}
                  </label>
                  <select
                    value={newOfferDuration}
                    onChange={(e) => setNewOfferDuration(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    <option value={0}>{t('noExpiry')}</option>
                    <option value={5}>5 Minutes (Flash Sale)</option>
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={180}>3 Hours</option>
                    <option value={360}>6 Hours</option>
                    <option value={1440}>24 Hours (1 Day)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newOfferDesc}
                    onChange={(e) => setNewOfferDesc(e.target.value)}
                    placeholder="e.g. Instant TRC20 transfer with priority validation"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse pt-4 sm:pt-2">
                  <input
                    type="checkbox"
                    id="newOfferPopular"
                    checked={newOfferPopular}
                    onChange={(e) => setNewOfferPopular(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 bg-black border-white/20 rounded"
                  />
                  <label htmlFor="newOfferPopular" className="text-xs font-bold text-gray-300 cursor-pointer">
                    {t('isPopular')}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
              >
                <Plus className="w-4 h-4" />
                <span>{t('createNewOffer')}</span>
              </button>
            </form>

            {/* List of Existing Offers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Current Active & Scheduled Offers ({offersList.length})
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                      <th className="pb-3 px-3">Offer ID</th>
                      <th className="pb-3 px-3">Receive</th>
                      <th className="pb-3 px-3">Pay Amount</th>
                      <th className="pb-3 px-3">Badge</th>
                      <th className="pb-3 px-3">Expiry / Timer</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {offersList.map((offer) => {
                      const isExpired = offer.expiresAt && new Date(offer.expiresAt).getTime() <= Date.now();
                      return (
                        <tr key={offer.id}>
                          <td className="py-3 px-3 font-bold text-cyan-400">{offer.id}</td>
                          <td className="py-3 px-3 text-white font-bold">{offer.receiveAmount} USDT</td>
                          <td className="py-3 px-3 text-emerald-400 font-bold">${offer.payAmount} USDT</td>
                          <td className="py-3 px-3 font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {offer.discountBadge}
                            </span>
                            {offer.popular && (
                              <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                HOT
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-sans">
                            {offer.expiresAt ? (
                              isExpired ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  {t('expiredOffer')}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1 w-fit">
                                  <Clock className="w-3 h-3" />
                                  <span>{new Date(offer.expiresAt).toLocaleTimeString()}</span>
                                </span>
                              )
                            ) : (
                              <span className="text-gray-500 text-[11px] italic">{t('noExpiry')}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-sans">
                            <button
                              type="button"
                              onClick={() => handleDeleteOffer(offer.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold flex items-center space-x-1 ml-auto rtl:ml-0 rtl:mr-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t('deleteOffer')}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Viewer Modal */}
      {screenshotModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12161C] border border-gray-800 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">TikTok Analytics Proof Screenshot</h3>
              <button
                onClick={() => setScreenshotModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-2xl border border-gray-800">
              <img src={screenshotModal} alt="Analytics Proof" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
