'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, Bell, Search, Sparkles, User, Terminal, ChevronDown, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const Topbar: React.FC = () => {
  const { user, demoModeOpen, setDemoModeOpen, setCmdPaletteOpen, unreadAlertsCount } = useAppStore();

  return (
    <header className="h-16 px-6 border-b border-white/10 glass-panel flex items-center justify-between z-30 sticky top-0">
      {/* Left: Agency info & live system status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-xs shadow-glow-cyan">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-slate-200 uppercase font-sans">
                State Cyber Crime Cell
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-mono">
                I4C / FIU-IND Gateway
              </span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/5 text-xs text-slate-300 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-400">Ledgers:</span>
          <span className="text-emerald-400 font-mono font-semibold">6 Chains Synced</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">FIU Status:</span>
          <span className="text-cyan-400 font-semibold">Operational</span>
        </div>
      </div>

      {/* Right: Quick Command Search, Demo Mode, Alerts, User Profile */}
      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={() => setCmdPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/40 text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Search wallets, cases, VASPs...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            Ctrl+K
          </kbd>
        </button>

        {/* Demo Mode Button */}
        <button
          onClick={() => setDemoModeOpen(!demoModeOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            demoModeOpen
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-glow-cyan'
              : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/60'
          }`}
          title="Toggle YouTube Recording Director (Ctrl+Shift+D)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Demo Director</span>
        </button>

        {/* Demo Data Chip */}
        <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
          DEMO DATA
        </span>

        {/* Alerts Bell */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-colors"
          title="Real-Time Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px]">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-cyan-300">
              {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'IO'}
            </div>
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-200 leading-tight">
              {user?.name || 'IO Rajan Sharma'}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {user?.badge_no || 'MH-CY-8841'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
