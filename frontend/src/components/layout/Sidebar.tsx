'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  LayoutDashboard, 
  ArrowDownToLine, 
  GitBranch, 
  Briefcase, 
  Snowflake, 
  Building2, 
  ShieldAlert, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette,
  Sparkles,
  Search
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'INVESTIGATE',
    items: [
      { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Ingestion Hub', href: '/ingest', icon: ArrowDownToLine, badge: 'Live' },
      { label: 'Live Tracing', href: '/trace/demo', icon: GitBranch, badge: 'Hero' },
    ]
  },
  {
    title: 'COORDINATE',
    items: [
      { label: 'Case Files', href: '/cases', icon: Briefcase, badge: '250' },
      { label: 'Freeze Requests', href: '/freeze-requests', icon: Snowflake, badge: 'Sec 106' },
      { label: 'VASP Directory', href: '/vasps', icon: Building2, badge: 'FIU-IND' },
    ]
  },
  {
    title: 'INSIGHTS',
    items: [
      { label: 'Alerts & Watchlist', href: '/alerts', icon: ShieldAlert },
      { label: 'LEA Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Court Reports', href: '/reports', icon: FileText, badge: 'PDF' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Design System', href: '/design-system', icon: Palette, badge: 'Tokens' },
      { label: 'Admin & Audit', href: '/admin', icon: Settings },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAppStore();

  return (
    <aside 
      className={`border-r border-border bg-surface flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-all duration-300 z-20 ${
        collapsed ? 'w-[72px]' : 'w-[264px]'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-violet to-brand-pink flex items-center justify-center shadow-md shadow-brand-indigo/20 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-primary font-display">
                    Chain<span className="text-brand-indigo">Shield</span>
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-indigoTint text-brand-indigo uppercase font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-muted font-medium truncate">
                  Real-Time Crypto Attribution
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-subtle text-muted hover:text-primary transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Grouped Navigation */}
        <div className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-170px)]">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed ? (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                  {section.title}
                </div>
              ) : (
                <div className="h-px bg-border my-2 mx-2" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`relative flex items-center ${
                      collapsed ? 'justify-center px-0' : 'justify-between px-3'
                    } py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-brand-indigoTint text-brand-indigo font-bold'
                        : 'text-secondary hover:text-primary hover:bg-subtle'
                    }`}
                  >
                    {/* Active Accent Bar on Left */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-indigo rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-brand-indigo' : 'text-muted group-hover:text-primary'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        isActive
                          ? 'bg-brand-indigo text-white'
                          : 'bg-subtle text-muted border border-border'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom LEA Agency Footer */}
      <div className="p-3 border-t border-border bg-subtle/50">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-surface border border-border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-indigoTint border border-brand-indigo/30 flex items-center justify-center text-xs font-bold text-brand-indigo shrink-0">
                {user?.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'IO'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-primary truncate leading-tight">
                  {user?.name || 'IO Rajan Sharma'}
                </div>
                <div className="text-[10px] text-muted font-mono truncate">
                  MH Cyber Crime Cell
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-semantic-warningTint text-semantic-warningText border border-semantic-warning/20 shrink-0">
              DEMO
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-full bg-brand-indigoTint border border-brand-indigo/30 flex items-center justify-center text-xs font-bold text-brand-indigo">
              IO
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
