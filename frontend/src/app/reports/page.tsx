'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, Shield, Printer, FileDown, Eye, Check, Sliders
} from 'lucide-react';
import { formatUSD, formatINR } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

export default function ReportsPage() {
  const [caseNo, setCaseNo] = useState('2024-NCRP-MH-084921');
  const [downloading, setDownloading] = useState(false);
  const [includeGraph, setIncludeGraph] = useState(true);
  const [includeHashes, setIncludeHashes] = useState(true);

  const handleDownload = () => {
    setDownloading(true);
    window.open('http://127.0.0.1:8000/api/reports/default/download', '_blank');
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              JUDICIAL EVIDENCE GENERATOR
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Court & LEA Investigation Report Generator
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Standardized cryptographic forensic dossier formatted for Indian Judicial Courts & FIU-IND submission.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          loading={downloading}
          onClick={handleDownload}
          icon={<FileDown className="w-4 h-4" />}
        >
          {downloading ? 'Compiling PDF...' : 'Download Official PDF Report'}
        </Button>
      </div>

      {/* Split View: Options on Left, Live Paper Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dossier Options (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
              Dossier Configuration
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Select case parameters to include in the generated cryptographic audit record.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary">
                Target Case Reference
              </label>
              <select
                value={caseNo}
                onChange={(e) => setCaseNo(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-canvas text-xs font-mono font-bold text-primary focus:outline-none focus:border-brand-indigo"
              >
                <option value="2024-NCRP-MH-084921">2024-NCRP-MH-084921 (TRON Task Scam)</option>
                <option value="2024-NCRP-DL-03194">2024-NCRP-DL-03194 (BTC Peel Chain)</option>
                <option value="2024-NCRP-KA-11928">2024-NCRP-KA-11928 (ETH Cross-Chain)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-bold text-secondary uppercase font-mono">
                Evidence Inclusions
              </label>

              <label className="flex items-center gap-2.5 text-xs text-primary cursor-pointer p-2 rounded-lg hover:bg-subtle">
                <input
                  type="checkbox"
                  checked={includeGraph}
                  onChange={(e) => setIncludeGraph(e.target.checked)}
                  className="rounded text-brand-indigo focus:ring-brand-indigo"
                />
                <span className="font-medium">Embed Multi-Hop Cytoscape Forensic Graph</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-primary cursor-pointer p-2 rounded-lg hover:bg-subtle">
                <input
                  type="checkbox"
                  checked={includeHashes}
                  onChange={(e) => setIncludeHashes(e.target.checked)}
                  className="rounded text-brand-indigo focus:ring-brand-indigo"
                />
                <span className="font-medium">Append Raw Transaction Hashes & Merkle Proofs</span>
              </label>
            </div>

            <div className="p-3.5 rounded-xl bg-subtle/70 border border-border text-xs text-secondary space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-indigo" />
                Section 65B Evidence Act Certification
              </div>
              <p className="text-[11px] leading-snug">
                This document is generated with an immutable SHA-256 digital fingerprint valid under Indian Evidence Act Section 65B.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Paper-Style Live Preview (8 cols) */}
        <div className="lg:col-span-8 p-10 rounded-2xl bg-white text-slate-900 shadow-xl border border-border-strong space-y-6 font-sans">
          {/* Paper Header */}
          <div className="text-center border-b-2 border-brand-indigo pb-5 space-y-1.5">
            <div className="text-[11px] font-bold text-semantic-dangerText uppercase tracking-widest font-mono">
              CONFIDENTIAL // FOR OFFICIAL LAW ENFORCEMENT & JUDICIAL USE ONLY
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-display">
              STATE CYBER CRIME INVESTIGATION DIVISION
            </h2>
            <h3 className="text-xs font-bold text-brand-indigo tracking-wider">
              CRYPTOCURRENCY FORENSIC TRACING & VASP ATTRIBUTION REPORT
            </h3>
            <div className="text-[10px] text-slate-500 font-mono">
              Digital Signature Seal: SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>

          {/* Case Particulars Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Case Reference:</span>
              <span className="font-mono font-bold text-slate-800">{caseNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Incident Typology:</span>
              <span className="font-bold text-slate-800">TASK_SCAM</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Victim Loss:</span>
              <span className="font-mono font-bold text-red-600">₹42,50,000</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Investigating Unit:</span>
              <span className="font-semibold text-slate-800">MH Cyber Crime Cell</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
              1. EXECUTIVE FORENSIC SUMMARY
            </h4>
            <p>
              On receipt of NCRP complaint regarding organized task fraud siphoning, ChainShield multi-hop traversal traced victim funds across <strong>4 hops</strong> on the TRON blockchain ledger. Suspect funds totaling <strong>$48,210.00 USD (approx. ₹40,25,535 INR)</strong> were definitively attributed to custodial exchange deposit account <strong>TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x</strong> maintained by <strong>Binance</strong> (FIU-IND Registered).
            </p>
          </div>

          {/* Section 2: Attribution Particulars */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
              2. IDENTIFIED VASP & TARGET DEPOSIT WALLET
            </h4>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1">
              <div className="font-bold text-sm">Target Exchange: Binance Holdings Ltd. (FIU-IND Verified)</div>
              <div className="font-mono text-[11px]">Deposit Address: TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x</div>
              <div className="text-[11px]">
                Attribution Confidence: <strong>94.2%</strong> · Hop Distance: <strong>Hop 4</strong> · Action: <strong>Section 106 BNSS Notice Issued</strong>
              </div>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">IO Rajan Sharma</div>
              <div className="text-[10px] text-slate-500 font-mono">Investigating Officer (Badge MH-CY-8841)</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-brand-indigo font-mono">CERTIFIED TRUE COPY</div>
              <div className="text-[10px] text-slate-500 font-mono">Digital Token #CS-MH-8841-2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
