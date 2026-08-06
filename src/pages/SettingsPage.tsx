import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Bell, Shield, Lock, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showToast } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [trc20Alerts, setTrc20Alerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    showToast('Preferences saved successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" />
          <span>Account Preferences & Settings</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Customize notifications, security settings, and UI preferences
        </p>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            Security & Authentication
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
            <div>
              <p className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</p>
              <p className="text-xs text-gray-400">Require authenticator code for TRC20 withdrawals</p>
            </div>
            <button
              onClick={() => {
                setTwoFactor(!twoFactor);
                showToast(`2FA ${!twoFactor ? 'enabled' : 'disabled'}`, 'info');
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                twoFactor ? 'bg-cyan-500' : 'bg-gray-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  twoFactor ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
            Notification Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
              <div>
                <p className="text-sm font-bold text-white">Order Status Email Updates</p>
                <p className="text-xs text-gray-400">Get notified when TRC20 deposit is verified</p>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  emailAlerts ? 'bg-cyan-500' : 'bg-gray-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    emailAlerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
              <div>
                <p className="text-sm font-bold text-white">TikTok Clipping Review Alerts</p>
                <p className="text-xs text-gray-400">Instant notification upon reward approval</p>
              </div>
              <button
                onClick={() => setTrc20Alerts(!trc20Alerts)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  trc20Alerts ? 'bg-cyan-500' : 'bg-gray-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-black transition-transform ${
                    trc20Alerts ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
