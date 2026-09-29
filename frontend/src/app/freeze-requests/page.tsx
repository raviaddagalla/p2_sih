'use client';

import React, { useEffect, useState } from 'react';
import { 
  Snowflake, Send, CheckCircle2, AlertCircle, Lock, Landmark, 
  ArrowRight, FileText, ChevronRight, RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { FreezeRequestItem } from '@/lib/types';
import { formatUSD, formatINR, formatIST, truncateAddress } from '@/lib/formatters';
import { FreezeModal } from '@/components/freeze/FreezeModal';

const COLUMNS = [
  { id: 'DRAFT', label: 'Draft Requisitions', color: 'border-amber-500/40 text-amber-300' },
  { id: 'SENT', label: 'Dispatched to VASP', color: 'border-blue-500/40 text-blue-300' },
  { id: 'ACKNOWLEDGED', label: 'VASP Acknowledged', color: 'border-purple-500/40 text-purple-300' },
  { id: 'FROZEN', label: 'Assets Frozen & Secured', color: 'border-emerald-500/40 text-emerald-300' },
];

export default function FreezeRequestsPage() {
  const [requests, setRequests] = useState<FreezeRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<FreezeRequestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getFreezeRequests();
      setRequests(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const advanceStatus = async (item: FreezeRequestItem) => {
    let nextStatus = 'SENT';
    if (item.status === 'DRAFT') nextStatus = 'SENT';
    else if (item.status === 'SENT') nextStatus = 'ACKNOWLEDGED';
    else if (item.status === 'ACKNOWLEDGED') nextStatus = 'FROZEN';

    try {
      await api.updateFreezeRequest(item.id, { status: nextStatus });
      // Optimistic update
      setRequests(prev => prev.map(r => r.id === item.id ? { ...r, status: nextStatus as any } : r));
    } catch (e) {
      console.error(e);
    }
  };

  const openNotice = (item: FreezeRequestItem) => {
    setSelectedRequest(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Snowflake className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Freeze Request Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statutory asset preservation workflow under Section 106 BNSS 2023 / Section 94 CrPC.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-slate-300 text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Kanban</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colItems = requests.filter(r => r.status === col.id);
          const totalColUSD = colItems.reduce((acc, i) => acc + (i.amount_usd || 0), 0);

          return (
            <div key={col.id} className="rounded-2xl glass-panel border border-white/10 flex flex-col max-h-[75vh]">
              {/* Column Header */}
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950/60 rounded-t-2xl">
                <div>
                  <div className={`text-xs font-bold ${col.color}`}>
                    {col.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {formatUSD(totalColUSD, true)} (≈ {formatINR(totalColUSD * 83.5, true)})
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300">
                  {colItems.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 hover:border-cyan-400/40 space-y-2.5 transition-all text-xs group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-mono font-bold text-cyan-300">
                        {item.case_no}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {item.fraud_type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.vasp_name}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/70 border border-white/5 space-y-1 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Target Amount:</span>
                        <span className="text-white font-bold">{formatUSD(item.amount_usd)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.addresses?.[0] ? truncateAddress(item.addresses[0], 8, 6) : 'TZ8nC1m8...'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => openNotice(item)}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Notice</span>
                      </button>

                      {item.status !== 'FROZEN' && (
                        <button
                          onClick={() => advanceStatus(item)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-[10px] transition-all"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedRequest && (
        <FreezeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          caseNo={selectedRequest.case_no}
          vaspName={selectedRequest.vasp_name}
          depositAddress={selectedRequest.addresses?.[0]}
          amountUsd={selectedRequest.amount_usd}
          onSuccess={loadRequests}
        />
      )}
    </div>
  );
}
