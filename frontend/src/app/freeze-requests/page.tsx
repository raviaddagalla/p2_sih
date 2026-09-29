'use client';

import React, { useEffect, useState } from 'react';
import { 
  Snowflake, Send, CheckCircle2, AlertCircle, Lock, Landmark, 
  ArrowRight, FileText, ChevronRight, RefreshCw, Clock, Plus
} from 'lucide-react';
import { api } from '@/lib/api';
import { FreezeRequestItem } from '@/lib/types';
import { formatUSD, formatINR, formatIST, truncateAddress } from '@/lib/formatters';
import { FreezeModal } from '@/components/freeze/FreezeModal';
import { Button } from '@/components/ui/Button';

const COLUMNS = [
  { id: 'DRAFT', label: 'Draft Requisitions', color: 'bg-subtle text-secondary border-border', dot: 'bg-muted' },
  { id: 'SENT', label: 'Dispatched to VASP', color: 'bg-brand-indigoTint text-brand-indigo border-brand-indigo/30', dot: 'bg-brand-indigo' },
  { id: 'ACKNOWLEDGED', label: 'VASP Acknowledged', color: 'bg-semantic-warningTint text-semantic-warningText border-semantic-warning/30', dot: 'bg-semantic-warning' },
  { id: 'FROZEN', label: 'Assets Frozen & Secured', color: 'bg-semantic-successTint text-semantic-successText border-semantic-success/30', dot: 'bg-semantic-success' },
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
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-semantic-success" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              SECTION 106 BNSS (CRPC 94) REQUISITION DESK
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Exchange Asset Freeze Center
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Real-time requisition tracking with FIU-IND registered virtual digital asset service providers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="md"
            onClick={loadRequests}
            icon={<RefreshCw className="w-4 h-4 text-brand-indigo" />}
          >
            Refresh SLA Status
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create New Requisition
          </Button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colItems = requests.filter(r => r.status === col.id);
          return (
            <div
              key={col.id}
              className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex flex-col space-y-3.5 min-h-[580px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className="font-bold text-xs font-display tracking-tight text-primary">
                    {col.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-subtle text-secondary">
                  {colItems.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colItems.length === 0 ? (
                  <div className="p-8 text-center text-muted text-xs border border-dashed border-border rounded-xl">
                    No active requisitions
                  </div>
                ) : (
                  colItems.map((item) => {
                    const monogram = (item.vasp_name || 'EX')
                      .replace(/[^a-zA-Z]/g, '')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl border border-border bg-subtle/40 hover:bg-surface hover:shadow-xs transition-all space-y-2.5 group"
                      >
                        {/* VASP & SLA Tag */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-brand-indigoTint text-brand-indigo flex items-center justify-center text-xs font-bold shrink-0">
                              {monogram}
                            </div>
                            <span className="font-bold text-xs text-primary truncate">
                              {item.vasp_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-semantic-warningText bg-semantic-warningTint px-2 py-0.5 rounded-full shrink-0">
                            <Clock className="w-3 h-3 text-semantic-warning" />
                            <span>SLA 18h</span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="pt-1">
                          <div className="text-base font-black font-display text-primary">
                            {formatUSD(item.amount_usd)}
                          </div>
                          <div className="text-[11px] text-muted font-mono">
                            ≈ {formatINR(item.amount_usd * 83.5, true)}
                          </div>
                        </div>

                        {/* Wallet Address */}
                        <div className="font-mono text-[11px] text-brand-indigo truncate bg-canvas p-1.5 rounded-lg border border-border">
                          {truncateAddress(item.deposit_address || item.addresses?.[0] || 'Unknown', 10, 8)}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <button
                            onClick={() => openNotice(item)}
                            className="text-[11px] font-bold text-secondary hover:text-brand-indigo flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> Notice
                          </button>

                          {item.status !== 'FROZEN' && (
                            <button
                              onClick={() => advanceStatus(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-brand-indigoTint hover:text-brand-indigo text-[11px] font-bold text-secondary transition-all"
                            >
                              <span>Next Stage</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Freeze Notice Modal */}
      {selectedRequest && (
        <FreezeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vaspName={selectedRequest.vasp_name}
          depositAddress={selectedRequest.deposit_address || selectedRequest.addresses?.[0] || 'Unknown'}
          amountUsd={selectedRequest.amount_usd}
          onSuccess={loadRequests}
        />
      )}
    </div>
  );
}
