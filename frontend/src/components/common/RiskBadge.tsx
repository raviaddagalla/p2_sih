'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RiskCategory } from '@/lib/types';

interface RiskBadgeProps {
  score?: number;
  category?: RiskCategory;
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score, category, showScore = true }) => {
  let cat = category;
  if (!cat && score !== undefined) {
    if (score >= 85) cat = 'CRITICAL';
    else if (score >= 65) cat = 'HIGH';
    else if (score >= 35) cat = 'MEDIUM';
    else cat = 'LOW';
  }

  const getStyle = () => {
    switch (cat) {
      case 'CRITICAL':
        return {
          bg: 'bg-[#FDE4E4] border-[#FCA5A5] text-[#B91C1C]',
          dot: 'bg-[#EF4444]',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-[#B91C1C]" />
        };
      case 'HIGH':
        return {
          bg: 'bg-[#FFE9DA] border-[#FDBA74] text-[#C2410C]',
          dot: 'bg-[#F97316]',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-[#C2410C]" />
        };
      case 'MEDIUM':
        return {
          bg: 'bg-[#FEF1D6] border-[#FCD34D] text-[#B45309]',
          dot: 'bg-[#F59E0B]',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-[#DDF7EC] border-[#86EFAC] text-[#047857]',
          dot: 'bg-[#10B981]',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#047857]" />
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${style.bg}`}>
      <span className="relative flex h-2 w-2">
        {cat === 'CRITICAL' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${style.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
      </span>
      {style.icon}
      <span>{cat}</span>
      {showScore && score !== undefined && (
        <span className="opacity-80 font-mono text-[11px] font-bold">({score})</span>
      )}
    </div>
  );
};
