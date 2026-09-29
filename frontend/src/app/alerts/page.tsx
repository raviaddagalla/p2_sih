'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, Eye, Plus, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck, 
  ChevronRight, Activity, Filter, Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { AlertItem } from '@/lib/types';
import { formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';
import { AddressChip } from '@/components/common/AddressChip';
import { Button } from '@/components/ui/Button';

export default function AlertsWatchlistPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'watchlist'>('alerts');
  const [newAddr, setNewAddr] = useState('');
  const [newReason, setNewReason] = useState('');

  const loadData = async () => {
    try {
      const [alertsRes, watchRes] = await Promise.all([
        api.getAlerts(),
        fetch('http://127.0.0.1:8000/api/watchlist').then(r => r.json())
      ]);
      setAlerts(alertsRes || []);
      setWatchlist(watchRes || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddWatchlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr) return;
    try {
      await fetch('http://127.0.0.1:8000/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: newAddr.trim(),
          chain: newAddr.startsWith('T') ? 'TRON' : newAddr.startsWith('0x') ? 'ETH' : 'BTC',
          reason: newReason || 'Investigator Real-Time Alert Requisition'
        })
      });
      setNewAddr('');
      setNewReason('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-pink" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              24/7 HEURISTIC SENTINEL
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Real-Time Alert Feed & 24/7 Watchlist
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Automated monitoring of suspect syndicate wallets, high-velocity sweeps, and exchange deposit touches.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-subtle p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'alerts'
                ? 'bg-surface text-brand-indigo shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Live Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'watchlist'
                ? 'bg-surface text-brand-indigo shadow-xs'
                : 'text-secondary hover:text-primary'
            }`}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Live Alerts Feed */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map((a, idx) => {
            const isCritical = a.severity === 'CRITICAL';
            const isHigh = a.severity === 'HIGH';

            return (
              <div
                key={a.id || idx}
                className="p-5 rounded-2xl bg-surface border border-border shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      isCritical
                        ? 'bg-semantic-dangerTint text-semantic-dangerText border border-semantic-danger/30'
                        : isHigh
                        ? 'bg-semantic-highTint text-semantic-highText border border-semantic-high/30'
                        : 'bg-brand-indigoTint text-brand-indigo border border-brand-indigo/30'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="font-bold text-sm text-primary">{a.title}</span>
                  </div>

                  <span className="text-[11px] font-mono text-muted">
                    {formatIST(a.created_at)}
                  </span>
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                  {a.body}
                </p>

                {a.job_id && (
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <Link
                      href={`/trace/${a.job_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:text-brand-indigoHover"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Inspect Live Graph Trace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-[10px] font-mono text-muted">Auto-Attribution Engine</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: 24/7 Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          {/* Add Wallet Form */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-primary font-display">Add Target Address to 24/7 Monitoring</h3>
            <form onSubmit={handleAddWatchlist} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={newAddr}
                onChange={(e) => setNewAddr(e.target.value)}
                placeholder="Suspect wallet address (TRON, BTC, ETH)..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-border bg-canvas text-xs font-mono text-primary focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
              />
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Investigative reference / reason..."
                className="sm:w-64 h-10 px-3.5 rounded-xl border border-border bg-canvas text-xs text-primary focus:outline-none focus:border-brand-indigo"
              />
              <Button type="submit" variant="primary" icon={<Plus className="w-4 h-4" />}>
                Add to Watchlist
              </Button>
            </form>
          </div>

          {/* Watchlist Table */}
          <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-subtle/50 text-secondary font-mono text-[11px]">
                  <th className="py-3 px-4">Monitored Address</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Sentinel Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {watchlist.map((w, idx) => (
                  <tr key={idx} className="hover:bg-subtle/30 transition-colors">
                    <td className="py-3 px-4">
                      <AddressChip address={w.address} chain={w.chain} lead={8} tail={6} />
                    </td>
                    <td className="py-3 px-4">
                      <ChainBadge chain={w.chain} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-secondary">{w.reason}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-semantic-successTint text-semantic-successText">
                        <span className="w-1.5 h-1.5 rounded-full bg-semantic-success animate-pulse" />
                        ACTIVE WATCH
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/wallets/${w.chain}/${w.address}`}
                        className="inline-flex items-center gap-1 text-brand-indigo font-bold hover:underline"
                      >
                        <span>Intel</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
