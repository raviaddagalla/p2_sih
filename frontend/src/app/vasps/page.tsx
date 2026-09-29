'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building2, Search, CheckCircle2, Shield, Mail, Phone, Clock, ArrowUpRight, 
  ExternalLink, Check, Filter, Layers, LayoutGrid, List
} from 'lucide-react';
import { api } from '@/lib/api';
import { VASPItem } from '@/lib/types';
import { ChainBadge } from '@/components/common/ChainBadge';
import { Button } from '@/components/ui/Button';

export default function VASPsPage() {
  const [vasps, setVasps] = useState<VASPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fiuFilter, setFiuFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    async function loadVasps() {
      setLoading(true);
      try {
        const data = await api.getVASPs(fiuFilter);
        setVasps(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadVasps();
  }, [fiuFilter]);

  const filtered = vasps.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-semantic-success" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              FINANCIAL INTELLIGENCE UNIT (FIU-IND) REGISTRY
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            VASP Compliance & Liaison Directory ({vasps.length})
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Registered Virtual Asset Service Providers with designated LEA response desks, KYC gateways, and Section 106 compliance SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-subtle p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-surface text-brand-indigo shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-surface text-brand-indigo shadow-xs' : 'text-muted hover:text-primary'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant={fiuFilter ? 'primary' : 'secondary'}
            size="md"
            onClick={() => setFiuFilter(!fiuFilter)}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            {fiuFilter ? 'Showing FIU-IND Only' : 'Filter FIU Registered'}
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by exchange name, country, or jurisdiction..."
          className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-surface text-xs text-primary focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 shadow-xs"
        />
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((v) => {
            const monogram = v.name.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();

            return (
              <div
                key={v.id}
                className="p-5 rounded-2xl bg-surface border border-border shadow-xs hover:shadow-md hover:border-brand-indigo/30 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top: Monogram + Flags */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-indigoTint text-brand-indigo flex items-center justify-center font-display font-black text-base border border-brand-indigo/20">
                      {monogram}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-subtle text-secondary text-[11px] font-mono font-bold border border-border">
                        {v.country}
                      </span>
                      {(v.india_registered || v.fiu_registered) && (
                        <span className="px-2 py-0.5 rounded-md bg-semantic-successTint text-semantic-successText text-[10px] font-bold font-mono border border-semantic-success/30 flex items-center gap-1">
                          <Check className="w-3 h-3 text-semantic-success" /> FIU
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="font-bold text-base text-primary font-display">{v.name}</h3>
                    <p className="text-[11px] text-muted font-mono">{v.type || v.entity_type || 'EXCHANGE'} Desk</p>
                  </div>

                  {/* Supported Chains */}
                  <div className="flex flex-wrap gap-1">
                    {v.supported_chains?.map((ch) => (
                      <ChainBadge key={ch} chain={ch} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Metrics & SLA strip */}
                <div className="pt-3 border-t border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-muted" /> Response SLA:
                    </span>
                    <span className="font-mono font-bold text-primary">
                      {v.freeze_response_sla_hours || v.sla_response_hours || 24} Hours
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-secondary">
                    <span>Contact Officer:</span>
                    <span className="font-mono text-[11px] text-brand-indigo truncate max-w-[140px]">
                      {v.compliance_email || v.liaison_email}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-subtle/50 text-secondary font-mono text-[11px]">
                <th className="py-3 px-4">Exchange Name</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">FIU-IND Status</th>
                <th className="py-3 px-4">Chains Supported</th>
                <th className="py-3 px-4">Response SLA</th>
                <th className="py-3 px-4">Liaison Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-subtle/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary font-display">{v.name}</td>
                  <td className="py-3 px-4 font-mono">{v.country}</td>
                  <td className="py-3 px-4">
                    {(v.india_registered || v.fiu_registered) ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-semantic-successTint text-semantic-successText">
                        Registered
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-subtle text-muted">
                        Unregistered
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {v.supported_chains?.slice(0, 3).map((ch) => (
                        <ChainBadge key={ch} chain={ch} size="sm" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-primary">{v.freeze_response_sla_hours || v.sla_response_hours || 24}h</td>
                  <td className="py-3 px-4 font-mono text-brand-indigo">{v.compliance_email || v.liaison_email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
