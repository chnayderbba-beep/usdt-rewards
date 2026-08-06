import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldAlert, ArrowRight } from 'lucide-react';

interface QRCodeModalProps {
  walletAddress: string;
  network?: string;
  amount?: number;
  onCopy?: () => void;
}

// Generates a decorative, scan-friendly visual QR SVG matrix based on address hash
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

  // Generate deterministic pseudo QR pattern based on wallet string
  const generateGrid = (str: string) => {
    const grid = Array(15).fill(0).map(() => Array(15).fill(false));
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        // Leave space for corner finder patterns
        if (
          (r < 4 && c < 4) ||
          (r < 4 && c > 10) ||
          (r > 10 && c < 4)
        ) {
          continue;
        }
        grid[r][c] = Math.abs((hash * (r + 1) * (c + 1)) % 7) < 4;
      }
    }
    return grid;
  };

  const grid = generateGrid(walletAddress || 'TQn9Y2khEsLJW1ChVwfMSMeRDow5K33333');

  return (
    <div className="bg-gray-950/80 border border-amber-500/20 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <QrCode className="w-3.5 h-3.5" />
          <span>Network: {network}</span>
        </span>
        {amount && (
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {amount} USDT
          </span>
        )}
      </div>

      {/* QR Code Container */}
      <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-4 relative">
        <svg viewBox="0 0 120 120" className="w-48 h-48 mx-auto">
          {/* Finder pattern 1: Top-Left */}
          <rect x="5" y="5" width="30" height="30" fill="#0B0E11" rx="4" />
          <rect x="10" y="10" width="20" height="20" fill="#FFFFFF" rx="2" />
          <rect x="15" y="15" width="10" height="10" fill="#F0B90B" rx="1" />

          {/* Finder pattern 2: Top-Right */}
          <rect x="85" y="5" width="30" height="30" fill="#0B0E11" rx="4" />
          <rect x="90" y="10" width="20" height="20" fill="#FFFFFF" rx="2" />
          <rect x="95" y="15" width="10" height="10" fill="#F0B90B" rx="1" />

          {/* Finder pattern 3: Bottom-Left */}
          <rect x="5" y="85" width="30" height="30" fill="#0B0E11" rx="4" />
          <rect x="10" y="90" width="20" height="20" fill="#FFFFFF" rx="2" />
          <rect x="15" y="95" width="10" height="10" fill="#F0B90B" rx="1" />

          {/* Data Module Grid */}
          {grid.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <rect
                  key={`${r}-${c}`}
                  x={8 + c * 7}
                  y={8 + r * 7}
                  width="5.5"
                  height="5.5"
                  fill="#12161C"
                  rx="1"
                />
              ) : null
            )
          )}

          {/* Center USDT TRC20 Logo Badge */}
          <circle cx="60" cy="60" r="14" fill="#009393" />
          <text
            x="60"
            y="64"
            fill="#FFFFFF"
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            ₮
          </text>
        </svg>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          TRC20 Deposit Wallet Address
        </p>
        <div className="flex items-center space-x-2 bg-gray-900/90 border border-gray-800 rounded-xl p-2.5">
          <input
            type="text"
            readOnly
            value={walletAddress}
            className="bg-transparent text-xs sm:text-sm text-gray-200 font-mono flex-1 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-md'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
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
