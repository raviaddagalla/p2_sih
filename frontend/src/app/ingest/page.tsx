'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowDownToLine, UploadCloud, Database, Sparkles, CheckCircle2, 
  AlertCircle, ArrowRight, Shield, Zap, FileSpreadsheet, Server, RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';
import { ChainBadge } from '@/components/common/ChainBadge';
import { Button } from '@/components/ui/Button';

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
        chain: detectedChain === 'UNKNOWN' ? 'TRON' : detectedChain,
        fraud_type: fraudType,
        victim_name: victimName,
        victim_state: victimState,
        victim_city: victimCity,
        loss_inr: parseFloat(lossInr) || 500000.0
      });
      router.push(`/trace/${res.job_id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 text-primary">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
            CYBER CRIME INGESTION SUITE
          </span>
        </div>
        <h1 className="text-2xl font-black font-display text-primary mt-1">
          Complaint & Suspect Ingestion Hub
        </h1>
        <p className="text-xs text-secondary mt-0.5">
          Ingest suspect cryptocurrency wallet addresses from victim complaints, NCRP, SAHYOG, or bulk CSV batches.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'manual'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-secondary hover:text-primary hover:bg-subtle'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Single Wallet Direct Attribution</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bulk'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-secondary hover:text-primary hover:bg-subtle'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Bulk CSV Ingest Batch</span>
        </button>

        <button
          onClick={() => setActiveTab('integrations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'integrations'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-secondary hover:text-primary hover:bg-subtle'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>NCRP & SAHYOG Connectors</span>
        </button>
      </div>

      {/* Tab 1: Manual Single Ingestion */}
      {activeTab === 'manual' && (
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs">
          <form onSubmit={handleSubmitManual} className="space-y-6">
            {/* Wallet Address with Real-time Auto-Detection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-secondary uppercase font-mono">
                  Suspect Inflow Address (Victim Transferred Funds Here)
                </label>
                {detectedChain !== 'UNKNOWN' && (
                  <div className="flex items-center gap-1.5 animate-in fade-in">
                    <span className="text-[10px] text-muted font-mono">Auto-Detected:</span>
                    <ChainBadge chain={detectedChain} size="sm" />
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. TJb1xV9u... or bc1qar0s... or 0x71C8..."
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-canvas text-xs font-mono text-primary font-bold focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 transition-all"
                />
              </div>
              <p className="text-[11px] text-muted">
                Accepts TRON (TRC20 USDT), Bitcoin (Bech32/Legacy), Ethereum, and BNB Smart Chain addresses.
              </p>
            </div>

            {/* Crime Typology & Loss Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary">
                  Fraud Typology Classification
                </label>
                <select
                  value={fraudType}
                  onChange={(e) => setFraudType(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-border bg-canvas text-xs text-primary font-medium focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
                >
                  <option value="TASK_SCAM">Task-Based Telegram / Part-Time Job Scam</option>
                  <option value="INVESTMENT_FRAUD">High-Yield Fake Crypto Trading / Pig Butchering</option>
                  <option value="IMPERSONATION">Customs / Police Digital Arrest Impersonation</option>
                  <option value="SEXTORTION">Video Call Extortion / Honeytrap</option>
                  <option value="RANSOMWARE">Ransomware / Extortion Demand</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary">
                  Reported Loss Amount (INR ₹)
                </label>
                <input
                  type="number"
                  value={lossInr}
                  onChange={(e) => setLossInr(e.target.value)}
                  placeholder="4250000"
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-canvas text-xs font-mono text-primary font-bold focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
                />
              </div>
            </div>

            {/* Victim Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary">
                  Victim Complainant Name
                </label>
                <input
                  type="text"
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-canvas text-xs text-primary font-medium focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary">
                  Jurisdiction State
                </label>
                <input
                  type="text"
                  value={victimState}
                  onChange={(e) => setVictimState(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-canvas text-xs text-primary font-medium focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary">
                  City / Police Station
                </label>
                <input
                  type="text"
                  value={victimCity}
                  onChange={(e) => setVictimCity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border bg-canvas text-xs text-primary font-medium focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                {submitting ? 'Initiating Multi-Hop Trace...' : 'Launch Instant Blockchain Attribution'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Bulk CSV Ingestion */}
      {activeTab === 'bulk' && (
        <div className="p-8 rounded-2xl bg-surface border-2 border-dashed border-brand-indigo/40 shadow-xs flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-indigoTint text-brand-indigo flex items-center justify-center">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-primary">
              Drag & Drop NCRP Batch CSV or Excel File
            </h3>
            <p className="text-xs text-secondary max-w-md mt-1">
              Supports bulk upload of 100+ suspect wallet addresses with automatic chain classification and parallel forensic worker queueing.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" icon={<FileSpreadsheet className="w-4 h-4" />}>
              Download Sample CSV Template
            </Button>
            <Button variant="primary" icon={<UploadCloud className="w-4 h-4" />}>
              Select CSV File from System
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Connectors */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-sm flex items-center gap-2">
                  <Database className="w-4 h-4 text-brand-indigo" />
                  NCRP Auto-Sync Gateway (I4C)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-semantic-successTint text-semantic-successText border border-semantic-success/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-secondary">
                Direct webhook ingestion from Citizen Financial Cyber Fraud Reporting System (CFCFRMS).
              </p>
              <div className="text-[11px] text-muted font-mono pt-2 border-t border-border flex justify-between">
                <span>Polling Frequency: Every 15s</span>
                <span className="text-semantic-successText font-bold">100% Throughput</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-sm flex items-center gap-2">
                  <Server className="w-4 h-4 text-brand-cyan" />
                  SAHYOG LEA Coordination API
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-semantic-successTint text-semantic-successText border border-semantic-success/30">
                  OPERATIONAL
                </span>
              </div>
              <p className="text-xs text-secondary">
                Automated notice dispatch pipeline for registered Indian FIU-IND virtual digital asset service providers.
              </p>
              <div className="text-[11px] text-muted font-mono pt-2 border-t border-border flex justify-between">
                <span>Latency: &lt; 140ms</span>
                <span className="text-semantic-successText font-bold">Sec 106 Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
