'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, Bell, Search, Sparkles, User, ChevronRight, Globe, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const ROUTE_TITLES: Record<string, { parent: string; title: string }> = {
  '/dashboard': { parent: 'Investigate', title: 'Command Center' },
  '/ingest': { parent: 'Investigate', title: 'Ingestion Hub' },
  '/trace': { parent: 'Investigate', title: 'Live Trace Workspace' },
  '/cases': { parent: 'Coordinate', title: 'Case Management' },
  '/freeze-requests': { parent: 'Coordinate', title: 'Section 106 Freeze Requests' },
  '/vasps': { parent: 'Coordinate', title: 'FIU-IND VASP Directory' },
  '/alerts': { parent: 'Insights', title: 'Real-Time Alerts & Watchlist' },
  '/analytics': { parent: 'Insights', title: 'LEA Crime Analytics' },
  '/reports': { parent: 'Insights', title: 'Court Dossier Generator' },
  '/admin': { parent: 'System', title: 'Admin & Forensic Audit Logs' },
  '/design-system': { parent: 'System', title: 'Design System & Tokens' },
};

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const { user, demoModeOpen, setDemoModeOpen, setCmdPaletteOpen, unreadAlertsCount } = useAppStore();
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  // Find matching route breadcrumb
  let routeMeta = { parent: 'Platform', title: 'Overview' };
  for (const [key, val] of Object.entries(ROUTE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + '/')) {
      routeMeta = val;
      break;
    }
  }

  return (
    <header className="h-16 px-6 border-b border-border bg-surface flex items-center justify-between z-30 sticky top-0">
      {/* Left: Breadcrumbs + Page Title */}
      <div className="flex items-center gap-3">
        <nav className="flex items-center gap-1.5 text-xs text-muted">
          <span className="font-medium hover:text-primary transition-colors">
            {routeMeta.parent}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-muted/60" />
          <span className="font-bold text-primary font-display">
            {routeMeta.title}
          </span>
        </nav>
      </div>

      {/* Center: Wide Search Field with ⌘K */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={() => setCmdPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-subtle/80 hover:bg-subtle border border-border hover:border-brand-indigo/40 text-muted hover:text-primary text-xs transition-all shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-muted" />
            <span>Search wallets, case IDs, VASPs, or typologies...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-surface text-[10px] font-mono text-muted border border-border shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live Network Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-semantic-successTint border border-semantic-success/30 text-xs font-semibold text-semantic-successText">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-semantic-success" />
          </span>
          <span>6 Chains Synced</span>
          <span className="text-semantic-success/40">|</span>
          <span className="font-mono">FIU-IND Online</span>
        </div>

        {/* Bilingual EN / हिन्दी Scaffolding Toggle */}
        <button
          onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-subtle text-xs font-semibold text-secondary hover:text-primary transition-colors"
          title="Switch language (EN / हिन्दी)"
        >
          <Globe className="w-3.5 h-3.5 text-brand-indigo" />
          <span className="font-mono text-[11px]">{lang}</span>
        </button>

        {/* Demo Director Button */}
        <button
          onClick={() => setDemoModeOpen(!demoModeOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
            demoModeOpen
              ? 'bg-brand-indigo text-white border-brand-indigo shadow-md shadow-brand-indigo/25'
              : 'bg-brand-indigoTint text-brand-indigo border-brand-indigo/30 hover:bg-brand-indigo/15'
          }`}
          title="Toggle YouTube Recording Director (Ctrl+Shift+D)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Demo Director</span>
        </button>

        {/* Notification Bell */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-xl border border-border bg-surface hover:bg-subtle text-secondary hover:text-primary transition-colors shadow-sm"
          title="Real-Time Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-semantic-danger text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-brand-indigo flex items-center justify-center text-xs font-bold text-white shadow-sm">
            {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'IO'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-bold text-primary leading-tight">
              {user?.name || 'IO Rajan Sharma'}
            </div>
            <div className="text-[10px] text-muted font-mono">
              {user?.badge_no || 'MH-CY-8841'} · {user?.role || 'IO'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
