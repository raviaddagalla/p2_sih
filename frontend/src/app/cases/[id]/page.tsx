'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, User, IndianRupee, GitBranch, Lock, ArrowLeft, ArrowUpRight, 
  FileText, ShieldAlert, Sparkles, CheckCircle2, Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatINR, formatUSD, formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';
import { AddressChip } from '@/components/common/AddressChip';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCase() {
      setLoading(true);
      try {
        const data = await api.getCase(id);
        setCaseData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCase();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs">
        Loading Case Dossier...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="text-red-400 font-bold">Case Record Not Found</div>
        <Link href="/cases" className="text-cyan-400 text-xs">Return to Cases Registry</Link>
      </div>
    );
  }

  const victim = caseData.victims?.[0];
  const reportedWallet = caseData.reported_wallets?.[0];
  const traceJob = caseData.trace_jobs?.[0];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Top Navigation */}
      <Link
        href="/cases"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Case Management</span>
      </Link>

      {/* Case Header Dossier */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black text-cyan-400">
                {caseData.case_no}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-400/40">
                {caseData.source} Portal
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                caseData.status === 'TRACED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                caseData.status === 'FROZEN' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/40' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {caseData.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Complaint Ref: <span className="font-mono text-slate-300">{caseData.complaint_ref || 'NCRP-2024-DIRECT'}</span> · 
              Registered: {formatIST(caseData.created_at)}
            </p>
          </div>

          {reportedWallet && (
            <Link
              href={`/trace/${traceJob?.id || 'demo'}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan transition-all w-fit"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Launch Live Forensic Trace</span>
            </Link>
          )}
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-medium">Crime Classification</span>
            <span className="font-bold text-white text-sm">{caseData.fraud_type.replace('_', ' ')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-medium">Quantified Victim Loss</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatINR(caseData.victim_loss_inr)} (≈ {formatUSD(caseData.victim_loss_inr / 83.5)})
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-medium">Assigned Investigating Officer</span>
            <span className="font-bold text-cyan-300">IO Rajan Sharma (MH Cyber)</span>
          </div>
        </div>
      </div>

      {/* Victim & Suspect Wallet Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Victim Information */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Complainant Particulars</span>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <div className="flex justify-between">
              <span className="text-slate-400">Masked Name:</span>
              <span className="font-bold text-white">{victim?.masked_name || 'Ramesh S***'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-200">{victim?.city || 'Pune'}, {victim?.state || 'Maharashtra'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Age Bracket:</span>
              <span className="text-slate-200">{victim?.age_bracket || '28-35'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Loss:</span>
              <span className="font-mono font-bold text-rose-400">{formatINR(caseData.victim_loss_inr)}</span>
            </div>
          </div>
        </div>

        {/* Suspect Wallet Information */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>Reported Suspect Crypto Address</span>
          </div>

          <div className="space-y-2.5 p-3 rounded-xl bg-slate-900/80 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Blockchain Network:</span>
              <ChainBadge chain={reportedWallet?.chain || 'TRON'} size="sm" />
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Target Address:</span>
              <AddressChip
                address={reportedWallet?.address || 'TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L'}
                chain={reportedWallet?.chain || 'TRON'}
                lead={10}
                tail={8}
                showExplorer={true}
              />
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Tracing Status:</span>
              <span className="font-mono font-bold text-emerald-400">
                {reportedWallet?.status || 'TRACED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
