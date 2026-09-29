'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Play, FastForward, Compass, Zap, Shield, Sparkles, X, Activity, 
  Video, Eye, Subtitles, Layers, ChevronRight, Check
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

const SCRIPTED_SCENES = [
  { id: 1, name: 'Login & Ingest', desc: 'Officer 2FA & NCRP complaint ingestion' },
  { id: 2, name: 'Live Multi-Hop Trace', desc: 'Deterministic TRON traversal & clustering' },
  { id: 3, name: 'VASP Identification', desc: 'Binance deposit hit with 94.2% confidence' },
  { id: 4, name: 'Section 106 Freeze', desc: 'Statutory emergency requisition notice' },
  { id: 5, name: 'Court Evidence PDF', desc: 'Judicial dossier compilation & export' },
];

export const DemoModePanel: React.FC = () => {
  const router = useRouter();
  const {
    demoModeOpen,
    setDemoModeOpen,
    playbackSpeed,
    setPlaybackSpeed,
    recordingMode,
    setRecordingMode,
    spotlightEnabled,
    setSpotlightEnabled,
    captionText,
    setCaptionText,
    currentScene,
    setCurrentScene
  } = useAppStore();

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);

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

  // Track cursor position for spotlight & click ripple
  useEffect(() => {
    if (!spotlightEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      setClickRipple({ x: e.clientX, y: e.clientY });
      setTimeout(() => setClickRipple(null), 600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [spotlightEnabled]);

  // Recording mode class on body
  useEffect(() => {
    if (recordingMode) {
      document.body.classList.add('recording-mode');
    } else {
      document.body.classList.remove('recording-mode');
    }
  }, [recordingMode]);

  const playHeadlineScenario = async () => {
    try {
      setCurrentScene(2);
      setCaptionText('Simulating NCRP Complaint: ₹42.5 L Task Fraud on TRON Blockchain...');
      const res = await api.simulateComplaint(1);
      setTimeout(() => {
        setCaptionText('Hop 4: Binance Custodial Hot Wallet Matched — 94.2% Confidence');
      }, 3500);
      router.push(`/trace/${res.job_id}`);
      setDemoModeOpen(false);
    } catch (err) {
      console.error('Failed to trigger headline scenario:', err);
    }
  };

  const playScenario = async (scenId: number) => {
    try {
      setCurrentScene(2);
      const res = await api.simulateComplaint(scenId);
      router.push(`/trace/${res.job_id}`);
      setDemoModeOpen(false);
    } catch (err) {
      console.error(`Failed to trigger scenario ${scenId}:`, err);
    }
  };

  return (
    <>
      {/* 1. Cursor Spotlight & Click Ripple */}
      {spotlightEnabled && (
        <div
          className="cursor-spotlight pointer-events-none"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        />
      )}

      {clickRipple && (
        <div
          className="pointer-events-none fixed z-50 w-8 h-8 rounded-full border-2 border-brand-indigo animate-ping"
          style={{
            left: `${clickRipple.x - 16}px`,
            top: `${clickRipple.y - 16}px`,
          }}
        />
      )}

      {/* 2. Scripted Scenes Demo Progress Timeline (Visible during presentation) */}
      {recordingMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-surface/95 border-b border-border shadow-xs backdrop-blur-md px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-semantic-danger animate-pulse" />
            <span className="text-xs font-black font-mono uppercase text-primary">
              RECORDING SESSION
            </span>
          </div>

          <div className="flex items-center gap-3">
            {SCRIPTED_SCENES.map((scene) => {
              const isPast = scene.id <= currentScene;
              const isCurrent = scene.id === currentScene;
              return (
                <div key={scene.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    isCurrent ? 'bg-brand-indigo text-white ring-2 ring-brand-indigo/30' :
                    isPast ? 'bg-semantic-success text-white' : 'bg-subtle text-muted'
                  }`}>
                    {scene.id}
                  </span>
                  <span className={`font-semibold hidden sm:inline ${
                    isCurrent ? 'text-brand-indigo' : isPast ? 'text-primary' : 'text-muted'
                  }`}>
                    {scene.name}
                  </span>
                  {scene.id < 5 && <ChevronRight className="w-3.5 h-3.5 text-muted" />}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setRecordingMode(false)}
            className="text-[10px] font-mono text-muted hover:text-primary px-2 py-0.5 rounded border border-border"
          >
            Exit Recording Mode
          </button>
        </div>
      )}

      {/* 3. Step Narration Caption Bar at Bottom */}
      {captionText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl px-6 py-3 rounded-2xl bg-primary text-white shadow-xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-5 h-5 text-brand-cyan shrink-0" />
          <span className="text-xs font-semibold leading-snug">{captionText}</span>
          <button 
            onClick={() => setCaptionText(null)} 
            className="ml-auto text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. Floating Demo Director Controller Window */}
      {demoModeOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 rounded-2xl bg-surface border border-border-strong shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200 text-primary">
          {/* Header */}
          <div className="p-4 px-5 bg-gradient-to-r from-brand-indigo to-brand-violet text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-white" />
              <div>
                <h4 className="text-sm font-bold font-display">Demo & Showcase Director</h4>
                <p className="text-[10px] text-white/80 font-mono">Press Ctrl+Shift+D to hide</p>
              </div>
            </div>
            <button
              onClick={() => setDemoModeOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* 1-Click Headline Showcase Button */}
            <Button
              variant="gradient"
              size="lg"
              onClick={playHeadlineScenario}
              icon={<Play className="w-4 h-4 fill-white" />}
              className="w-full justify-center shadow-md shadow-brand-indigo/25 text-xs font-bold"
            >
              1-CLICK HEADLINE DEMO (TRON → Binance)
            </Button>

            {/* Recording Controls Strip */}
            <div className="p-3 rounded-xl bg-subtle/70 border border-border space-y-2 text-xs">
              <div className="font-bold text-primary flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-brand-indigo" />
                  Recording Mode (1080p YouTube)
                </span>
                <input
                  type="checkbox"
                  checked={recordingMode}
                  onChange={(e) => setRecordingMode(e.target.checked)}
                  className="rounded text-brand-indigo focus:ring-brand-indigo"
                />
              </div>
              <p className="text-[11px] text-secondary leading-snug">
                Hides debug chips, shows scene timeline, locks standard 16:9 safe area.
              </p>
            </div>

            {/* Spotlight Toggle */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-subtle/70 border border-border text-xs">
              <span className="flex items-center gap-1.5 font-bold text-primary">
                <Eye className="w-4 h-4 text-brand-cyan" />
                Cursor Spotlight & Click Ripple
              </span>
              <input
                type="checkbox"
                checked={spotlightEnabled}
                onChange={(e) => setSpotlightEnabled(e.target.checked)}
                className="rounded text-brand-indigo focus:ring-brand-indigo"
              />
            </div>

            {/* Playback Speed Controller */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-subtle/70 border border-border text-xs">
              <span className="font-bold text-primary flex items-center gap-1.5">
                <FastForward className="w-4 h-4 text-brand-indigo" /> Traversal Speed:
              </span>
              <div className="flex items-center gap-1">
                {[0.5, 1.0, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      playbackSpeed === s
                        ? 'bg-brand-indigo text-white shadow-xs'
                        : 'bg-surface text-secondary hover:text-primary border border-border'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Curated Showcase Scenarios */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-muted uppercase font-mono tracking-wider">
                Select Showcase Scenario:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => playScenario(1)}
                  className="p-2.5 text-left rounded-xl bg-subtle/50 hover:bg-brand-indigoTint border border-border hover:border-brand-indigo/40 transition-all space-y-1"
                >
                  <div className="font-bold text-brand-indigo">1. Task Scam</div>
                  <div className="text-[10px] text-muted font-mono">TRON USDT → Binance</div>
                </button>
                <button
                  onClick={() => playScenario(2)}
                  className="p-2.5 text-left rounded-xl bg-subtle/50 hover:bg-brand-indigoTint border border-border hover:border-brand-indigo/40 transition-all space-y-1"
                >
                  <div className="font-bold text-semantic-warningText">2. Peel Chain</div>
                  <div className="text-[10px] text-muted font-mono">BTC → CoinDCX/ZebPay</div>
                </button>
                <button
                  onClick={() => playScenario(3)}
                  className="p-2.5 text-left rounded-xl bg-subtle/50 hover:bg-brand-indigoTint border border-border hover:border-brand-indigo/40 transition-all space-y-1"
                >
                  <div className="font-bold text-brand-cyan">3. Cross-Chain</div>
                  <div className="text-[10px] text-muted font-mono">ETH → BSC → Bybit</div>
                </button>
                <button
                  onClick={() => playScenario(4)}
                  className="p-2.5 text-left rounded-xl bg-subtle/50 hover:bg-brand-indigoTint border border-border hover:border-brand-indigo/40 transition-all space-y-1"
                >
                  <div className="font-bold text-brand-violet">4. Tornado Mixer</div>
                  <div className="text-[10px] text-muted font-mono">Sanctioned Pool Touch</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
