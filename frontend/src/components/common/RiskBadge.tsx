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
          bg: 'bg-red-500/15 border-red-500/40 text-red-400',
          dot: 'bg-red-500 animate-ping',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
          dot: 'bg-orange-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          dot: 'bg-amber-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-500',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold backdrop-blur-md ${style.bg}`}>
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot.replace(' animate-ping', '')}`} />
      </span>
      {style.icon}
      <span>{cat}</span>
      {showScore && score !== undefined && (
        <span className="opacity-80 font-mono text-[10px]">({score})</span>
      )}
    </div>
  );
};
