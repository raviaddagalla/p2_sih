'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  GitBranch, ShieldAlert, ArrowLeft, ArrowUpRight, Lock, Eye, Clock, CheckCircle2,
  Sparkles, ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatUSD, formatINR, formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';
import { RiskBadge } from '@/components/common/RiskBadge';
import { AddressChip } from '@/components/common/AddressChip';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { Button } from '@/components/ui/Button';

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
      <div className="p-12 text-center text-muted font-mono text-xs">
        Loading Wallet Forensic Profile...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-primary">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-brand-indigo transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Command Center</span>
      </Link>

      {/* Main Profile Card */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ChainBadge chain={chain} />
              <RiskBadge score={profile?.risk_score || 85} category={profile?.risk_category} />
            </div>
            <div>
              <span className="text-[10px] text-muted font-bold uppercase block font-mono">
                Investigated Target Address
              </span>
              <div className="mt-1">
                <AddressChip address={address} chain={chain} lead={10} tail={8} showExplorer={true} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/trace/demo`}>
              <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                Trace Outflows
              </Button>
            </Link>
            <Button
              variant="secondary"
              icon={<Eye className="w-4 h-4" />}
              onClick={() => alert(`Address added to 24/7 Watchlist.`)}
            >
              Watchlist
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards + Risk Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="p-4 rounded-xl bg-subtle/50 border border-border space-y-1">
            <span className="text-muted block font-bold uppercase font-mono text-[10px]">On-Chain Holdings</span>
            <div className="text-xl font-black text-primary font-display">
              {formatUSD(profile?.balance_usd || 48210.0)}
            </div>
            <div className="text-[10px] text-muted font-mono">
              ≈ {formatINR((profile?.balance_usd || 48210.0) * 83.5, true)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-subtle/50 border border-border space-y-1">
            <span className="text-muted block font-bold uppercase font-mono text-[10px]">Entity Classification</span>
            <div className="text-lg font-bold text-primary">
              {profile?.entity_type || 'SUSPECT_INTERMEDIARY'}
            </div>
            <div className="text-[10px] text-muted font-mono">Heuristic Cluster</div>
          </div>

          <div className="p-4 rounded-xl bg-subtle/50 border border-border space-y-1">
            <span className="text-muted block font-bold uppercase font-mono text-[10px]">Total Outflow Traced</span>
            <div className="text-xl font-black text-semantic-dangerText font-display">
              $94,200.00
            </div>
            <div className="text-[10px] text-muted font-mono">3 Dispersal Waves</div>
          </div>

          <div className="p-3 rounded-xl bg-subtle/50 border border-border flex flex-col items-center justify-center">
            <div className="text-[10px] text-muted font-bold uppercase font-mono mb-1">Risk Gauge</div>
            <RiskGauge score={profile?.risk_score || 85} size={130} showLabels={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
