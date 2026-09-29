'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, Filter, ArrowUpRight, Shield, IndianRupee, GitBranch, AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { CaseItem } from '@/lib/types';
import { formatINR, formatUSD, formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fraudFilter, setFraudFilter] = useState('');

  useEffect(() => {
    async function loadCases() {
      setLoading(true);
      try {
        const data = await api.getCases({
          query: searchQuery,
          status: statusFilter,
          fraud_type: fraudFilter,
          limit: 100
        });
        setCases(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, [searchQuery, statusFilter, fraudFilter]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Briefcase className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Law Enforcement Case Registry ({cases.length})
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical & active cryptocurrency cyber fraud cases across 15 Indian state jurisdictions.
          </p>
        </div>

        <Link
          href="/ingest"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-glow-cyan transition-all w-fit"
        >
          <span>Ingest New Case</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case No (e.g. 2024-NCRP-MH...)"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="TRACED">TRACED</option>
            <option value="FROZEN">FROZEN</option>
            <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">Crime Typology:</label>
          <select
            value={fraudFilter}
            onChange={(e) => setFraudFilter(e.target.value)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
          >
            <option value="">All Typologies</option>
            <option value="TASK_SCAM">Task Fraud (USDT)</option>
            <option value="INVESTMENT">Investment Scam</option>
            <option value="PHISHING">Phishing / Drainer</option>
            <option value="RANSOMWARE">Ransomware</option>
            <option value="SEXTORTION">Sextortion</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-mono">
                <th className="p-3.5">Case Reference</th>
                <th className="p-3.5">Crime Typology</th>
                <th className="p-3.5">Victim Details</th>
                <th className="p-3.5">Reported Wallet</th>
                <th className="p-3.5">Network</th>
                <th className="p-3.5">Loss (INR ₹)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cases.map((c) => {
                const victim = c.victims?.[0];
                const rep = c.reported_wallets?.[0];

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-cyan-300">
                      {c.case_no}
                    </td>
                    <td className="p-3.5 font-medium text-slate-200">
                      {c.fraud_type.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {victim ? `${victim.masked_name} (${victim.city}, ${victim.state})` : 'Anonymous'}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {rep ? truncateAddress(rep.address, 6, 6) : 'TJb1xV9u...'}
                    </td>
                    <td className="p-3.5">
                      <ChainBadge chain={rep?.chain || 'TRON'} size="sm" />
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      {formatINR(c.victim_loss_inr)}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        c.status === 'TRACED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        c.status === 'FROZEN' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/40' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-white/10 transition-colors"
                      >
                        <span>Investigate</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
