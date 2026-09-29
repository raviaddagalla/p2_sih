'use client';

import React, { useState } from 'react';
import { X, Send, Lock, FileText, CheckCircle2, Shield } from 'lucide-react';
import { api } from '@/lib/api';
import { formatUSD, formatINR } from '@/lib/formatters';

interface FreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string;
  caseNo?: string;
  vaspName?: string;
  depositAddress?: string;
  amountUsd?: number;
  onSuccess?: () => void;
}

export const FreezeModal: React.FC<FreezeModalProps> = ({
  isOpen,
  onClose,
  caseId = '2d9c5fbc-0820-4759-aa95-ab27fadf177e',
  caseNo = '2024-NCRP-MH-084921',
  vaspName = 'Binance',
  depositAddress = 'TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x',
  amountUsd = 48210.0,
  onSuccess
}) => {
  const [legalProvision, setLegalProvision] = useState('Section 106 BNSS 2023 / Section 94 CrPC');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const defaultNoticeText = `FORMAL EMERGENCY ASSET FREEZE REQUISITION
UNDER SECTION 106 BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 / SECTION 94 CrPC

To:
The Nodal Officer / Law Enforcement Liaison Team,
${vaspName} Compliance & Security Desk

Subject: Urgent Requisition for Immediate Debit-Freeze on Virtual Digital Asset Account: ${depositAddress}
Reference: State Cyber Crime Incident / NCRP Ref: ${caseNo}

Sir / Madam,

1. An active cyber fraud investigation is underway into organized syndicate operations involving cyber siphoning and task fraud deception.

2. Forensic tracing verified via ChainShield Blockchain Intelligence System has established that illicit victim funds totaling $${amountUsd.toLocaleString()} USD (approx. ₹${(amountUsd * 83.5).toLocaleString()}) were directly deposited into custodial deposit wallet:
   Target Address: ${depositAddress}

3. Under powers vested in law enforcement under Section 106 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 read with Section 91/94 CrPC, you are hereby DIRECTED to:
   a) Immediately execute a TOTAL DEBIT-FREEZE on wallet ${depositAddress} and any linked internal user account (UID).
   b) Preserve all relevant server access logs, KYC documents, connected Indian fiat bank accounts, and UPI references.
   c) Transmit written compliance confirmation to this Cyber Crime Division within your FIU-IND SLA timeline.

Issued By Order,
Investigating Officer (IO)
Maharashtra Cyber Crime Investigation Cell / I4C Desk`;

  const [noticeContent, setNoticeContent] = useState(defaultNoticeText);

  if (!isOpen) return null;

  const handleSendFreeze = async () => {
    setSending(true);
    try {
      // In demo mode, simulate sending
      await new Promise(r => setTimeout(r, 1000));
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setSending(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (e) {
      console.error(e);
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl glass-panel-elevated border border-emerald-400/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Issue Emergency Freeze Notice
              </h3>
              <p className="text-[11px] text-emerald-400/80 font-mono">
                Statutory Notice under Section 106 BNSS 2023 · Target: {vaspName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {sentSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto shadow-glow-emerald animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Notice Dispatched to {vaspName} Nodal Desk</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Freeze requisition successfully logged in ChainShield Audit Registry and forwarded to compliance. Expected SLA: 24h.
              </p>
            </div>
          ) : (
            <>
              {/* Target Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Recipient Exchange</span>
                  <span className="font-bold text-emerald-400">{vaspName} (FIU-IND)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Attributed Tainted Amount</span>
                  <span className="font-mono font-bold text-white">
                    {formatUSD(amountUsd)} (≈ {formatINR(amountUsd * 83.5, true)})
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block font-medium">Suspect Deposit Address</span>
                  <span className="font-mono text-cyan-300 break-all">{depositAddress}</span>
                </div>
              </div>

              {/* Editable Legal Letter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-cyan-400" /> Formal Legal Notice Text (Editable)
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">TEMPLATE — Verify prior to use</span>
                </div>
                <textarea
                  rows={10}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!sentSuccess && (
          <div className="p-4 px-6 border-t border-white/10 bg-slate-950/70 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Signed by IO Rajan Sharma (MH-CY-8841)
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFreeze}
                disabled={sending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-glow-emerald transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Dispatching...' : 'Dispatch Freeze Notice'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
