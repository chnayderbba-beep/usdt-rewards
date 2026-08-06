import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentOrder } from '../types';
import { api } from '../lib/api';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Coins,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

interface PaymentHistoryProps {
  setActiveTab: (tab: string) => void;
  onSelectOrder?: (order: PaymentOrder) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ setActiveTab, onSelectOrder }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Rejected'>('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data.orders || []);
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.network.toLowerCase().includes(search.toLowerCase()) ||
      (order.txHash && order.txHash.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>USDT Order Payment History</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track and verify all your USDT purchases on the TRC20 network
          </p>
        </div>

        <button
          onClick={() => setActiveTab('buy-usdt')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center space-x-1.5 self-start"
        >
          <Coins className="w-4 h-4" />
          <span>New USDT Order</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID or TxID..."
            className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center space-x-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-semibold overflow-x-auto w-full sm:w-auto">
          {(['All', 'Pending', 'Completed', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-xs flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading payment records...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <History className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm font-semibold text-gray-300">No Orders Found</p>
            <p className="text-xs text-gray-500">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search filters.'
                : 'You have not placed any USDT discount orders yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 px-3">Order ID</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3">Purchased USDT</th>
                  <th className="pb-3 px-3">Amount Paid</th>
                  <th className="pb-3 px-3">Network</th>
                  <th className="pb-3 px-3">TxID / Hash</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-bold text-cyan-400">{order.id}</td>
                    <td className="py-3.5 px-3 text-gray-400 font-sans">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400">
                      {order.receiveAmount} USDT
                    </td>
                    <td className="py-3.5 px-3 text-gray-200 font-bold">
                      ${order.payAmount} USDT
                    </td>
                    <td className="py-3.5 px-3 text-gray-300 font-sans">
                      <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                        {order.network}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 max-w-[140px] truncate">
                      {order.txHash ? (
                        <span className="text-purple-300 underline" title={order.txHash}>
                          {order.txHash.slice(0, 10)}...
                        </span>
                      ) : (
                        <span className="text-gray-600 font-sans italic">Not provided</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right font-sans">
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
                    <td className="py-3.5 px-3 text-right font-sans">
                      {order.status === 'Pending' && onSelectOrder && (
                        <button
                          onClick={() => {
                            onSelectOrder(order);
                            setActiveTab('payment-page');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px]"
                        >
                          Pay Now
                        </button>
                      )}
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
