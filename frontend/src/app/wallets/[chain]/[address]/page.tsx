'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GitBranch, ShieldAlert, ArrowLeft, ArrowUpRight, Lock, Eye, Clock, CheckCircle2
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatUSD, formatINR, formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';
import { RiskBadge } from '@/components/common/RiskBadge';
import { AddressChip } from '@/components/common/AddressChip';

export default function WalletProfilePage() {
  const params = useParams();
  const router = useRouter();
  const chain = (params?.chain as string) || 'TRON';
  const address = (params?.address as string) || 'TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L';

  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const data = await api.getWalletProfile(chain, address);
        setProfile(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (address) loadProfile();
  }, [chain, address]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs">
        Loading Wallet Forensic Profile...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-slate-100">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Command Center</span>
      </Link>

      {/* Main Profile Card */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ChainBadge chain={chain} />
              <RiskBadge score={profile?.risk_score || 85} category={profile?.risk_category} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                Investigated Target Address
              </span>
              <div className="mt-1">
                <AddressChip address={address} chain={chain} lead={10} tail={8} showExplorer={true} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/trace/demo`)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan"
            >
              <GitBranch className="w-4 h-4" />
              <span>Trace Graph Outflows</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-medium">Recorded Ledger Balance</span>
            <div className="text-lg font-bold text-white font-mono">
              {formatUSD(profile?.balance_usd || 120.0)}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              ≈ {formatINR((profile?.balance_usd || 120.0) * 83.5, true)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-medium">Entity Classification</span>
            <div className="text-base font-bold text-cyan-300">
              {profile?.entity_type || 'BURNER / MULE'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Transaction Count: {profile?.tx_count || 12}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-medium">Lifecycle Observation</span>
            <div className="text-xs text-slate-200">
              First Seen: {formatIST(profile?.first_seen)}
            </div>
            <div className="text-[10px] text-slate-400">
              Last Outflow: {formatIST(profile?.last_seen)}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Contributing Factors */}
      {profile?.risk_factors && profile.risk_factors.length > 0 && (
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Forensic Risk Contributing Factors</span>
          </h3>

          <div className="space-y-2">
            {profile.risk_factors.map((f: any, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{f.factor}</span>
                  <p className="text-[11px] text-slate-400">{f.detail}</p>
                </div>
                <span className="font-mono font-bold text-rose-400 text-sm">{f.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
