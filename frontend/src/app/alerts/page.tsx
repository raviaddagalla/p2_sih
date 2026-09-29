'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, Eye, Plus, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { api } from '@/lib/api';
import { AlertItem } from '@/lib/types';
import { formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';

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
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Live Alerts & 24/7 Watchlist Surveillance
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time mempool transaction detection on suspect addresses and syndicated money-mule clusters.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl glass-panel border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'alerts' ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-slate-400'
            }`}
          >
            Alerts Stream ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'watchlist' ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-slate-400'
            }`}
          >
            Active Watchlist ({watchlist.length})
          </button>
        </div>
      </div>

      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.map((a, idx) => (
            <div
              key={a.id || idx}
              className="p-4 rounded-2xl glass-panel border border-white/5 hover:border-cyan-400/40 space-y-2 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    a.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    a.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="font-bold text-white text-sm">{a.title}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatIST(a.created_at)}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-xs">
                {a.body}
              </p>

              {a.job_id && (
                <div className="pt-2 border-t border-white/5 flex justify-end">
                  <Link
                    href={`/trace/${a.job_id}`}
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Inspect Forensic Graph</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div className="space-y-6">
          {/* Add to Watchlist Form */}
          <form onSubmit={handleAddWatchlist} className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Add Suspect Address to Mempool Monitor</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newAddr}
                onChange={(e) => setNewAddr(e.target.value)}
                placeholder="Wallet address (TRON / BTC / ETH)..."
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <input
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Reason / FIR Reference..."
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-glow-cyan"
            >
              Surveil Address
            </button>
          </form>

          {/* Watchlist Table */}
          <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-mono">
                  <th className="p-3">Network</th>
                  <th className="p-3">Target Address</th>
                  <th className="p-3">Surveillance Reason</th>
                  <th className="p-3">Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {watchlist.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3"><ChainBadge chain={w.chain} size="sm" /></td>
                    <td className="p-3 font-mono text-cyan-300 font-bold">{w.address}</td>
                    <td className="p-3 text-slate-300">{w.reason}</td>
                    <td className="p-3 text-slate-400 font-medium">{w.added_by}</td>
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
