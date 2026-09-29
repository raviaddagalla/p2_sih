'use client';

import React from 'react';
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
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard, badge: null },
  { label: 'Ingestion Hub', href: '/ingest', icon: ArrowDownToLine, badge: 'Live' },
  { label: 'Live Tracing', href: '/trace/demo', icon: GitBranch, badge: 'Hero' },
  { label: 'Case Management', href: '/cases', icon: Briefcase, badge: '250' },
  { label: 'Freeze Requests', href: '/freeze-requests', icon: Snowflake, badge: 'Sec 106' },
  { label: 'VASP Directory', href: '/vasps', icon: Building2, badge: 'FIU' },
  { label: 'Alerts & Watchlist', href: '/alerts', icon: ShieldAlert, badge: null },
  { label: 'LEA Analytics', href: '/analytics', icon: BarChart3, badge: null },
  { label: 'Court Reports', href: '/reports', icon: FileText, badge: 'PDF' },
  { label: 'Admin & Audit', href: '/admin', icon: Settings, badge: null },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 glass-panel flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Logo */}
      <div>
        <div className="p-6 pb-4 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6 text-black fill-black/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-white font-sans">
                  CHAIN<span className="text-cyan-400">SHIELD</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight">
                Real-Time Crypto Fraud Attribution
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/40 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isActive
                      ? 'bg-cyan-400 text-black'
                      : 'bg-slate-800/80 text-slate-400 border border-white/5'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom LEA Trust Banner */}
      <div className="p-4 border-t border-white/10 m-3 rounded-xl bg-slate-950/60 border border-cyan-500/15">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wide">
            Indian LEA Intelligence
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Standardized under Section 106 BNSS 2023 for cyber cell rapid asset freeze protocols.
        </p>
      </div>
    </aside>
  );
};
