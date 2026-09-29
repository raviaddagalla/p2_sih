'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, User, IndianRupee, GitBranch, Lock, ArrowLeft, ArrowUpRight, 
  FileText, ShieldAlert, Sparkles, CheckCircle2, Clock, Share2, Layers, Check
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatINR, formatUSD, formatIST, truncateAddress } from '@/lib/formatters';
import { ChainBadge } from '@/components/common/ChainBadge';
import { AddressChip } from '@/components/common/AddressChip';
import { Button } from '@/components/ui/Button';

const STATUS_STEPS = [
  'Registered',
  'Traced',
  'Requisitioned',
  'Frozen',
  'Closed'
];

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'wallets' | 'notes'>('overview');

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
      <div className="p-12 text-center text-muted font-mono text-xs">
        Loading Forensic Case Dossier...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="text-semantic-danger font-bold">Case Record Not Found</div>
        <Link href="/cases" className="text-brand-indigo text-xs">Return to Cases Registry</Link>
      </div>
    );
  }

  const victim = caseData.victims?.[0];
  const reportedWallet = caseData.reported_wallets?.[0];
  const traceJob = caseData.trace_jobs?.[0];

  // Determine current step index
  let currentStepIdx = 1; // Default traced
  if (caseData.status === 'FROZEN') currentStepIdx = 3;
  else if (caseData.status === 'CLOSED') currentStepIdx = 4;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-primary">
      {/* Back button */}
      <Link
        href="/cases"
        className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-brand-indigo transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Case Management Registry</span>
      </Link>

      {/* Case Header Card */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xl font-black text-brand-indigo">
                {caseData.case_no}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-subtle text-secondary font-mono font-bold border border-border">
                {caseData.source} Gateway
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                caseData.status === 'FROZEN' ? 'bg-semantic-successTint text-semantic-successText border border-semantic-success/30' :
                'bg-brand-indigoTint text-brand-indigo border border-brand-indigo/30'
              }`}>
                {caseData.status}
              </span>
            </div>

            <p className="text-xs text-secondary mt-1">
              Incident Ref: <span className="font-mono text-primary font-bold">{caseData.complaint_ref || 'NCRP-2024-DIRECT'}</span> · 
              Registered on {formatIST(caseData.created_at)}
            </p>
          </div>

          <Link href={`/trace/${traceJob?.id || 'demo'}`}>
            <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
              Launch Live Forensic Trace
            </Button>
          </Link>
        </div>

        {/* Status Stepper Strip */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STATUS_STEPS.map((stepName, idx) => {
              const isPast = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={stepName} className="flex flex-col items-center relative flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                    isPast
                      ? 'bg-brand-indigo text-white shadow-xs'
                      : 'bg-subtle text-muted border border-border'
                  }`}>
                    {isPast ? <Check className="w-4 h-4 text-white" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${
                    isCurrent ? 'text-brand-indigo font-bold' : isPast ? 'text-primary' : 'text-muted'
                  }`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-border text-xs">
          <div className="p-3.5 rounded-xl bg-subtle/50 border border-border space-y-1">
            <span className="text-muted block font-bold uppercase font-mono text-[10px]">Crime Classification</span>
            <span className="font-bold text-primary text-sm">{caseData.fraud_type.replace('_', ' ')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-subtle/50 border border-border space-y-1">
            <span className="text-muted block font-bold uppercase font-mono text-[10px]">Quantified Victim Loss</span>
            <span className="font-mono font-bold text-primary text-sm">
              {formatINR(caseData.victim_loss_inr)} <span className="text-xs text-muted font-normal">({formatUSD(caseData.victim_loss_inr / 83.5)})</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-subtle/50 border border-border space-y-1">
            <span className="text-muted block font-bold uppercase font-mono text-[10px]">Assigned Investigating Officer</span>
            <span className="font-bold text-brand-indigo">IO Rajan Sharma (MH Cyber)</span>
          </div>
        </div>
      </div>

      {/* Linked Cases Insight Card (Cross-Syndicate intelligence) */}
      <div className="p-5 rounded-2xl bg-brand-indigoTint/40 border border-brand-indigo/30 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-indigo text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-primary font-display">
              Cross-Case Syndicate Overlap Detected
            </div>
            <p className="text-[11px] text-secondary">
              Intermediary hop wallet <strong className="font-mono text-brand-indigo">0x81C9...2bF1</strong> also appeared in case <span className="font-mono font-bold">2024-NCRP-DL-03194</span> (Delhi Police Special Cell).
            </p>
          </div>
        </div>
        <Link href="/trace/demo">
          <Button variant="soft" size="sm">
            Correlate Cluster
          </Button>
        </Link>
      </div>

      {/* Victim & Suspect Wallet Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Victim Information */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <User className="w-4 h-4 text-brand-indigo" />
            <span>Complainant Particulars</span>
          </div>

          <div className="space-y-2.5 p-4 rounded-xl bg-subtle/50 border border-border">
            <div className="flex justify-between">
              <span className="text-secondary font-medium">Victim Masked Name:</span>
              <span className="font-bold text-primary">{victim?.masked_name || 'Ramesh S***'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-medium">Jurisdiction Location:</span>
              <span className="text-primary font-semibold">{victim?.city || 'Pune'}, {victim?.state || 'Maharashtra'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-medium">Complainant Age Bracket:</span>
              <span className="text-primary">{victim?.age_bracket || '28-35'}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-secondary font-medium">Quantified Deposition:</span>
              <span className="font-mono font-bold text-semantic-dangerText">{formatINR(caseData.victim_loss_inr)}</span>
            </div>
          </div>
        </div>

        {/* Suspect Wallet Information */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <GitBranch className="w-4 h-4 text-brand-indigo" />
            <span>Reported Suspect Crypto Address</span>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-subtle/50 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-secondary font-medium">Blockchain Network:</span>
              <ChainBadge chain={reportedWallet?.chain || 'TRON'} size="sm" />
            </div>

            <div>
              <span className="text-secondary font-medium block mb-1">Target Inflow Address:</span>
              <AddressChip
                address={reportedWallet?.address || 'TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L'}
                chain={reportedWallet?.chain || 'TRON'}
                lead={10}
                tail={8}
                showExplorer={true}
              />
            </div>

            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-secondary font-medium">Attribution Status:</span>
              <span className="font-mono font-bold text-semantic-successText">
                {reportedWallet?.status || 'TRACED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
