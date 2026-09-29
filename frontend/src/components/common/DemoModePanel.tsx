'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, FastForward, Compass, Zap, Shield, Sparkles, X, Activity } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';

export const DemoModePanel: React.FC = () => {
  const router = useRouter();
  const {
    demoModeOpen,
    setDemoModeOpen,
    playbackSpeed,
    setPlaybackSpeed,
    guidedTourActive,
    setGuidedTourActive
  } = useAppStore();

  // Keyboard shortcut Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDemoModeOpen(!demoModeOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoModeOpen, setDemoModeOpen]);

  if (!demoModeOpen) return null;

  const playHeadlineScenario = async () => {
    try {
      const res = await api.simulateComplaint(1);
      // Navigate to trace workspace
      router.push(`/trace/${res.job_id}`);
      setDemoModeOpen(false);
    } catch (err) {
      console.error('Failed to trigger headline scenario:', err);
    }
  };

  const playScenario = async (scenId: number) => {
    try {
      const res = await api.simulateComplaint(scenId);
      router.push(`/trace/${res.job_id}`);
      setDemoModeOpen(false);
    } catch (err) {
      console.error(`Failed to trigger scenario ${scenId}:`, err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 p-5 rounded-2xl glass-panel-elevated border border-cyan-400/40 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Demo & Showcase Director</h4>
            <p className="text-[11px] text-cyan-300/80">Press Ctrl+Shift+D to toggle</p>
          </div>
        </div>
        <button
          onClick={() => setDemoModeOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main 1-Click Action */}
      <div className="mt-4">
        <button
          onClick={playHeadlineScenario}
          className="w-full group relative flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all duration-200"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>1-CLICK HEADLINE DEMO</span>
          <span className="text-[10px] bg-black/20 text-black px-2 py-0.5 rounded-full font-mono">
            TRON → Binance
          </span>
        </button>
      </div>

      {/* Speed Controls */}
      <div className="mt-4 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <FastForward className="w-3.5 h-3.5 text-cyan-400" /> Trace Speed:
        </span>
        <div className="flex items-center gap-1">
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => setPlaybackSpeed(s)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                playbackSpeed === s
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white bg-slate-800/50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Curated Scenarios Grid */}
      <div className="mt-4">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Select Showcase Scenario:
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => playScenario(1)}
            className="p-2 text-left rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-400/30 transition-all"
          >
            <div className="font-bold text-cyan-300">1. Task Scam</div>
            <div className="text-[10px] text-slate-400">TRON USDT → Binance</div>
          </button>
          <button
            onClick={() => playScenario(2)}
            className="p-2 text-left rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-400/30 transition-all"
          >
            <div className="font-bold text-amber-300">2. Peel Chain</div>
            <div className="text-[10px] text-slate-400">BTC → CoinDCX/ZebPay</div>
          </button>
          <button
            onClick={() => playScenario(3)}
            className="p-2 text-left rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-400/30 transition-all"
          >
            <div className="font-bold text-blue-300">3. Cross-Chain</div>
            <div className="text-[10px] text-slate-400">ETH → BSC → Bybit</div>
          </button>
          <button
            onClick={() => playScenario(4)}
            className="p-2 text-left rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-400/30 transition-all"
          >
            <div className="font-bold text-purple-300">4. Tornado Mixer</div>
            <div className="text-[10px] text-slate-400">Sanctioned Pool Touch</div>
          </button>
        </div>
      </div>

      {/* Guided Tour Trigger */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <button
          onClick={() => {
            setGuidedTourActive(true);
            setDemoModeOpen(false);
          }}
          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
        >
          <Compass className="w-4 h-4" /> Start Interactive Guided Tour
        </button>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Deterministic Engine
        </span>
      </div>
    </div>
  );
};
