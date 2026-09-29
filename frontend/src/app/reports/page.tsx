'use client';

import React, { useState } from 'react';
import { 
  FileText, Download, CheckCircle2, Shield, Printer, FileDown, Eye
} from 'lucide-react';
import { formatUSD, formatINR } from '@/lib/formatters';

export default function ReportsPage() {
  const [caseNo, setCaseNo] = useState('2024-NCRP-MH-084921');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    window.open('http://127.0.0.1:8000/api/reports/default/download', '_blank');
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Court & LEA Investigation Report Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized cryptographic forensic dossier formatted for Indian Judicial Courts & FIU-IND submission.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan transition-all"
        >
          <FileDown className="w-4 h-4 fill-black" />
          <span>{downloading ? 'Compiling PDF...' : 'Download Court PDF Report'}</span>
        </button>
      </div>

      {/* Report Paper Preview Pane */}
      <div className="p-8 rounded-2xl bg-white text-slate-900 shadow-2xl space-y-6 font-sans border border-slate-300">
        {/* Paper Header */}
        <div className="text-center border-b-2 border-sky-600 pb-4 space-y-1">
          <div className="text-xs font-bold text-red-600 uppercase tracking-widest">
            CONFIDENTIAL // FOR OFFICIAL LAW ENFORCEMENT & JUDICIAL USE ONLY
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            STATE CYBER CRIME INVESTIGATION DIVISION
          </h1>
          <h2 className="text-xs font-bold text-sky-700 tracking-wider">
            CRYPTOCURRENCY FORENSIC TRACING & VASP ATTRIBUTION REPORT
          </h2>
          <div className="text-[10px] text-slate-500 font-mono">
            Document Seal: SHA256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
          </div>
        </div>

        {/* Case Particulars Table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Case Reference:</span>
            <span className="font-mono font-bold text-slate-800">{caseNo}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Offense Classification:</span>
            <span className="font-bold text-slate-800">Telegram Task Fraud (USDT)</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Quantified Loss:</span>
            <span className="font-mono font-bold text-slate-800">₹ 42,50,000.00</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Statutory Basis:</span>
            <span className="font-bold text-slate-800">Sec 106 BNSS 2023 / Sec 94 CrPC</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2 text-xs leading-relaxed text-slate-700">
          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-sm uppercase">
            1. Executive Forensic Summary
          </h3>
          <p>
            Upon receipt of victim complaint from the National Cyber Crime Reporting Portal (NCRP), automated algorithmic tracing was initiated from the primary suspect wallet (<span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-bold">TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L</span>). ChainShield traversed 4 layering hops and identified an off-ramp deposit of <strong>$48,210.00 USDT</strong> into a custodial exchange account registered with <strong>Binance (FIU-IND Registered VASP)</strong> with <strong>94% attribution confidence</strong>.
          </p>
        </div>

        {/* Section 2: VASP Attribution Findings */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-sm uppercase">
            2. VASP Attribution & Immediate Freeze Target
          </h3>
          <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50 text-slate-800 space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span>Identified Custodial VASP:</span>
              <strong className="text-emerald-800 font-sans">Binance (Global / South Asia Desk)</strong>
            </div>
            <div className="flex justify-between">
              <span>Suspect Deposit Address:</span>
              <strong>TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x</strong>
            </div>
            <div className="flex justify-between">
              <span>Attributed Illicit Amount:</span>
              <strong className="text-slate-900">$48,210.00 USDT (≈ ₹ 40,25,535.00)</strong>
            </div>
            <div className="flex justify-between">
              <span>Attribution Hop Distance:</span>
              <strong>4 Hops from Victim Mule</strong>
            </div>
          </div>
        </div>

        {/* Signature Box */}
        <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 text-xs">
          <div>
            <strong>Investigating Officer:</strong><br />
            Inspector Rajan Sharma<br />
            Maharashtra Cyber Crime Cell<br />
            Badge: MH-CY-2024-8841
          </div>
          <div className="text-right">
            <strong>Approved By:</strong><br />
            SP Meenakshi Sundaram, IPS<br />
            Superintendent of Police<br />
            State Cyber Crime Command
          </div>
        </div>
      </div>
    </div>
  );
}
