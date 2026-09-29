'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, IndianRupee, Download, ShieldCheck, 
  Clock, Zap, ArrowRight, CheckCircle2, ChevronRight, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { api } from '@/lib/api';
import { formatINR, formatUSD } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const [typologies, setTypologies] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [vaspHeatmap, setVaspHeatmap] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('YTD 2024');

  useEffect(() => {
    async function loadData() {
      try {
        const [typRes, funnelRes, vaspRes] = await Promise.all([
          api.getTypologies(),
          api.getRecoveryFunnel(),
          api.getVaspHeatmap()
        ]);
        if (typRes) setTypologies(typRes);
        if (funnelRes) setFunnel(funnelRes);
        if (vaspRes) setVaspHeatmap(vaspRes);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              MACRO FORENSIC INTELLIGENCE
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Law Enforcement Crime Analytics
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Cryptocurrency fraud trends, asset recovery funnels, and attribution speed efficiency benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-medium text-secondary">
            <Calendar className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Range: {timeRange}</span>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => window.open('http://127.0.0.1:8000/api/reports/default/download', '_blank')}
            icon={<Download className="w-4 h-4 text-brand-indigo" />}
          >
            Export Dossier
          </Button>
        </div>
      </div>

      {/* Speed & Recovery Highlight Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-pink text-white shadow-md shadow-brand-indigo/15 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <div className="text-xs font-bold font-mono uppercase text-white/80">Automated Forensic Attribution</div>
          <div className="text-3xl font-black font-display text-white">97% Faster</div>
          <div className="text-xs text-white/80">Average attribution time: 6.4s vs 72h manual tracing.</div>
        </div>

        <div className="space-y-1 md:border-l md:border-white/20 md:pl-6">
          <div className="text-xs font-bold font-mono uppercase text-white/80">Cumulative Asset Recovery Rate</div>
          <div className="text-3xl font-black font-display text-white">38.6%</div>
          <div className="text-xs text-white/80">₹122.9 Cr secured before fiat off-ramp.</div>
        </div>

        <div className="space-y-1 md:border-l md:border-white/20 md:pl-6">
          <div className="text-xs font-bold font-mono uppercase text-white/80">FIU-IND Requisition Compliance</div>
          <div className="text-3xl font-black font-display text-white">100%</div>
          <div className="text-xs text-white/80">Under Section 106 BNSS 2023 statutory mandate.</div>
        </div>
      </div>

      {/* Grid: Recovery Funnel + Crime Typology Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Funnel */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-primary font-display uppercase tracking-wider">
              Asset Recovery Lifecycle Funnel
            </h3>
            <span className="text-xs font-mono font-bold text-semantic-successText">
              Sec 106 Execution
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {funnel.map((item, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-subtle/50 border border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">{item.stage}</span>
                  <span className="font-mono font-bold text-brand-indigo">{formatUSD(item.usd_value)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-brand-indigo rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(12, 100 - idx * 22)}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted flex justify-between font-mono">
                  <span>{item.case_count} Cases Processed</span>
                  <span>Conversion: {Math.max(25, 100 - idx * 20)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top VASPs Receiving Fraud Funds */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-primary font-display uppercase tracking-wider">
              Top Exchanges by Outflow Volume
            </h3>
            <span className="text-xs font-mono font-bold text-muted">
              Cumulative USD
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vaspHeatmap} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EEF7" vertical={false} />
                <XAxis dataKey="vasp" stroke="#46536B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#46536B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Outflow']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E8F2', borderRadius: '12px', boxShadow: '0 4px 16px rgba(15,23,42,0.08)' }}
                />
                <Bar dataKey="total_usd" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-secondary leading-relaxed pt-2 border-t border-border">
            Binance, CoinDCX, and WazirX represent over 78% of all identified custodial endpoints for Indian victim crypto complaints.
          </p>
        </div>
      </div>
    </div>
  );
}
