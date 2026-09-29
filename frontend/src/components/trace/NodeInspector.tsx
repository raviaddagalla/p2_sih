'use client';

import React from 'react';
import { 
  ShieldAlert, ShieldCheck, ExternalLink, Lock, Eye, ArrowUpRight, Copy, Check, Info, Landmark, AlertTriangle
} from 'lucide-react';
import { TraceNode } from '@/lib/types';
import { AddressChip } from '@/components/common/AddressChip';
import { ChainBadge } from '@/components/common/ChainBadge';
import { RiskBadge } from '@/components/common/RiskBadge';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { Button } from '@/components/ui/Button';
import { formatUSD, formatINR } from '@/lib/formatters';

interface NodeInspectorProps {
  node: TraceNode | null;
  onOpenFreezeModal: (node: TraceNode) => void;
  onAddToWatchlist: (address: string, chain: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onOpenFreezeModal,
  onAddToWatchlist
}) => {
  if (!node) {
    return (
      <div className="p-8 text-center text-muted h-full flex flex-col items-center justify-center space-y-3 bg-surface select-none">
        <div className="w-12 h-12 rounded-2xl bg-subtle flex items-center justify-center text-muted">
          <Info className="w-6 h-6" />
        </div>
        <div className="font-bold text-primary text-sm">No Entity Selected</div>
        <p className="text-xs text-secondary max-w-xs">
          Click any wallet address, intermediary node, or VASP deposit exchange in the graph to inspect forensic attribution intelligence.
        </p>
      </div>
    );
  }

  const isVasp = node.is_vasp || node.entity_type === 'EXCHANGE';

  // Contributing risk factor mock breakdown
  const riskFactors = [
    { label: 'Rapid Multi-Hop Dispersion', impact: 85 },
    { label: 'Known Scammer Cluster Proximity', impact: 70 },
    { label: 'Unusual Outflow Velocity', impact: 60 },
  ];

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full text-xs bg-surface text-primary">
      {/* Header Profile */}
      <div className="space-y-3 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <ChainBadge chain={node.chain} />
          <RiskBadge score={node.risk_score} category={node.risk_category} />
        </div>

        <div>
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider block font-mono">
            {isVasp ? 'Custodial Exchange Node' : node.is_root ? 'Victim Inflow Address' : 'Suspect Wallet Address'}
          </span>
          <div className="mt-1">
            <AddressChip address={node.address} chain={node.chain} lead={8} tail={6} showExplorer={true} />
          </div>
        </div>

        {node.vasp_name && (
          <div className="p-3 rounded-xl bg-semantic-successTint border border-semantic-success/30 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface border border-semantic-success/40 flex items-center justify-center text-semantic-successText font-bold text-xs">
              {node.vasp_name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-semantic-successText">{node.vasp_name}</div>
              <div className="text-[10px] text-muted font-mono">FIU-IND Registered Custodian</div>
            </div>
          </div>
        )}
      </div>

      {/* Semicircle Risk Gauge */}
      <div className="p-4 rounded-xl bg-subtle/50 border border-border flex flex-col items-center">
        <div className="text-[10px] font-bold text-muted uppercase font-mono mb-1">
          Entity Risk Severity Score
        </div>
        <RiskGauge score={node.risk_score} size={150} />
      </div>

      {/* Balances & Hop Stats */}
      <div className="p-3.5 rounded-xl bg-subtle/60 border border-border space-y-2">
        <div className="text-[10px] text-muted font-bold uppercase font-mono">Ledger Holdings</div>
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-black text-primary font-display">
            {formatUSD(node.balance_usd)}
          </span>
          <span className="text-xs text-muted font-mono font-medium">
            ≈ {formatINR(node.balance_usd * 83.5, true)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] text-secondary">
          <span>Hop Distance:</span>
          <span className="font-mono font-bold text-brand-indigo">{node.hop} Hops</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-secondary">
          <span>Classification:</span>
          <span className="font-mono font-bold text-primary">{node.entity_type}</span>
        </div>
      </div>

      {/* Contributing Risk Factors */}
      <div className="space-y-2">
        <div className="text-[10px] text-muted font-bold uppercase font-mono">Contributing Risk Factors</div>
        <div className="space-y-1.5">
          {riskFactors.map((rf, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px] text-secondary font-medium">
                <span>{rf.label}</span>
                <span className="font-mono text-primary font-bold">{rf.impact}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-subtle overflow-hidden">
                <div
                  className="h-full bg-brand-indigo rounded-full"
                  style={{ width: `${rf.impact}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heuristic Entity Labels */}
      {node.labels && node.labels.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] text-muted font-bold uppercase font-mono">Heuristic Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {node.labels.map((l, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-subtle border border-border text-secondary text-[10px] font-mono font-medium">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-border space-y-2">
        {isVasp ? (
          <Button
            variant="success"
            size="md"
            onClick={() => onOpenFreezeModal(node)}
            className="w-full justify-center"
            icon={<Lock className="w-3.5 h-3.5" />}
          >
            Issue Sec 106 Freeze Notice
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            onClick={() => onOpenFreezeModal(node)}
            className="w-full justify-center"
            icon={<Lock className="w-3.5 h-3.5 text-brand-indigo" />}
          >
            Freeze Requisition Modal
          </Button>
        )}

        <Button
          variant="ghost"
          size="md"
          onClick={() => onAddToWatchlist(node.address, node.chain)}
          className="w-full justify-center"
          icon={<Eye className="w-3.5 h-3.5 text-muted" />}
        >
          Add Node to 24/7 Watchlist
        </Button>
      </div>
    </div>
  );
};
