'use client';

import React from 'react';
import { 
  ShieldAlert, ShieldCheck, ExternalLink, Lock, Eye, ArrowUpRight, Copy, Check, Info, Landmark
} from 'lucide-react';
import { TraceNode } from '@/lib/types';
import { AddressChip } from '@/lib/../components/common/AddressChip';
import { ChainBadge } from '@/lib/../components/common/ChainBadge';
import { RiskBadge } from '@/lib/../components/common/RiskBadge';
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
      <div className="p-6 text-center text-slate-500 h-full flex flex-col items-center justify-center space-y-3">
        <Info className="w-8 h-8 text-slate-600 animate-pulse" />
        <p className="text-xs">Click any node or transaction in the graph to inspect entity intelligence.</p>
      </div>
    );
  }

  const isVasp = node.is_vasp || node.entity_type === 'EXCHANGE';

  return (
    <div className="p-5 space-y-5 overflow-y-auto h-full text-xs">
      {/* Header Profile */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <ChainBadge chain={node.chain} />
          <RiskBadge score={node.risk_score} category={node.risk_category} />
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
            {isVasp ? 'Custodial Exchange Node' : node.is_root ? 'Victim Inflow Address' : 'Suspect Wallet Address'}
          </span>
          <div className="mt-1">
            <AddressChip address={node.address} chain={node.chain} lead={8} tail={6} showExplorer={true} />
          </div>
        </div>

        {node.vasp_name && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold text-emerald-300">{node.vasp_name}</div>
              <div className="text-[10px] text-slate-400">FIU-IND Registered Custodian</div>
            </div>
          </div>
        )}
      </div>

      {/* Balances & Stats */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
        <div className="text-[10px] text-slate-400 font-semibold uppercase">Ledger Balances</div>
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-bold text-white font-mono">
            {formatUSD(node.balance_usd)}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ≈ {formatINR(node.balance_usd * 83.5, true)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
          <span>Hop Distance:</span>
          <span className="font-mono font-bold text-cyan-400">{node.hop} Hops</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Entity Classification:</span>
          <span className="font-mono font-bold text-slate-200">{node.entity_type}</span>
        </div>
      </div>

      {/* Risk Gauge Dial */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Risk Attribution Dial</span>
          <span className="text-xs font-mono font-bold text-white">{node.risk_score} / 100</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              node.risk_score >= 85 ? 'bg-red-500 shadow-glow-red' :
              node.risk_score >= 65 ? 'bg-orange-500' :
              node.risk_score >= 35 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${node.risk_score}%` }}
          />
        </div>
      </div>

      {/* Entity Labels */}
      {node.labels && node.labels.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Heuristic Labels</div>
          <div className="flex flex-wrap gap-1.5">
            {node.labels.map((l, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-white/5 text-slate-300 text-[10px] font-mono">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        {isVasp ? (
          <button
            onClick={() => onOpenFreezeModal(node)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-glow-emerald transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Generate Freeze Notice (Sec 106)</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenFreezeModal(node)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-white/10 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Freeze Requisition Modal</span>
          </button>
        )}

        <button
          onClick={() => onAddToWatchlist(node.address, node.chain)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium border border-white/5 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>Add Node to 24/7 Watchlist</span>
        </button>
      </div>
    </div>
  );
};
