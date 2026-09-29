'use client';

import React from 'react';
import { Landmark, Lock, FileDown, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { VASPAttribution } from '@/lib/types';
import { formatUSD, formatINR, truncateAddress } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

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
  // Monogram helper
  const monogram = attribution.vasp_name
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-6 my-4 p-5 rounded-2xl bg-surface border-2 border-semantic-success/50 shadow-lg shadow-semantic-success/10 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
      {/* Left: VASP Hit Information */}
      <div className="flex items-center gap-4">
        {/* Monogram Avatar with Emerald Accent Ring */}
        <div className="w-14 h-14 rounded-2xl bg-semantic-successTint border border-semantic-success/40 flex items-center justify-center font-display font-black text-lg text-semantic-successText shrink-0 shadow-sm">
          {monogram}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-semantic-successTint text-semantic-successText font-bold text-[11px] uppercase font-mono tracking-wider border border-semantic-success/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-semantic-success" />
              Exchange Identified · Hop {attribution.hop} · {Math.round(attribution.confidence * 100)}% Confidence
            </span>
            {attribution.fiu_registered && (
              <span className="text-[11px] font-semibold text-semantic-successText font-sans">
                · FIU-IND Registered
              </span>
            )}
          </div>
          
          <div className="text-lg font-black text-primary font-display mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-semantic-successText">{attribution.vasp_name}</span>
            <span className="text-secondary font-medium text-sm">
              received <strong className="font-mono text-primary font-bold">{formatUSD(attribution.amount_usd)}</strong>
            </span>
            <span className="text-xs text-muted font-mono font-semibold">
              (≈ {formatINR(attribution.amount_usd * 83.5, true)})
            </span>
          </div>

          <div className="text-xs text-secondary font-mono mt-0.5">
            Deposit Account: <span className="font-bold text-primary">{truncateAddress(attribution.deposit_address, 10, 8)}</span>
          </div>
        </div>
      </div>

      {/* Right: 3 CTAs */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="success"
          size="md"
          onClick={onGenerateFreeze}
          icon={<Lock className="w-4 h-4" />}
          className="shadow-sm"
        >
          Generate Freeze Request (Sec 106)
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={onDownloadReport}
          icon={<FileDown className="w-4 h-4 text-brand-indigo" />}
        >
          Download Court PDF Report
        </Button>

        <Button
          variant="soft"
          size="md"
          onClick={onFollowMoney}
          icon={<Sparkles className="w-3.5 h-3.5" />}
        >
          View Timeline Path
        </Button>
      </div>
    </div>
  );
};
