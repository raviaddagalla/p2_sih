'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { truncateAddress } from '@/lib/formatters';

interface AddressChipProps {
  address: string;
  chain?: string;
  lead?: number;
  tail?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
}

export const AddressChip: React.FC<AddressChipProps> = ({
  address,
  chain = 'TRON',
  lead = 6,
  tail = 4,
  showCopy = true,
  showExplorer = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getExplorerUrl = () => {
    switch (chain.toUpperCase()) {
      case 'TRON':
        return `https://tronscan.org/#/address/${address}`;
      case 'BTC':
        return `https://mempool.space/address/${address}`;
      case 'ETH':
        return `https://etherscan.io/address/${address}`;
      case 'BSC':
        return `https://bscscan.com/address/${address}`;
      default:
        return '#';
    }
  };

  return (
    <div
      onClick={handleCopy}
      title="Click to copy address"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 hover:bg-slate-800/90 transition-all cursor-pointer font-mono text-xs text-slate-200 group"
    >
      <span className="text-cyan-300 font-semibold group-hover:text-cyan-200">
        {truncateAddress(address, lead, tail)}
      </span>
      {showCopy && (
        <span className="text-slate-400 group-hover:text-cyan-300 transition-colors">
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </span>
      )}
      {showExplorer && (
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-slate-400 hover:text-cyan-300 ml-0.5"
          title="Open in Blockchain Explorer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
