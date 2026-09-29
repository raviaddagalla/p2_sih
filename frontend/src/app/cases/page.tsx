'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, Filter, ArrowUpRight, Shield, IndianRupee, GitBranch, 
  AlertCircle, LayoutGrid, List, ChevronRight, User, Plus
} from 'lucide-react';
import { api } from '@/lib/api';
import { CaseItem } from '@/lib/types';
import { formatINR, formatUSD, formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';
import { AddressChip } from '@/components/common/AddressChip';
import { Button } from '@/components/ui/Button';

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fraudFilter, setFraudFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');

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
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              INVESTIGATION REPOSITORY
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Law Enforcement Case Registry ({cases.length})
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Historical and active cryptocurrency cyber fraud cases across 15 Indian State Police jurisdictions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Table / Board toggle */}
          <div className="flex items-center bg-subtle p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-surface text-brand-indigo shadow-xs' : 'text-muted hover:text-primary'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'board' ? 'bg-surface text-brand-indigo shadow-xs' : 'text-muted hover:text-primary'
              }`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Link href="/ingest">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Ingest New Case
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case number, victim name, city, or address..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-canvas text-xs text-primary focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5">
          {['', 'REGISTERED', 'TRACED', 'FROZEN'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-brand-indigo text-white shadow-xs'
                  : 'bg-subtle text-secondary hover:bg-border/60'
              }`}
            >
              {st || 'All Statuses'}
            </button>
          ))}
        </div>

        {/* Typology Filter */}
        <select
          value={fraudFilter}
          onChange={(e) => setFraudFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-border bg-canvas text-xs text-primary font-medium focus:outline-none focus:border-brand-indigo"
        >
          <option value="">All Crime Typologies</option>
          <option value="TASK_SCAM">Task Scam</option>
          <option value="INVESTMENT_FRAUD">Investment Fraud</option>
          <option value="IMPERSONATION">Digital Arrest</option>
          <option value="SEXTORTION">Sextortion</option>
        </select>
      </div>

      {/* View: Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-subtle/60 text-secondary font-mono text-[11px]">
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">Typology</th>
                  <th className="py-3 px-4">Victim & State</th>
                  <th className="py-3 px-4">Suspect Wallet</th>
                  <th className="py-3 px-4">Quantified Loss</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cases.map((c) => {
                  const rep = c.reported_wallets?.[0];
                  return (
                    <tr key={c.id} className="hover:bg-subtle/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-indigo">
                        {c.case_no}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-primary">{c.fraud_type}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-primary">{c.victim_name || c.victims?.[0]?.masked_name || 'Complainant'}</div>
                        <div className="text-[10px] text-muted">{c.victim_city || c.victims?.[0]?.city || 'Cyber Cell'}, {c.victim_state || c.victims?.[0]?.state || 'India'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {rep ? (
                          <AddressChip address={rep.address} chain={rep.chain} lead={6} tail={4} />
                        ) : (
                          <span className="text-muted font-mono">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        {formatINR(c.victim_loss_inr || c.amount_inr || 500000, true)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          c.status === 'FROZEN' ? 'bg-semantic-successTint text-semantic-successText border border-semantic-success/30' :
                          c.status === 'TRACED' ? 'bg-brand-indigoTint text-brand-indigo border border-brand-indigo/30' :
                          'bg-semantic-warningTint text-semantic-warningText border border-semantic-warning/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-brand-indigoTint text-brand-indigo flex items-center justify-center text-[10px] font-bold">
                            IO
                          </div>
                          <span className="text-xs text-secondary">{c.assigned_io || 'IO Rajan'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-surface hover:bg-brand-indigoTint hover:text-brand-indigo font-bold text-secondary transition-all"
                        >
                          <span>Open Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['REGISTERED', 'TRACED', 'FROZEN'] as const).map((colStatus) => {
            const colCases = cases.filter(c => c.status === colStatus);
            return (
              <div key={colStatus} className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      colStatus === 'FROZEN' ? 'bg-semantic-success' :
                      colStatus === 'TRACED' ? 'bg-brand-indigo' : 'bg-semantic-warning'
                    }`} />
                    <span className="font-bold text-xs uppercase font-mono tracking-wider text-primary">
                      {colStatus}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-subtle text-secondary">
                    {colCases.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {colCases.map((c) => (
                    <Link
                      key={c.id}
                      href={`/cases/${c.id}`}
                      className="block p-3.5 rounded-xl border border-border bg-subtle/40 hover:bg-surface hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-brand-indigo text-xs">{c.case_no}</span>
                        <span className="text-[10px] text-muted">{c.victim_state || c.victims?.[0]?.state || 'MH'}</span>
                      </div>
                      <div className="font-bold text-primary text-xs">{c.fraud_type}</div>
                      <div className="text-xs font-mono font-bold text-primary">{formatINR(c.victim_loss_inr || c.amount_inr || 500000, true)}</div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
