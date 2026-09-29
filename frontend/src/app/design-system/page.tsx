'use client';

import React, { useState } from 'react';
import { 
  Palette, Shield, Lock, Download, CheckCircle2, AlertTriangle, ArrowRight, 
  Sparkles, Eye, Copy, Sliders, Layers, FileText, Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { RiskGauge } from '@/components/ui/RiskGauge';
import { RiskBadge } from '@/components/common/RiskBadge';
import { ChainBadge } from '@/components/common/ChainBadge';
import { AddressChip } from '@/components/common/AddressChip';

export default function DesignSystemPage() {
  const [gaugeValue, setGaugeValue] = useState(88);
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigoTint text-brand-indigo text-xs font-bold font-mono uppercase mb-2">
            <Palette className="w-3.5 h-3.5" /> Bright Intelligence v2.0
          </div>
          <h1 className="text-3xl font-black font-display tracking-tight text-primary">
            ChainShield Design System & UI Specification
          </h1>
          <p className="text-sm text-secondary mt-1 max-w-2xl">
            A bright, institutional light design language built for Indian Law Enforcement, Courtroom submissions, and high-clarity forensic blockchain visualization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={<Copy className="w-4 h-4" />}>
            Export Tokens JSON
          </Button>
          <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
            Verified WCAG AA
          </Button>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-indigo" />
          <h2 className="text-lg font-bold font-display text-primary">1. Surface & Neutral Tokens</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-xl border border-border bg-[#F6F8FC] space-y-2">
            <div className="font-bold text-primary">--bg-canvas</div>
            <div className="font-mono text-muted">#F6F8FC</div>
            <div className="text-[10px] text-secondary">App background canvas</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-white space-y-2 shadow-xs">
            <div className="font-bold text-primary">--bg-surface</div>
            <div className="font-mono text-muted">#FFFFFF</div>
            <div className="text-[10px] text-secondary">Cards & modal surfaces</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-[#EEF2F9] space-y-2">
            <div className="font-bold text-primary">--bg-subtle</div>
            <div className="font-mono text-muted">#EEF2F9</div>
            <div className="text-[10px] text-secondary">Table headers & chips</div>
          </div>
          <div className="p-4 rounded-xl border border-border bg-[#0F172A] text-white space-y-2">
            <div className="font-bold">--bg-inverse</div>
            <div className="font-mono text-slate-400">#0F172A</div>
            <div className="text-[10px] text-slate-300">Tooltips & contrast pills</div>
          </div>
          <div className="p-4 rounded-xl border-2 border-[#CBD5E6] bg-white space-y-2">
            <div className="font-bold text-primary">--border</div>
            <div className="font-mono text-muted">#E3E8F2 / #CBD5E6</div>
            <div className="text-[10px] text-secondary">Crisp 1px card borders</div>
          </div>
        </div>
      </section>

      {/* 2. Vivid Brand & Semantic Accents */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-primary">2. Vivid Accents & Semantic Statuses</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#EEF0FF] border border-[#C7D2FE] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#4F46E5]" />
            <div className="font-bold text-[#4F46E5]">Indigo</div>
            <div className="font-mono text-[10px] text-muted">#4F46E5</div>
          </div>
          <div className="p-3 rounded-xl bg-[#E0F7FB] border border-[#A5F3FC] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#06B6D4]" />
            <div className="font-bold text-[#06B6D4]">Cyan</div>
            <div className="font-mono text-[10px] text-muted">#06B6D4</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F1EBFF] border border-[#DDD6FE] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#8B5CF6]" />
            <div className="font-bold text-[#8B5CF6]">Violet</div>
            <div className="font-mono text-[10px] text-muted">#8B5CF6</div>
          </div>
          <div className="p-3 rounded-xl bg-[#FDE8F3] border border-[#FBCFE8] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#EC4899]" />
            <div className="font-bold text-[#EC4899]">Pink</div>
            <div className="font-mono text-[10px] text-muted">#EC4899</div>
          </div>
          <div className="p-3 rounded-xl bg-[#DDF7EC] border border-[#86EFAC] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#10B981]" />
            <div className="font-bold text-[#047857]">Success</div>
            <div className="font-mono text-[10px] text-[#047857]">#10B981</div>
          </div>
          <div className="p-3 rounded-xl bg-[#FEF1D6] border border-[#FCD34D] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#F59E0B]" />
            <div className="font-bold text-[#B45309]">Warning</div>
            <div className="font-mono text-[10px] text-[#B45309]">#F59E0B</div>
          </div>
          <div className="p-3 rounded-xl bg-[#FFE9DA] border border-[#FDBA74] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#F97316]" />
            <div className="font-bold text-[#C2410C]">High Risk</div>
            <div className="font-mono text-[10px] text-[#C2410C]">#F97316</div>
          </div>
          <div className="p-3 rounded-xl bg-[#FDE4E4] border border-[#FCA5A5] space-y-1">
            <div className="w-5 h-5 rounded-full bg-[#EF4444]" />
            <div className="font-bold text-[#B91C1C]">Critical</div>
            <div className="font-mono text-[10px] text-[#B91C1C]">#EF4444</div>
          </div>
        </div>
      </section>

      {/* 3. Button Component Hierarchy */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-primary">3. Button Variants & Micro-Interactions</h2>
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs flex flex-wrap items-center gap-3">
          <Button variant="primary" icon={<Shield className="w-4 h-4" />}>
            Primary Indigo
          </Button>
          <Button variant="gradient" icon={<Sparkles className="w-4 h-4" />}>
            Gradient Action
          </Button>
          <Button variant="secondary">
            Secondary Outline
          </Button>
          <Button variant="soft">
            Soft Tinted
          </Button>
          <Button variant="success" icon={<CheckCircle2 className="w-4 h-4" />}>
            Success Action
          </Button>
          <Button variant="danger" icon={<AlertTriangle className="w-4 h-4" />}>
            Critical Freeze
          </Button>
          <Button variant="ghost">
            Ghost Action
          </Button>
          <Button 
            variant="primary" 
            loading={btnLoading} 
            onClick={() => {
              setBtnLoading(true);
              setTimeout(() => setBtnLoading(false), 1500);
            }}
          >
            {btnLoading ? 'Tracing Multi-Hop...' : 'Click to Test Loading'}
          </Button>
        </div>
      </section>

      {/* 4. Badges, Chips & Encodings */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-primary">4. Badges, Chips & Dual Encodings</h2>
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-muted font-mono">Risk Status Pills (WCAG AA Contrast)</div>
            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge category="LOW" score={12} />
              <RiskBadge category="MEDIUM" score={45} />
              <RiskBadge category="HIGH" score={74} />
              <RiskBadge category="CRITICAL" score={94} />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs font-bold uppercase text-muted font-mono">Blockchain Network Badges</div>
            <div className="flex flex-wrap items-center gap-3">
              <ChainBadge chain="TRON" />
              <ChainBadge chain="BTC" />
              <ChainBadge chain="ETH" />
              <ChainBadge chain="BSC" />
              <ChainBadge chain="POLYGON" />
              <ChainBadge chain="SOL" />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs font-bold uppercase text-muted font-mono">Monospace Address Chips with Micro-Copy</div>
            <div className="flex flex-wrap items-center gap-4">
              <AddressChip address="TJb1xV9uKjT887qZk4R4b9a1M8d2E3f4" chain="TRON" showExplorer={true} />
              <AddressChip address="0x71C8364724A32585b736b48430aD96f73cA793e2" chain="ETH" showExplorer={true} />
              <AddressChip address="bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" chain="BTC" showExplorer={true} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. KPI Cards Showcase */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-primary">5. KPI Card Tints & Hero Gradient</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Hero Funds Flagged (₹)"
            value="₹318.4 Cr"
            subvalue="Indexed across 6 chains"
            tint="hero"
            icon={<Shield className="w-5 h-5 text-white" />}
            delta={{ value: "+28.4%", isPositive: true }}
            sparklineData={[30, 45, 60, 50, 75, 90, 110]}
          />
          <KpiCard
            label="Attributed to VASPs"
            value="₹122.9 Cr"
            subvalue="94.2% recovery probability"
            tint="emerald"
            icon={<CheckCircle2 className="w-5 h-5 text-semantic-success" />}
            delta={{ value: "+14.1%", isPositive: true }}
            sparklineData={[20, 30, 40, 60, 70, 85, 95]}
          />
          <KpiCard
            label="Sec 106 Freeze Notices"
            value="98 Pending"
            subvalue="SLA avg 2.4 hrs to freeze"
            tint="cyan"
            icon={<Lock className="w-5 h-5 text-brand-cyan" />}
            delta={{ value: "4 ready", isPositive: true }}
            sparklineData={[10, 15, 20, 25, 22, 28, 32]}
          />
          <KpiCard
            label="Avg Attribution Speed"
            value="6.4s"
            subvalue="97% faster than manual"
            tint="violet"
            icon={<Sparkles className="w-5 h-5 text-brand-violet" />}
            delta={{ value: "-45%", isPositive: true }}
            sparklineData={[90, 80, 70, 50, 30, 20, 12]}
          />
        </div>
      </section>

      {/* 6. Semicircle Risk Gauge */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-display text-primary">6. Semicircle Risk Gauge & Needle</h2>
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center p-4">
            <RiskGauge score={gaugeValue} size={220} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary">Interactive Score Controller</h3>
            <p className="text-xs text-secondary">
              Drag the slider below to test the animated needle trajectory and gradient arc response across risk bands.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold text-primary">
                <span>Test Score:</span>
                <span>{gaugeValue} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gaugeValue}
                onChange={(e) => setGaugeValue(Number(e.target.value))}
                className="w-full h-2 bg-subtle rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>
            <div className="flex gap-2">
              {[15, 45, 75, 95].map(score => (
                <button
                  key={score}
                  onClick={() => setGaugeValue(score)}
                  className="px-3 py-1 rounded-lg border border-border text-xs font-mono font-bold hover:bg-subtle text-secondary"
                >
                  Set {score}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
