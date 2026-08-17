import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  walletAddress: string;
  network?: string;
  amount?: number;
  onCopy?: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  walletAddress,
  network = 'TRC20',
  amount,
  onCopy
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic realistic 23x23 QR matrix pattern from wallet address
  const generateGrid = (str: string) => {
    const size = 23;
    const grid = Array(size).fill(0).map(() => Array(size).fill(false));
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip finder pattern zones (7x7 corners)
        if (
          (r < 7 && c < 7) ||
          (r < 7 && c >= size - 7) ||
          (r >= size - 7 && c < 7)
        ) {
          continue;
        }

        // Skip center cutout zone for Tether logo (5x5 center)
        const centerStart = Math.floor(size / 2) - 2;
        const centerEnd = Math.floor(size / 2) + 2;
        if (r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
          continue;
        }

        // Timing patterns
        if (r === 6 || c === 6) {
          grid[r][c] = (r + c) % 2 === 0;
          continue;
        }

        // Pseudo-random deterministic modules
        const val = Math.abs((hash * (r + 3) * (c + 7) + r * 13 + c * 17) % 11);
        grid[r][c] = val < 6;
      }
    }
    return grid;
  };

  const gridSize = 23;
  const grid = generateGrid(walletAddress || 'TQn9Y2khEsLJW1ChVwfMSMeRDow5K33333');

  return (
    <div className="bg-[#131924] border border-white/10 rounded-3xl p-6 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-5">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <QrCode className="w-3.5 h-3.5" />
          <span>Network: {network}</span>
        </span>
        {amount && (
          <span className="text-sm font-black text-emerald-400 font-mono">
            {amount} USDT
          </span>
        )}
      </div>

      {/* QR Code Outer Box matching user's exact uploaded style */}
      <div className="bg-white p-5 rounded-[28px] inline-block shadow-2xl mb-5 relative group-hover:scale-[1.01] transition-transform">
        <svg viewBox="0 0 160 160" className="w-52 h-52 sm:w-60 sm:h-60 mx-auto">
          {/* Finder Pattern 1: Top-Left */}
          <rect x="6" y="6" width="42" height="42" fill="#000000" rx="9" />
          <rect x="12" y="12" width="30" height="30" fill="#FFFFFF" rx="6" />
          <rect x="18" y="18" width="18" height="18" fill="#000000" rx="4" />

          {/* Finder Pattern 2: Top-Right */}
          <rect x="112" y="6" width="42" height="42" fill="#000000" rx="9" />
          <rect x="118" y="12" width="30" height="30" fill="#FFFFFF" rx="6" />
          <rect x="124" y="18" width="18" height="18" fill="#000000" rx="4" />

          {/* Finder Pattern 3: Bottom-Left */}
          <rect x="6" y="112" width="42" height="42" fill="#000000" rx="9" />
          <rect x="12" y="118" width="30" height="30" fill="#FFFFFF" rx="6" />
          <rect x="18" y="124" width="18" height="18" fill="#000000" rx="4" />

          {/* Matrix Data Modules */}
          {grid.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              const moduleSize = 148 / gridSize;
              const x = 6 + c * moduleSize;
              const y = 6 + r * moduleSize;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={moduleSize - 0.6}
                  height={moduleSize - 0.6}
                  fill="#000000"
                  rx="1.2"
                />
              );
            })
          )}

          {/* White Center Cutout Box for Logo */}
          <rect x="62" y="62" width="36" height="36" fill="#FFFFFF" rx="8" />

          {/* Center USDT Teal/Cyan Circle Badge */}
          <g transform="translate(80, 80)">
            <circle r="15" fill="#009393" />
            
            {/* Authentic Tether (USDT) Vector Logo inside circle */}
            <path
              d="M -8 -8 H 8 V -4.5 H 2.5 V -1 C 6 -0.7 8.5 0.6 8.5 2.2 C 8.5 4 4.8 5.2 0 5.2 C -4.8 5.2 -8.5 4 -8.5 2.2 C -8.5 0.6 -6 -0.7 -2.5 -1 V -4.5 H -8 Z"
              fill="#FFFFFF"
            />
            <path
              d="M -5.8 2.2 C -5.8 3 -2.8 3.8 0 3.8 C 2.8 3.8 5.8 3 5.8 2.2 C 5.8 1.4 3 0.7 0 0.6 C -3 0.7 -5.8 1.4 -5.8 2.2 Z"
              fill="#009393"
            />
          </g>
        </svg>
      </div>

      {/* Wallet Address & Copy Action */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center justify-center space-x-1 rtl:space-x-reverse">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official TRC20 Deposit Address</span>
        </p>
        <div className="flex items-center space-x-2 rtl:space-x-reverse bg-black/60 border border-white/10 rounded-2xl p-2.5">
          <input
            type="text"
            readOnly
            value={walletAddress}
            className="bg-transparent text-xs sm:text-sm text-cyan-300 font-mono flex-1 outline-none truncate font-bold text-center"
          />
          <button
            onClick={handleCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all ${
              copied
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

