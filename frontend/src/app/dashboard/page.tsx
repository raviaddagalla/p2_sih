'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, GitBranch, Landmark, IndianRupee, Clock, Lock, Sparkles, 
  ArrowUpRight, PlusCircle, AlertCircle, CheckCircle2, ChevronRight, Activity, 
  MapPin, ShieldCheck, Zap, TrendingUp, Users, ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import { api } from '@/lib/api';
import { formatINR, formatUSD, formatIST, truncateAddress } from '@/lib/formatters';
import { RiskBadge } from '@/components/common/RiskBadge';
import { ChainBadge } from '@/components/common/ChainBadge';
import { AddressChip } from '@/components/common/AddressChip';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';

const TIME_SERIES_CASES = [
  { month: 'Jan', cases: 28, amount: 24.5 },
  { month: 'Feb', cases: 42, amount: 38.2 },
  { month: 'Mar', cases: 58, amount: 51.0 },
  { month: 'Apr', cases: 85, amount: 76.4 },
  { month: 'May', cases: 120, amount: 112.8 },
  { month: 'Jun', cases: 165, amount: 184.2 },
  { month: 'Jul', cases: 210, amount: 245.0 },
  { month: 'Aug', cases: 250, amount: 318.4 },
];

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
      setAlerts(prev => [
        {
          id: `live-${Date.now()}`,
          severity: 'CRITICAL',
          title: `New NCRP Inflow Alert: ₹42.5 L Task Fraud`,
          body: `Suspect TRON wallet TJb1xV9u... reported. Trace job queued.`,
          created_at: new Date().toISOString(),
          job_id: res.job_id
        },
        ...prev
      ]);
      router.push(`/trace/${res.job_id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  // Helper monogram avatar
  const getMonogram = (name: string) => {
    return name
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-primary">
      {/* Top Header / Agency Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-surface border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-semantic-success animate-pulse" />
            <span className="text-xs font-bold text-semantic-successText font-mono uppercase tracking-wider">
              NCRP Live Gateway Active · Section 106 BNSS Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Command Center · Multi-Agency Attribution Dashboard
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Inter-state cryptographic intelligence, automated VASP requisition generation, and asset freeze tracking.
          </p>
        </div>

        <Button
          variant="gradient"
          size="lg"
          loading={simulating}
          onClick={triggerSimulateComplaint}
          icon={<Sparkles className="w-4 h-4" />}
          className="shrink-0"
        >
          {simulating ? 'Ingesting NCRP Complaint...' : 'Simulate NCRP Complaint'}
        </Button>
      </div>

      {/* Hero Card + 6 Distinctly Tinted KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {/* HERO CARD (Spans 2 columns on large displays) */}
        <div className="sm:col-span-2 xl:col-span-2">
          <KpiCard
            label="Total Funds Flagged"
            value={formatINR(metrics.funds_flagged_inr, true)}
            subvalue="Tainted crypto indexed across 6 ledgers"
            tint="hero"
            icon={<IndianRupee className="w-5 h-5 text-white" />}
            delta={{ value: "+28.4% MoM", isPositive: true }}
            sparklineData={[24, 38, 51, 76, 112, 184, 245, 318]}
          />
        </div>

        {/* 1. Active Cases (Indigo tint) */}
        <KpiCard
          label="Active Cases"
          value={metrics.active_cases}
          subvalue="15 State Cyber Cells"
          tint="indigo"
          icon={<AlertCircle className="w-5 h-5 text-brand-indigo" />}
          delta={{ value: "+12 new", isPositive: true }}
        />

        {/* 2. Wallets Traced (Cyan tint) */}
        <KpiCard
          label="Wallets Traced Today"
          value={metrics.wallets_traced_today}
          subvalue="TRON, BTC, ETH, BSC"
          tint="cyan"
          icon={<GitBranch className="w-5 h-5 text-brand-cyan" />}
          delta={{ value: "+18%", isPositive: true }}
        />

        {/* 3. VASPs Attributed (Emerald tint) */}
        <KpiCard
          label="VASPs Identified"
          value={metrics.vasps_identified}
          subvalue="100% FIU-IND Registered"
          tint="emerald"
          icon={<Landmark className="w-5 h-5 text-semantic-success" />}
          delta={{ value: "100%", isPositive: true }}
        />

        {/* 4. Freeze Requests (Amber tint) */}
        <KpiCard
          label="Sec 106 Freezes"
          value={metrics.freeze_requests_pending}
          subvalue="Requisitions Issued"
          tint="amber"
          icon={<Lock className="w-5 h-5 text-semantic-warning" />}
          delta={{ value: "4 ready", isPositive: true }}
        />

        {/* 5. Avg Attribution Speed (Violet tint) */}
        <KpiCard
          label="Attribution Speed"
          value={`${metrics.avg_time_to_attribution_seconds}s`}
          subvalue="vs 72h manual tracing"
          tint="violet"
          icon={<Clock className="w-5 h-5 text-brand-violet" />}
          delta={{ value: "97% faster", isPositive: true }}
        />
      </div>

      {/* Row 2: Cases Over Time + Typology Donut + Top VASPs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases Over Time Area Chart */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
                Attribution Volume Over Time
              </h3>
              <p className="text-xs text-secondary">
                Cumulative cases and funds flagged (₹ Cr)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-indigoTint text-brand-indigo">
              2024 YTD
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SERIES_CASES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="caseAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EEF7" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-xl bg-surface border border-border shadow-md text-xs font-sans">
                          <div className="font-bold text-primary">{label} 2024</div>
                          <div className="text-brand-indigo font-semibold">{payload[0].value} Cases</div>
                          <div className="text-secondary font-mono text-[11px]">₹{payload[0].payload.amount} Cr Flagged</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="#4F46E5" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#caseAreaGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Typology Donut Chart */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
                Crime Typology Distribution
              </h3>
              <p className="text-xs text-secondary">
                Breakdown of 250 investigated fraud complaints
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-primary">
              250 Cases
            </span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typologies}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {typologies.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 rounded-xl bg-surface border border-border shadow-md text-xs">
                          <div className="font-bold" style={{ color: data.color }}>{data.name}</div>
                          <div className="text-primary font-mono">{data.count} Cases ({data.pct}%)</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {typologies.slice(0, 4).map((t) => (
              <div key={t.type} className="flex items-center gap-1.5 p-1 rounded-md bg-subtle/50">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-secondary truncate text-[11px] font-medium">{t.name}</span>
                <span className="font-mono font-bold text-primary ml-auto text-[11px]">{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top VASPs Receiving Outflows */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
                Top Exchanges Receiving Outflow
              </h3>
              <p className="text-xs text-secondary">
                Direct deposit destinations identified
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-semantic-successText">
              FIU Registered
            </span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vaspBars} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="vasp" type="category" stroke="#46536B" fontSize={11} width={80} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Outflow']}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-xl bg-surface border border-border shadow-md text-xs">
                          <div className="font-bold text-primary">{payload[0].payload.vasp}</div>
                          <div className="text-brand-indigo font-mono font-bold">${payload[0].value?.toLocaleString()}</div>
                          <div className="text-muted text-[10px]">{payload[0].payload.cases} Linked Cases</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total_usd" fill="#4F46E5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-secondary">
            <span>SOP Section 106 Compliance:</span>
            <span className="font-semibold text-semantic-successText font-mono">100% FIU Responsive</span>
          </div>
        </div>
      </div>

      {/* Row 3: India LEA State Heatmap + Live Alerts Feed Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: India State Heatmap */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-indigo" />
                <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
                  India State Cyber Cell Concentration
                </h3>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Active jurisdictional caseload distribution across 15 Indian state police directorates.
              </p>
            </div>

            {selectedState && (
              <div className="px-3.5 py-1.5 rounded-xl bg-brand-indigoTint border border-brand-indigo/30 text-xs font-mono">
                <span className="text-brand-indigo font-bold">{selectedState.state}: </span>
                <span className="text-primary font-bold">{selectedState.case_count} Cases </span>
                <span className="text-muted font-medium">({formatINR(selectedState.loss_inr, true)})</span>
              </div>
            )}
          </div>

          {/* Interactive State Cards Bar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stateHeatmap.slice(0, 10).map((st) => {
              const isSelected = selectedState?.state === st.state;
              return (
                <button
                  key={st.state}
                  onClick={() => setSelectedState(st)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-brand-indigoTint border-brand-indigo shadow-sm ring-2 ring-brand-indigo/15'
                      : 'bg-subtle/50 border-border hover:bg-subtle hover:border-border-strong'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary truncate">{st.state}</span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-brand-indigo' : 'bg-muted/40'}`} />
                  </div>
                  <div className="text-lg font-black text-primary font-display mt-1">
                    {st.case_count}
                  </div>
                  <div className="text-[11px] text-muted font-mono font-medium truncate">
                    {formatINR(st.loss_inr, true)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-subtle/60 border border-border flex items-center justify-between text-xs text-secondary">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-indigo" />
              Highest Volume: Maharashtra (64 Cases, ₹82.4 Cr) · Karnataka (42 Cases, ₹54.1 Cr)
            </span>
            <Link href="/analytics" className="text-brand-indigo font-bold hover:underline flex items-center gap-1">
              <span>Full Heatmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Col 3: Live Alerts Feed Rail */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-pink" />
              <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
                Live Alerts Stream
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-semantic-dangerTint text-semantic-dangerText border border-semantic-danger/20 animate-pulse">
              Real-Time
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
            {alerts.map((a, idx) => {
              const isCritical = a.severity === 'CRITICAL';
              const isHigh = a.severity === 'HIGH';
              return (
                <div
                  key={a.id || idx}
                  className="p-3.5 rounded-xl border border-border bg-subtle/40 hover:bg-surface hover:shadow-xs transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                      isCritical
                        ? 'bg-semantic-dangerTint text-semantic-dangerText border border-semantic-danger/20'
                        : isHigh
                        ? 'bg-semantic-highTint text-semantic-highText border border-semantic-high/20'
                        : 'bg-brand-indigoTint text-brand-indigo border border-brand-indigo/20'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-[10px] text-muted font-mono">
                      {formatIST(a.created_at)}
                    </span>
                  </div>

                  <div className="font-bold text-primary">{a.title}</div>
                  <p className="text-[11px] text-secondary leading-relaxed">{a.body}</p>

                  {a.job_id && (
                    <Link
                      href={`/trace/${a.job_id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-indigo hover:text-brand-indigoHover pt-1"
                    >
                      <span>Inspect Live Graph Trace</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Attribution Cases Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-primary font-display uppercase tracking-wider">
              Recent Cryptocurrency Attribution Cases
            </h3>
            <p className="text-xs text-secondary">
              Latest suspect inflow addresses submitted by State Cyber Crime Cells
            </p>
          </div>
          <Link
            href="/cases"
            className="flex items-center gap-1 text-xs font-bold text-brand-indigo hover:text-brand-indigoHover"
          >
            <span>View All 250 Cases</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-subtle/50 text-secondary font-mono text-[11px]">
                <th className="py-2.5 px-3 rounded-l-lg">Case Reference</th>
                <th className="py-2.5 px-3">Crime Typology</th>
                <th className="py-2.5 px-3">Suspect Address</th>
                <th className="py-2.5 px-3">Network</th>
                <th className="py-2.5 px-3">Quantified Loss</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-sans">
              {cases.map((c) => {
                const rep = c.reported_wallets?.[0];
                return (
                  <tr key={c.id} className="hover:bg-subtle/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-brand-indigo">
                      {c.case_no}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-primary">{c.fraud_type}</span>
                    </td>
                    <td className="py-3 px-3">
                      {rep ? (
                        <AddressChip address={rep.address} chain={rep.chain} lead={6} tail={4} />
                      ) : (
                        <span className="text-muted font-mono">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {rep && <ChainBadge chain={rep.chain} size="sm" />}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {formatINR(c.amount_inr, true)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        c.status === 'FROZEN' ? 'bg-semantic-successTint text-semantic-successText' :
                        c.status === 'TRACED' ? 'bg-brand-indigoTint text-brand-indigo' :
                        'bg-semantic-warningTint text-semantic-warningText'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-brand-indigoTint hover:text-brand-indigo font-semibold text-secondary transition-all"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
