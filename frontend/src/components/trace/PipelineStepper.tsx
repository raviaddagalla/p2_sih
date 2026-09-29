'use client';

import React from 'react';
import { CheckCircle2, Clock, Loader2, Landmark, GitBranch, ShieldCheck } from 'lucide-react';
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
    <div className="p-5 space-y-5 bg-surface text-primary">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-subtle border border-border">
          <div className="text-[10px] text-muted font-bold uppercase font-mono">Hops Traversed</div>
          <div className="text-lg font-black text-brand-indigo font-display flex items-center gap-1.5 mt-0.5">
            <GitBranch className="w-4 h-4 text-brand-indigo" /> {hopsCount} Hops
          </div>
        </div>

        <div className="p-3 rounded-xl bg-subtle border border-border">
          <div className="text-[10px] text-muted font-bold uppercase font-mono">Attribution Time</div>
          <div className="text-lg font-black text-semantic-successText font-display flex items-center gap-1.5 mt-0.5">
            <Clock className="w-4 h-4 text-semantic-success" /> {elapsedSeconds.toFixed(1)}s
          </div>
        </div>

        <div className="p-3 rounded-xl bg-subtle border border-border col-span-2">
          <div className="text-[10px] text-muted font-bold uppercase font-mono">Suspect Outflow Traced</div>
          <div className="text-base font-black text-primary font-display flex items-baseline justify-between mt-0.5">
            <span>{formatUSD(totalValueUsd)}</span>
            <span className="text-xs text-muted font-mono font-medium">
              ≈ {formatINR(totalValueUsd * 83.5, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Stages */}
      <div className="pt-2 border-t border-border space-y-3">
        <div className="text-xs font-bold text-muted uppercase tracking-wider font-mono">
          Forensic Attribution Pipeline
        </div>

        <div className="space-y-3">
          {STAGES.map((s, idx) => {
            const isCompleted = progress >= s.threshold;
            const isCurrent = progress < s.threshold && (idx === 0 || progress >= STAGES[idx - 1].threshold);

            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="relative flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-semantic-successTint text-semantic-successText border border-semantic-success/40 flex items-center justify-center shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-brand-indigoTint text-brand-indigo border border-brand-indigo flex items-center justify-center animate-spin">
                      <Loader2 className="w-3.5 h-3.5 text-brand-indigo" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-subtle text-muted border border-border flex items-center justify-center text-[10px] font-mono font-bold">
                      {s.id}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-xs min-w-0">
                  <div className={`font-semibold truncate ${
                    isCompleted ? 'text-primary' : isCurrent ? 'text-brand-indigo font-bold' : 'text-muted'
                  }`}>
                    {s.label}
                  </div>
                  {s.id === 2 && isCompleted && (
                    <div className="text-[10px] text-brand-indigo font-mono font-medium">
                      Network: {chain} · Bech32 / TRC20
                    </div>
                  )}
                  {s.id === 5 && isCompleted && vaspName && (
                    <div className="text-[10px] text-semantic-successText font-semibold font-mono flex items-center gap-1">
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
