import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Save,
  CheckCircle2,
  KeyRound,
  Edit3
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, showToast, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(fullName, phone, email);
      await refreshUser();
      showToast('Profile information updated successfully!', 'success');
      setEditing(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <UserIcon className="w-6 h-6 text-cyan-400" />
          <span>User Profile & Security</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your account details and contact preferences
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Header Avatar & Role Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-black font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.fullName || user.username}</h2>
              <p className="text-xs text-gray-400">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${
                user.role === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}
            >
              {user.role === 'admin' ? 'SYSTEM ADMIN' : 'VERIFIED TRADER'}
            </span>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Details Grid or Edit Form */}
        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                User ID
              </span>
              <span className="text-sm font-mono text-cyan-400 font-bold">{user.id}</span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Username
              </span>
              <span className="text-sm font-semibold text-white">@{user.username}</span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Full Name
              </span>
              <span className="text-sm font-semibold text-white">
                {user.fullName || 'Not provided'}
              </span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Email Address
              </span>
              <span className="text-sm font-semibold text-white">{user.email}</span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Phone Number
              </span>
              <span className="text-sm font-semibold text-white">
                {user.phone || 'Not linked'}
              </span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Registration Date
              </span>
              <span className="text-sm font-mono text-gray-300">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
