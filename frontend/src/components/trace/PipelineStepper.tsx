'use client';

import React from 'react';
import { CheckCircle2, Clock, Loader2, ShieldCheck, Landmark, GitBranch } from 'lucide-react';
import { formatUSD, formatINR } from '@/lib/formatters';

interface PipelineStepperProps {
  progress: number;
  hopsCount: number;
  nodesCount: number;
  totalValueUsd: number;
  chain: string;
  vaspName?: string;
  elapsedSeconds?: number;
}

const STAGES = [
  { id: 1, label: 'Ingestion & Validation', threshold: 10 },
  { id: 2, label: 'Blockchain Chain Detection', threshold: 25 },
  { id: 3, label: 'Multi-Hop Outflow Traversal', threshold: 60 },
  { id: 4, label: 'Entity Clustering & Sweep Detection', threshold: 80 },
  { id: 5, label: 'VASP Direct Deposit Attribution', threshold: 92 },
  { id: 6, label: 'Hybrid Risk Scoring & SOP Ready', threshold: 100 },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  progress,
  hopsCount,
  nodesCount,
  totalValueUsd,
  chain,
  vaspName,
  elapsedSeconds = 6.2
}) => {
  return (
    <div className="p-4 space-y-4">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
          <div className="text-[10px] text-slate-400 font-medium">Hops Traversed</div>
          <div className="text-lg font-bold text-cyan-400 font-mono flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" /> {hopsCount} Hops
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5">
          <div className="text-[10px] text-slate-400 font-medium">Attribution Time</div>
          <div className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> {elapsedSeconds.toFixed(1)}s
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 col-span-2">
          <div className="text-[10px] text-slate-400 font-medium">Suspect Value Traced</div>
          <div className="text-base font-extrabold text-white font-mono flex items-baseline justify-between">
            <span>{formatUSD(totalValueUsd)}</span>
            <span className="text-xs text-slate-400 font-sans font-medium">
              ≈ {formatINR(totalValueUsd * 83.5, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Stages */}
      <div className="pt-2 border-t border-white/10 space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Forensic Attribution Pipeline
        </div>

        <div className="space-y-2.5">
          {STAGES.map((s, idx) => {
            const isCompleted = progress >= s.threshold;
            const isCurrent = progress < s.threshold && (idx === 0 || progress >= STAGES[idx - 1].threshold);

            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400 flex items-center justify-center animate-spin">
                      <Loader2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-600 border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                      {s.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className={`font-semibold ${isCompleted ? 'text-slate-200' : isCurrent ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {s.label}
                  </div>
                  {s.id === 2 && isCompleted && (
                    <div className="text-[10px] text-cyan-400 font-mono">
                      Network: {chain} · Standard: TRC20 / Bech32
                    </div>
                  )}
                  {s.id === 5 && isCompleted && vaspName && (
                    <div className="text-[10px] text-emerald-400 font-semibold font-mono flex items-center gap-1">
                      <Landmark className="w-3 h-3" /> Target VASP: {vaspName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
