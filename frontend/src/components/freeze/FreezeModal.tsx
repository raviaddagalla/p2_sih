'use client';

import React, { useState } from 'react';
import { X, Send, Lock, FileText, CheckCircle2, Shield, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatUSD, formatINR, truncateAddress } from '@/lib/formatters';

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
      await new Promise(r => setTimeout(r, 900));
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
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-primary"
      >
        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-border flex items-center justify-between bg-canvas/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-semantic-successTint text-semantic-successText border border-semantic-success/30 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-semantic-success" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display text-primary">
                Issue Emergency Freeze Requisition
              </h3>
              <p className="text-xs text-secondary font-mono">
                Statutory Notice under Section 106 BNSS 2023 · Target: {vaspName}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-muted hover:text-primary hover:bg-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {sentSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-semantic-successTint text-semantic-success border-2 border-semantic-success flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-semantic-success" />
              </div>
              <h4 className="text-lg font-bold text-primary font-display">
                Notice Dispatched to {vaspName} Nodal Desk
              </h4>
              <p className="text-xs text-secondary max-w-md mx-auto">
                Freeze requisition successfully logged in ChainShield Audit Registry and forwarded to compliance. Expected SLA: 24h.
              </p>
            </div>
          ) : (
            <>
              {/* Target Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-subtle/70 border border-border text-xs">
                <div>
                  <span className="text-[10px] text-muted block font-bold uppercase font-mono">Recipient Exchange</span>
                  <span className="font-bold text-semantic-successText flex items-center gap-1.5 mt-0.5">
                    <Landmark className="w-3.5 h-3.5" /> {vaspName} (FIU-IND Registered)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted block font-bold uppercase font-mono">Attributed Amount</span>
                  <span className="font-mono font-bold text-primary text-sm mt-0.5 block">
                    {formatUSD(amountUsd)} <span className="text-xs text-muted font-normal">({formatINR(amountUsd * 83.5, true)})</span>
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-border">
                  <span className="text-[10px] text-muted block font-bold uppercase font-mono">Suspect Deposit Address</span>
                  <span className="font-mono text-brand-indigo font-bold break-all">{depositAddress}</span>
                </div>
              </div>

              {/* Editable Legal Letter in Paper Container */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-secondary flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-indigo" /> Formal Statutory Notice Text (Editable)
                  </label>
                  <span className="text-[10px] text-semantic-warningText font-mono font-bold">TEMPLATE — Section 106 BNSS</span>
                </div>
                <textarea
                  rows={9}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-canvas border border-border font-mono text-xs text-primary focus:outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 leading-relaxed resize-none transition-all"
                />
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!sentSuccess && (
          <div className="p-4 px-6 border-t border-border bg-canvas/70 flex items-center justify-between">
            <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-brand-indigo" /> Signed by IO Rajan Sharma (MH-CY-8841)
            </span>

            <div className="flex items-center gap-2.5">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="success"
                loading={sending}
                onClick={handleSendFreeze}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                {sending ? 'Dispatching...' : 'Dispatch Freeze Notice'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
