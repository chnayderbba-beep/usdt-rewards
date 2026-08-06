import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClippingApplication } from '../types';
import { api } from '../lib/api';
import {
  Video,
  Upload,
  Link,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  X,
  Send,
  Coins
} from 'lucide-react';

interface TikTokClippingProps {
  setActiveTab: (tab: string) => void;
}

export const TikTokClipping: React.FC<TikTokClippingProps> = ({ setActiveTab }) => {
  const { user, showToast } = useAuth();
  const [videoUrl, setVideoUrl] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<ClippingApplication | null>(null);
  const [myApplications, setMyApplications] = useState<ClippingApplication[]>([]);

  // FAQ open toggles
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (user) {
      api.getMyClippingApps().then((data) => {
        setMyApplications(data.applications || []);
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be 10 MB or smaller', 'error');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Accepted formats: JPG, PNG, PDF', 'error');
      return;
    }

    setScreenshotFile(file);

    // FileReader preview
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please sign in to submit a TikTok video', 'error');
      setActiveTab('login');
      return;
    }

    if (!videoUrl || !videoUrl.includes('tiktok.com')) {
      showToast('Please enter a valid TikTok video URL', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitClippingApp(
        videoUrl,
        screenshotFile?.name,
        screenshotPreview || undefined
      );

      setSubmittedApp(res.application);
      setMyApplications((prev) => [res.application, ...prev]);
      showToast('Application Submitted Successfully. Status: Pending Review.', 'success');
      setVideoUrl('');
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } catch (err: any) {
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does the TikTok clipping reward program work?',
      a: 'Publish crypto, trading, or USDT-related short clips on your TikTok channel. Keep the video published for at least 30 days. Upload your TikTok Studio analytics screenshot and video link to claim $1.00 USD for every 1,000 valid views.'
    },
    {
      q: 'What is the minimum withdrawal requirement?',
      a: 'The minimum withdrawal threshold is $20.00 USD. Once your reward earnings reach $20, you can request an instant withdrawal to your USDT TRC20 wallet address.'
    },
    {
      q: 'How long does review take?',
      a: 'Our admin team reviews video analytics submissions within 24 to 48 hours. Once approved, earnings are credited directly to your account balance.'
    },
    {
      q: 'What screenshot proof is required?',
      a: 'Upload a clear screenshot of your TikTok Studio analytics page showing total video views, retention rate, and published date.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Offer Header Card */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#12161C] to-blue-950/50 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>TIKTOK CREATOR PARTNER PROGRAM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              TikTok Clipping Rewards Program
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Monetize your TikTok audience effortlessly. Clip and publish short crypto videos, maintain them for 30 days, and get paid directly in USDT.
            </p>
          </div>

          <div className="bg-black/60 border border-purple-500/40 rounded-2xl p-5 text-center min-w-[220px] backdrop-blur-xl">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Reward Rate
            </span>
            <span className="text-3xl font-black text-cyan-400 font-mono my-1 block">
              $1.00 USD
            </span>
            <span className="text-xs text-purple-300 font-bold block">
              per 1,000 Valid Views
            </span>
          </div>
        </div>
      </div>

      {/* Program Rules & Eligibility Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-2 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-3">
            1
          </div>
          <h3 className="text-base font-bold text-white">30-Day Publication Rule</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            The TikTok video must remain published on your TikTok channel for at least <strong className="text-cyan-400">30 days</strong>. Deleted videos will forfeit rewards.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-2 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-3">
            2
          </div>
          <h3 className="text-base font-bold text-white">$1.00 per 1,000 Views</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Earn $1 USD for every 1,000 authentic, valid views logged in your official TikTok Studio analytics dashboard.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-2 backdrop-blur-xl">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold mb-3">
            3
          </div>
          <h3 className="text-base font-bold text-white">$20 Minimum Withdrawal</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Withdrawals start at $20.00 USD. Request direct transfers to your USDT TRC20 wallet anytime threshold is reached.
          </p>
        </div>
      </div>

      {/* SUBMISSION FORM SECTION */}
      <div className="bg-white/[0.03] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <Video className="w-5 h-5 text-purple-400" />
            <span>Submit Your TikTok Video Application</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Upload your analytics screenshot and paste your published TikTok link below
          </p>
        </div>

        {submittedApp && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-300 text-sm">
                Application Submitted Successfully!
              </p>
              <p className="text-gray-300 mt-0.5">
                Status: <strong className="text-cyan-400">Pending Review</strong>. ID: {submittedApp.id}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Upload Proof Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              1. Upload Proof (TikTok Studio Analytics Screenshot)
            </label>

            <div className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-6 text-center bg-black/40 transition-all relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {screenshotPreview ? (
                <div className="space-y-2">
                  <div className="max-w-xs mx-auto max-h-40 overflow-hidden rounded-xl border border-purple-500/30 shadow">
                    {screenshotFile?.type === 'application/pdf' ? (
                      <div className="p-4 bg-gray-900 text-cyan-400 font-mono text-xs flex items-center justify-center space-x-2">
                        <FileText className="w-6 h-6" />
                        <span>{screenshotFile.name}</span>
                      </div>
                    ) : (
                      <img
                        src={screenshotPreview}
                        alt="Screenshot Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{screenshotFile?.name} Selected</span>
                  </p>
                  <p className="text-[10px] text-gray-500">Click to change screenshot</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-300 underline">
                      Click or Drag & Drop Screenshot Here
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Accepted formats: JPG, PNG, PDF (Max 10 MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Video Link Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              2. TikTok Video URL
            </label>
            <div className="relative">
              <Link className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@username/video/123456789"
                required
                className="w-full bg-black/60 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              Must be a public TikTok URL from your channel.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !videoUrl}
            className="w-full py-4 px-6 rounded-2xl bg-purple-500 hover:bg-purple-400 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
          </button>
        </form>
      </div>

      {/* User Submission History */}
      {myApplications.length > 0 && (
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-bold text-white">Your TikTok Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold uppercase">
                  <th className="pb-3 px-3">App ID</th>
                  <th className="pb-3 px-3">TikTok Link</th>
                  <th className="pb-3 px-3">Views</th>
                  <th className="pb-3 px-3">Reward</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {myApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3 px-3 text-cyan-400 font-bold">{app.id}</td>
                    <td className="py-3 px-3 max-w-xs truncate text-purple-300 underline">
                      <a href={app.videoUrl} target="_blank" rel="noopener noreferrer">
                        {app.videoUrl}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      {app.views ? app.views.toLocaleString() : 'Pending'}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {app.estimatedReward ? `$${app.estimatedReward.toFixed(2)} USDT` : '-'}
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-sans">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 backdrop-blur-xl">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Frequently Asked Questions (FAQ)</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-semibold text-sm text-gray-200 hover:text-cyan-400 flex items-center justify-between transition-all"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
