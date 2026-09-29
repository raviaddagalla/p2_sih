'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Play, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { cmdPaletteOpen, setCmdPaletteOpen } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(!cmdPaletteOpen);
      }
      if (e.key === 'Escape' && cmdPaletteOpen) {
        setCmdPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cmdPaletteOpen, setCmdPaletteOpen]);

  if (!cmdPaletteOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    setCmdPaletteOpen(false);
  };

  const executeHeadline = async () => {
    try {
      const res = await api.simulateComplaint(1);
      router.push(`/trace/${res.job_id}`);
      setCmdPaletteOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl glass-panel-elevated border border-cyan-400/40 shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search cases, wallets, VASPs..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider">
            Quick Actions
          </div>

          <button
            onClick={executeHeadline}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-300 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">Execute Headline Showcase (TRON → Binance Trace)</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">1-Click</span>
          </button>

          <button
            onClick={() => navigateTo('/ingest')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Ingest New Victim Wallet / CSV</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500 font-bold tracking-wider mt-2">
            Navigation
          </div>

          <button
            onClick={() => navigateTo('/dashboard')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <span>Command Center Dashboard</span>
            <span className="text-[10px] text-slate-500 font-mono">/dashboard</span>
          </button>

          <button
            onClick={() => navigateTo('/freeze-requests')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <span>Freeze Request Kanban (Section 106 BNSS)</span>
            <span className="text-[10px] text-slate-500 font-mono">/freeze-requests</span>
          </button>

          <button
            onClick={() => navigateTo('/vasps')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <span>FIU-IND Registered VASP Directory</span>
            <span className="text-[10px] text-slate-500 font-mono">/vasps</span>
          </button>

          <button
            onClick={() => navigateTo('/analytics')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <span>LEA Crime Typologies & Recovery Funnel</span>
            <span className="text-[10px] text-slate-500 font-mono">/analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};
