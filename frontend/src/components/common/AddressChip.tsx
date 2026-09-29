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
    setTimeout(() => setCopied(false), 2000);
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
      case 'POLYGON':
        return `https://polygonscan.com/address/${address}`;
      case 'SOL':
        return `https://solscan.io/account/${address}`;
      default:
        return '#';
    }
  };

  return (
    <div
      onClick={handleCopy}
      title="Click to copy full address"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-subtle border border-border hover:border-brand-indigo/40 hover:bg-brand-indigoTint transition-all cursor-pointer font-mono text-xs text-primary group"
    >
      <span className="font-semibold text-brand-indigo group-hover:text-brand-indigoHover">
        {truncateAddress(address, lead, tail)}
      </span>

      {showCopy && (
        <span className="text-muted group-hover:text-brand-indigo transition-colors flex items-center">
          {copied ? (
            <span className="flex items-center gap-1 text-[10px] text-semantic-success font-bold font-sans">
              <Check className="w-3 h-3 text-semantic-success" /> Copied
            </span>
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
          className="text-muted hover:text-brand-indigo ml-0.5"
          title="Open in Blockchain Explorer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
