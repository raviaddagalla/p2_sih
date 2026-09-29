'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Zap, ArrowRight, Briefcase, Snowflake, Building2, BarChart3, Palette, Shield } from 'lucide-react';
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
    <div 
      onClick={() => setCmdPaletteOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl bg-surface border border-border-strong shadow-2xl overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border gap-3 bg-canvas/60">
          <Search className="w-5 h-5 text-brand-indigo" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to case, wallet, VASP..."
            className="w-full bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 rounded bg-surface text-[10px] font-mono text-muted border border-border shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-muted font-bold tracking-wider">
            Quick Actions
          </div>

          <button
            onClick={executeHeadline}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-primary hover:bg-brand-indigoTint hover:text-brand-indigo transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-indigo" />
              <span className="font-bold">Execute Headline Showcase (TRON → Binance Trace)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-brand-indigo text-white font-mono font-bold">
              1-Click
            </span>
          </button>

          <button
            onClick={() => navigateTo('/ingest')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-primary hover:bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-semantic-warning" />
              <span className="font-medium">Ingest New Victim Wallet / NCRP Batch CSV</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted" />
          </button>

          <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-muted font-bold tracking-wider mt-2">
            Navigation
          </div>

          <button
            onClick={() => navigateTo('/dashboard')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-secondary hover:text-primary hover:bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-muted" />
              <span>Command Center Dashboard</span>
            </div>
            <span className="text-[10px] text-muted font-mono">/dashboard</span>
          </button>

          <button
            onClick={() => navigateTo('/freeze-requests')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-secondary hover:text-primary hover:bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              <Snowflake className="w-3.5 h-3.5 text-muted" />
              <span>Freeze Request Kanban (Section 106 BNSS)</span>
            </div>
            <span className="text-[10px] text-muted font-mono">/freeze-requests</span>
          </button>

          <button
            onClick={() => navigateTo('/vasps')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-secondary hover:text-primary hover:bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-muted" />
              <span>FIU-IND Registered VASP Directory</span>
            </div>
            <span className="text-[10px] text-muted font-mono">/vasps</span>
          </button>

          <button
            onClick={() => navigateTo('/analytics')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-secondary hover:text-primary hover:bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-muted" />
              <span>LEA Crime Typologies & Recovery Funnel</span>
            </div>
            <span className="text-[10px] text-muted font-mono">/analytics</span>
          </button>

          <button
            onClick={() => navigateTo('/design-system')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-secondary hover:text-primary hover:bg-subtle transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Design System & Token Showcase</span>
            </div>
            <span className="text-[10px] text-muted font-mono">/design-system</span>
          </button>
        </div>
      </div>
    </div>
  );
};
