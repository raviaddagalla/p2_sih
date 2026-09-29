'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowDownToLine, UploadCloud, Database, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, Shield, Zap, FileSpreadsheet
} from 'lucide-react';
import { api } from '@/lib/api';
import { ChainBadge } from '@/components/common/ChainBadge';

export default function IngestPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'manual' | 'bulk' | 'integrations'>('manual');
  const [address, setAddress] = useState('TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L');
  const [detectedChain, setDetectedChain] = useState<'TRON' | 'BTC' | 'ETH' | 'BSC' | 'UNKNOWN'>('TRON');
  const [fraudType, setFraudType] = useState('TASK_SCAM');
  const [victimName, setVictimName] = useState('Ramesh Sharma');
  const [victimState, setVictimState] = useState('Maharashtra');
  const [victimCity, setVictimCity] = useState('Pune');
  const [lossInr, setLossInr] = useState('4250000');
  const [submitting, setSubmitting] = useState(false);

  // Auto-detect chain as user types
  useEffect(() => {
    const addr = address.trim();
    if (addr.startsWith('T') && addr.length === 34) {
      setDetectedChain('TRON');
    } else if (addr.startsWith('bc1') || addr.startsWith('1') || addr.startsWith('3')) {
      setDetectedChain('BTC');
    } else if (addr.startsWith('0x') && addr.length === 42) {
      setDetectedChain('ETH');
    } else {
      setDetectedChain('UNKNOWN');
    }
  }, [address]);

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.ingestSingle({
        address: address.trim(),
        chain: detectedChain,
        fraud_type: fraudType,
        victim_name: victimName,
        victim_state: victimState,
        victim_city: victimCity,
        loss_inr: parseFloat(lossInr) || 500000.0
      });

      // Navigate straight to Live Trace
      router.push(`/trace/${res.job_id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white">
          Complaint Ingestion Hub
        </h2>
        <p className="text-xs text-slate-400">
          Ingest suspect cryptocurrency wallet addresses from victim complaints, NCRP, SAHYOG, or bulk CSV.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'manual'
              ? 'bg-cyan-500 text-black shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Manual Entry & Trace</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bulk'
              ? 'bg-cyan-500 text-black shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Bulk CSV Ingest</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'integrations'
              ? 'bg-cyan-500 text-black shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Live NCRP / SAHYOG Gateways</span>
        </button>
      </div>

      {/* Tab 1: Manual Entry */}
      {activeTab === 'manual' && (
        <form onSubmit={handleSubmitManual} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Suspect Address & Offense Information
            </h3>

            {/* Wallet Address Input with Auto-Detected Chain Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <label>Suspect Wallet Address</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Detected Network:</span>
                  <ChainBadge chain={detectedChain} size="sm" />
                </div>
              </div>

              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L or bc1q..."
                className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-cyan-400/40 font-mono text-sm text-cyan-300 focus:outline-none focus:border-cyan-300 shadow-inner"
              />
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Crime Classification</label>
                <select
                  value={fraudType}
                  onChange={(e) => setFraudType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                >
                  <option value="TASK_SCAM">Telegram Task Fraud (USDT)</option>
                  <option value="INVESTMENT">Investment Trading Club Scam</option>
                  <option value="PHISHING">DeFi Phishing / Drainer</option>
                  <option value="RANSOMWARE">Ransomware Extortion</option>
                  <option value="SEXTORTION">Sextortion BTC Campaign</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Quantified Loss (INR ₹)</label>
                <input
                  type="number"
                  value={lossInr}
                  onChange={(e) => setLossInr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Victim Location (State)</label>
                <select
                  value={victimState}
                  onChange={(e) => setVictimState(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                >
                  <option value="Maharashtra">Maharashtra (Mumbai / Pune)</option>
                  <option value="Karnataka">Karnataka (Bengaluru)</option>
                  <option value="Telangana">Telangana (Hyderabad)</option>
                  <option value="Delhi">Delhi (NCR)</option>
                  <option value="Gujarat">Gujarat (Ahmedabad)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (Lucknow)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Deterministic simulation engine configured · 6-8 seconds to VASP freeze notice.
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan transition-all"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>{submitting ? 'Launching Investigation...' : 'Submit & Trace Immediately'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Bulk CSV */}
      {activeTab === 'bulk' && (
        <div className="p-8 rounded-2xl glass-panel border border-dashed border-white/20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 flex items-center justify-center mx-auto shadow-glow-cyan">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Drag and Drop Batch CSV File</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Upload multiple suspect wallets from NCRP export files (supports .csv, .xlsx, .json).
            </p>
          </div>
          <button
            onClick={() => setActiveTab('manual')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10"
          >
            Select File from Local Storage
          </button>
        </div>
      )}

      {/* Tab 3: Live Connectors */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white text-sm">NCRP National Portal Connector</div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                Online / Polling
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              MHA Indian Cybercrime Coordination Centre automated intake pipeline. Webhook listens for FIR incident registrations.
            </p>
            <div className="pt-2 text-[11px] text-cyan-300 font-mono">
              Last Sync: Just now · Total Ingested Today: 14 Cases
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-white text-sm">SAHYOG Inter-State Portal</div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                Online / Synced
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inter-state intelligence sharing protocol for cross-border mule syndicate tracking.
            </p>
            <div className="pt-2 text-[11px] text-cyan-300 font-mono">
              Last Sync: 4 mins ago · Connected Cells: 28 States
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
