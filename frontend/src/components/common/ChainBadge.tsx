import React from 'react';
import { ChainType } from '@/lib/types';

interface ChainBadgeProps {
  chain: ChainType | string;
  size?: 'sm' | 'md';
}

export const ChainBadge: React.FC<ChainBadgeProps> = ({ chain, size = 'md' }) => {
  const c = chain?.toUpperCase();

  const getDetails = () => {
    switch (c) {
      case 'TRON':
        return {
          label: 'TRON (TRC20)',
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          symbol: 'TRX'
        };
      case 'BTC':
        return {
          label: 'Bitcoin',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          symbol: 'BTC'
        };
      case 'ETH':
        return {
          label: 'Ethereum',
          bg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
          symbol: 'ETH'
        };
      case 'BSC':
        return {
          label: 'BNB Chain',
          bg: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300',
          symbol: 'BSC'
        };
      case 'POLYGON':
        return {
          label: 'Polygon',
          bg: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
          symbol: 'POL'
        };
      case 'SOL':
        return {
          label: 'Solana',
          bg: 'bg-violet-500/15 border-violet-500/40 text-violet-300',
          symbol: 'SOL'
        };
      default:
        return {
          label: chain || 'UNKNOWN',
          bg: 'bg-slate-700/30 border-slate-600/40 text-slate-300',
          symbol: '?'
        };
    }
  };

  const details = getDetails();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-mono font-medium border ${details.bg} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <span className="font-bold opacity-75">{details.symbol}</span>
      <span>{details.label}</span>
    </span>
  );
};
