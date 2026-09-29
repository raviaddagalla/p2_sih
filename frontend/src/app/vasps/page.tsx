'use client';

import React, { useEffect, useState } from 'react';
import { 
  Building2, Search, CheckCircle2, Shield, Mail, Phone, Clock, ArrowUpRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { VASPItem } from '@/lib/types';
import { ChainBadge } from '@/components/common/ChainBadge';

export default function VASPsPage() {
  const [vasps, setVasps] = useState<VASPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fiuFilter, setFiuFilter] = useState(false);
  const [search, setSearch] = useState('');

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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Building2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              VASP Compliance & Liaison Directory ({vasps.length})
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registered Virtual Asset Service Providers with FIU-IND compliance channels and SLA response desks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiuFilter(!fiuFilter)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              fiuFilter
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-glow-emerald'
                : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            {fiuFilter ? '✓ FIU-IND Registered Only' : 'Filter FIU-IND Entities'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search VASP name or jurisdiction (e.g. Binance, India...)"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Grid of VASP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-cyan-400/40 space-y-3.5 transition-all text-xs flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">{v.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{v.country}</span>
                </div>

                {v.india_registered && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    FIU-IND
                  </span>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-white/5 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono text-[10px]">{v.compliance_email}</span>
                </div>
                {v.nodal_officer_contact && (
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <Shield className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                    <span className="truncate">{v.nodal_officer_contact}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Freeze SLA:
                  </span>
                  <span className="font-mono font-bold text-white">{v.freeze_response_sla_hours}h</span>
                </div>
              </div>

              {/* Supported Chains */}
              <div className="flex flex-wrap gap-1">
                {v.supported_chains?.map((c) => (
                  <span key={c} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert(`Direct LEA compliance channel opened for ${v.name}: ${v.compliance_email}`)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-xs"
            >
              <span>Dispatch Subpoena / Notice</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
