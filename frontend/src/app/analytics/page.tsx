'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, IndianRupee, Download, ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { api } from '@/lib/api';
import { formatINR, formatUSD } from '@/lib/formatters';

export default function AnalyticsPage() {
  const [typologies, setTypologies] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [vaspHeatmap, setVaspHeatmap] = useState<any[]>([]);

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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Law Enforcement Intelligence & Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Macro analysis of cryptocurrency fraud trends, recovery funnels, and VASP compliance SLA metrics.
          </p>
        </div>

        <button
          onClick={() => window.open('http://127.0.0.1:8000/api/reports/default/download', '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Recovery Funnel Card */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Asset Recovery & Freeze Funnel (INR ₹)
          </h3>
          <p className="text-xs text-slate-400">
            Conversion rate from victim complaint reporting to successful custodial exchange freeze
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {funnel.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-slate-300 font-semibold">{item.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white">{formatINR(item.amount_inr, true)}</span>
                  <span className="font-mono text-cyan-400 font-bold text-[11px] w-12 text-right">
                    {item.pct}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Typology Matrix & VASP Crime Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VASP Heatmap Matrix Table */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            VASP × Fraud Typology Incident Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-2">Exchange</th>
                  <th className="pb-2">Task Scam</th>
                  <th className="pb-2">Investment</th>
                  <th className="pb-2">Phishing</th>
                  <th className="pb-2">Ransomware</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vaspHeatmap.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-cyan-300 font-sans">{v.vasp}</td>
                    <td className="py-2.5 text-white">{v.task_scam}</td>
                    <td className="py-2.5 text-white">{v.investment}</td>
                    <td className="py-2.5 text-white">{v.phishing}</td>
                    <td className="py-2.5 text-rose-400 font-bold">{v.ransomware}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crime Typology Distribution Breakdown */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Economic Impact by Crime Typology
          </h3>
          <div className="space-y-3">
            {typologies.map((t) => (
              <div key={t.type} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-md" style={{ backgroundColor: t.color }} />
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-400">{t.count} Reported Cases</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-cyan-300">{formatINR(t.loss_inr, true)}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Total Quantified</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
