'use client';

import React from 'react';
import { Landmark, Lock, FileDown, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { VASPAttribution } from '@/lib/types';
import { formatUSD, formatINR, truncateAddress } from '@/lib/formatters';

interface AttributionBannerProps {
  attribution: VASPAttribution;
  onGenerateFreeze: () => void;
  onDownloadReport: () => void;
  onFollowMoney: () => void;
}

export const AttributionBanner: React.FC<AttributionBannerProps> = ({
  attribution,
  onGenerateFreeze,
  onDownloadReport,
  onFollowMoney
}) => {
  return (
    <div className="mx-4 my-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-cyan-950/80 border border-emerald-400/50 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: VASP Hit Information */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-glow-emerald shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase font-mono tracking-wider border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                VASP Deposit Attributed
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Hop {attribution.hop} · {Math.round(attribution.confidence * 100)}% Confidence
              </span>
            </div>
            
            <div className="text-base sm:text-lg font-black text-white font-sans mt-0.5 flex items-baseline gap-2">
              <span className="text-emerald-400">{attribution.vasp_name}</span>
              <span className="text-slate-300 font-normal text-sm">
                received <strong className="font-mono text-cyan-300">{formatUSD(attribution.amount_usd)}</strong>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (≈ {formatINR(attribution.amount_usd * 83.5, true)})
              </span>
            </div>

            <div className="text-[11px] text-slate-300 font-mono mt-0.5">
              Deposit Account: <span className="text-cyan-300">{truncateAddress(attribution.deposit_address, 10, 8)}</span>
              {attribution.fiu_registered && (
                <span className="ml-2 text-emerald-400 font-semibold font-sans">
                  · FIU-IND Registered
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onGenerateFreeze}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs shadow-glow-emerald transition-all"
          >
            <Lock className="w-4 h-4 fill-black/20" />
            <span>Issue Section 106 Freeze Notice</span>
          </button>

          <button
            onClick={onDownloadReport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-white/10 transition-colors"
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            <span>Court PDF Report</span>
          </button>

          <button
            onClick={onFollowMoney}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-colors"
            title="Trace animation"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Path</span>
          </button>
        </div>
      </div>
    </div>
  );
};
