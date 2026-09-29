'use client';

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
          bg: 'bg-[#FEE7E9] border-[#FECDD3] text-[#9F1239]',
          dot: 'bg-[#EF0027]',
          symbol: 'TRX'
        };
      case 'BTC':
        return {
          label: 'Bitcoin',
          bg: 'bg-[#FEF3E2] border-[#FDE68A] text-[#B45309]',
          dot: 'bg-[#F7931A]',
          symbol: 'BTC'
        };
      case 'ETH':
        return {
          label: 'Ethereum',
          bg: 'bg-[#EEF2FF] border-[#C7D2FE] text-[#3730A3]',
          dot: 'bg-[#627EEA]',
          symbol: 'ETH'
        };
      case 'BSC':
        return {
          label: 'BNB Chain',
          bg: 'bg-[#FEF9E7] border-[#FDE047] text-[#854D0E]',
          dot: 'bg-[#F3BA2F]',
          symbol: 'BSC'
        };
      case 'POLYGON':
        return {
          label: 'Polygon',
          bg: 'bg-[#F3E8FF] border-[#DDD6FE] text-[#6B21A8]',
          dot: 'bg-[#8247E5]',
          symbol: 'POL'
        };
      case 'SOL':
        return {
          label: 'Solana',
          bg: 'bg-[#DCFCE7] border-[#86EFAC] text-[#0FA968]',
          dot: 'bg-[#14F195]',
          symbol: 'SOL'
        };
      default:
        return {
          label: chain || 'UNKNOWN',
          bg: 'bg-subtle border-border text-secondary',
          dot: 'bg-muted',
          symbol: '?'
        };
    }
  };

  const details = getDetails();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono font-medium border ${details.bg} ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${details.dot}`} />
      <span className="font-bold">{details.symbol}</span>
      <span className="opacity-90">{details.label}</span>
    </span>
  );
};
