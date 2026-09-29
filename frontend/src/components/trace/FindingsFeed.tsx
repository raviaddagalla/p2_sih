'use client';

import React from 'react';
import { AlertCircle, ShieldAlert, Sparkles, Building2 } from 'lucide-react';
import { Finding } from '@/lib/types';

interface FindingsFeedProps {
  findings: Finding[];
}

export const FindingsFeed: React.FC<FindingsFeedProps> = ({ findings }) => {
  if (!findings || findings.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500 italic">
        Awaiting heuristic AML analysis...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
        <span>Forensic Findings</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono">
          {findings.length} Tagged
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {findings.map((f, idx) => {
          const isVasp = f.type === 'VASP_HIT';
          const isMixer = f.type === 'MIXER';
          const isCritical = f.severity === 'CRITICAL';

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs transition-all ${
                isVasp
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 shadow-glow-emerald'
                  : isMixer
                  ? 'bg-purple-950/30 border-purple-500/40 text-purple-100'
                  : isCritical
                  ? 'bg-red-950/30 border-red-500/40 text-red-100'
                  : 'bg-slate-900/80 border-white/5 text-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  {isVasp ? (
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCritical ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                  <span className="line-clamp-1">{f.title}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-bold shrink-0">
                  {Math.round(f.confidence * 100)}%
                </span>
              </div>

              <p className="text-[11px] text-slate-300/90 leading-relaxed mb-2">
                {f.description}
              </p>

              {/* Confidence progress bar */}
              <div className="w-full h-1 rounded-full bg-black/40 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isVasp ? 'bg-emerald-400' : isCritical ? 'bg-red-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${Math.round(f.confidence * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
