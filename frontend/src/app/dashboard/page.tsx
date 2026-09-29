'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, GitBranch, Landmark, IndianRupee, Clock, Lock, Sparkles, 
  ArrowUpRight, PlusCircle, AlertCircle, CheckCircle2, ChevronRight, Activity, MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { api } from '@/lib/api';
import { formatINR, formatUSD, formatIST, truncateAddress } from '@/lib/formatters';
import { RiskBadge } from '@/components/common/RiskBadge';
import { ChainBadge } from '@/components/common/ChainBadge';

export default function DashboardPage() {
  const router = useRouter();

  const [metrics, setMetrics] = useState({
    active_cases: 250,
    wallets_traced_today: 34,
    vasps_identified: 12,
    funds_flagged_inr: 3184444000.0,
    funds_frozen_usd: 10913909.57,
    freeze_requests_pending: 98,
    avg_time_to_attribution_seconds: 6.4,
    recovery_rate_pct: 38.6
  });

  const [cases, setCases] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [typologies, setTypologies] = useState<any[]>([]);
  const [stateHeatmap, setStateHeatmap] = useState<any[]>([]);
  const [vaspBars, setVaspBars] = useState<any[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [selectedState, setSelectedState] = useState<any | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [overviewRes, casesRes, alertsRes, typRes, stateRes, vaspRes] = await Promise.all([
          api.getAnalyticsOverview(),
          api.getCases({ limit: 6 }),
          api.getAlerts(),
          api.getTypologies(),
          api.getStateHeatmap(),
          api.getVaspHeatmap()
        ]);

        if (overviewRes) setMetrics(overviewRes);
        if (casesRes) setCases(casesRes);
        if (alertsRes) setAlerts(alertsRes);
        if (typRes) setTypologies(typRes);
        if (stateRes) {
          setStateHeatmap(stateRes);
          setSelectedState(stateRes[0]);
        }
        if (vaspRes) setVaspBars(vaspRes);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }

    loadDashboard();
  }, []);

  const triggerSimulateComplaint = async () => {
    setSimulating(true);
    try {
      const res = await api.simulateComplaint(1);
      // Prepend new alert
      setAlerts(prev => [
        {
          id: `live-${Date.now()}`,
          severity: 'CRITICAL',
          title: `New NCRP Inflow Alert: ₹42.5 L Task Fraud`,
          body: `Suspect TRON wallet TJb1xV9u... reported. Trace job queued.`,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
      // Navigate to trace screen
      router.push(`/trace/${res.job_id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Top Banner with Simulated Complaint Demo Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel-elevated border border-cyan-400/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
              National Cyber Crime Reporting Portal (NCRP) Active Feed
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-0.5">
            Command Center · Inter-Agency Forensic Dashboard
          </h2>
        </div>

        <button
          onClick={triggerSimulateComplaint}
          disabled={simulating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-glow-cyan transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>{simulating ? 'Ingesting Live Feed...' : 'Simulate Incoming NCRP Complaint'}</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Cases</span>
            <AlertCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.active_cases}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">15 Indian States</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Traced Today</span>
            <GitBranch className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.wallets_traced_today}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">+18% vs yesterday</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>VASPs Attributed</span>
            <Landmark className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.vasps_identified}
          </div>
          <div className="text-[10px] text-yellow-400 font-mono">FIU-IND Verified</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Funds Flagged</span>
            <IndianRupee className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatINR(metrics.funds_flagged_inr, true)}
          </div>
          <div className="text-[10px] text-rose-400 font-mono">Tainted crypto outflow</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Freeze Requisitions</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.freeze_requests_pending}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">Section 106 BNSS</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Attribution</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {metrics.avg_time_to_attribution_seconds}s
          </div>
          <div className="text-[10px] text-purple-400 font-mono">vs 72h manual tracing</div>
        </div>
      </div>

      {/* Main Grid: Heatmap + Alerts + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: India Geography Heatmap & Fraud Typologies */}
        <div className="lg:col-span-2 space-y-6">
          {/* India LEA Geographic Heatmap */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  India LEA State Distribution Heatmap
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time fraud concentration across 15 State Cyber Cells
                </p>
              </div>

              {selectedState && (
                <div className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
                  <span className="text-cyan-400 font-bold">{selectedState.state}: </span>
                  <span className="text-white font-bold">{selectedState.case_count} Cases </span>
                  <span className="text-slate-400">({formatINR(selectedState.loss_inr, true)})</span>
                </div>
              )}
            </div>

            {/* Interactive State Cards Bar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {stateHeatmap.slice(0, 10).map((st) => {
                const isSelected = selectedState?.state === st.state;
                return (
                  <button
                    key={st.state}
                    onClick={() => setSelectedState(st)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400/60 shadow-glow-cyan'
                        : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{st.state}</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </div>
                    <div className="text-base font-black text-white font-mono mt-1">
                      {st.case_count}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatINR(st.loss_inr, true)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typology Chart & Top VASPs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Typology Breakdown */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Crime Typology Distribution
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typologies}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {typologies.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0B1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {typologies.map((t) => (
                  <div key={t.type} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: t.color }} />
                    <span className="text-slate-300 truncate">{t.name}</span>
                    <span className="font-mono font-bold text-white ml-auto">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recipient VASPs */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Exchanges Receiving Fraud Outflows
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vaspBars} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="vasp" type="category" stroke="#94A3B8" fontSize={11} width={65} />
                    <RechartsTooltip
                      formatter={(val: any) => [`$${val.toLocaleString()}`, 'Total Outflow']}
                      contentStyle={{ backgroundColor: '#0B1120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar dataKey="total_usd" fill="#22D3EE" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
                <span>Compliance Coordination:</span>
                <span className="text-emerald-400 font-mono font-semibold">100% FIU-IND Responsive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Live Alerts Feed Rail */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Live Alerts Stream
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono font-bold">
              Real-Time
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px] pr-1">
            {alerts.map((a, idx) => (
              <div
                key={a.id || idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5 hover:border-cyan-400/30 transition-all text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    a.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                    a.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatIST(a.created_at)}
                  </span>
                </div>

                <div className="font-bold text-white">{a.title}</div>
                <p className="text-[11px] text-slate-300/90 leading-relaxed">{a.body}</p>

                {a.job_id && (
                  <Link
                    href={`/trace/${a.job_id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 pt-1"
                  >
                    <span>Inspect Fund Trace</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Traces Table */}
      <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Cryptocurrency Attribution Cases
            </h3>
            <p className="text-xs text-slate-400">
              Latest suspect addresses submitted by State Cyber Crime Cells
            </p>
          </div>
          <Link
            href="/cases"
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>View All 250 Cases</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono">
                <th className="pb-2.5">Case Reference</th>
                <th className="pb-2.5">Crime Typology</th>
                <th className="pb-2.5">Suspect Address</th>
                <th className="pb-2.5">Network</th>
                <th className="pb-2.5">Quantified Loss (INR)</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {cases.map((c) => {
                const rep = c.reported_wallets?.[0];
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-cyan-300">
                      {c.case_no}
                    </td>
                    <td className="py-3 font-medium text-slate-200">
                      {c.fraud_type.replace('_', ' ')}
                    </td>
                    <td className="py-3 font-mono text-slate-300">
                      {rep ? truncateAddress(rep.address, 6, 6) : 'TJb1xV9u...'}
                    </td>
                    <td className="py-3">
                      <ChainBadge chain={rep?.chain || 'TRON'} size="sm" />
                    </td>
                    <td className="py-3 font-mono font-bold text-white">
                      {formatINR(c.victim_loss_inr)}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        c.status === 'TRACED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        c.status === 'FROZEN' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10"
                      >
                        <span>Investigate</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
