'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, ArrowRight } from 'lucide-react';
import { Finding } from '@/lib/types';

interface FindingsFeedProps {
  findings: Finding[];
}

export const FindingsFeed: React.FC<FindingsFeedProps> = ({ findings }) => {
  return (
    <div className="p-5 space-y-3 bg-surface text-primary">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
          Heuristic Findings Stream
        </h4>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-subtle text-secondary font-bold">
          {findings.length} Signals
        </span>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
        {findings.length === 0 ? (
          <div className="text-center py-6 text-muted text-xs">
            Awaiting heuristic engine outputs...
          </div>
        ) : (
          findings.map((f, idx) => {
            const isHigh = f.severity === 'HIGH' || f.severity === 'CRITICAL';
            const isMedium = (f.severity as string) === 'MEDIUM' || (f.severity as string) === 'WARNING';

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                  isHigh
                    ? 'bg-semantic-dangerTint/40 border-semantic-danger/30'
                    : isMedium
                    ? 'bg-semantic-warningTint/40 border-semantic-warning/30'
                    : 'bg-subtle/60 border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.2 rounded-full font-mono font-bold text-[9px] uppercase ${
                    isHigh 
                      ? 'bg-semantic-dangerTint text-semantic-dangerText border border-semantic-danger/30' 
                      : isMedium
                      ? 'bg-semantic-warningTint text-semantic-warningText border border-semantic-warning/30'
                      : 'bg-brand-indigoTint text-brand-indigo border border-brand-indigo/30'
                  }`}>
                    {f.severity}
                  </span>
                  <span className="text-[10px] font-mono text-muted">
                    Hop {f.hop || 1}
                  </span>
                </div>

                <div className="font-bold text-primary leading-tight">
                  {f.pattern_name || f.title}
                </div>
                
                <p className="text-[11px] text-secondary leading-snug">
                  {f.description}
                </p>

                {/* Confidence Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>Attribution Confidence</span>
                    <span className="font-bold text-primary">{Math.round(f.confidence * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-brand-indigo rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(f.confidence * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
