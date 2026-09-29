'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Lock, Mail, KeyRound, Sparkles, CheckCircle2, ArrowRight, 
  ShieldCheck, Zap, User, Clock, Check
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';

interface DemoAccount {
  name: string;
  role: string;
  email: string;
  badge: string;
  agency: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: 'IO Rajan Sharma',
    role: 'Investigating Officer',
    email: 'io.sharma@mahapolice.gov.in',
    badge: 'MH-CY-8841',
    agency: 'State Cyber Cell, Mumbai'
  },
  {
    name: 'SP Neha Verma',
    role: 'Superintendent of Police',
    email: 'sp.verma@delhipolice.gov.in',
    badge: 'DL-CY-1002',
    agency: 'Special Cell (IFSO), New Delhi'
  },
  {
    name: 'Inspector Anand Rao',
    role: 'Cyber Cell Lead',
    email: 'anand.rao@ksp.gov.in',
    badge: 'KA-CY-4920',
    agency: 'CID Cyber Crime, Bengaluru'
  }
];

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('io.sharma@mahapolice.gov.in');
  const [password, setPassword] = useState('Demo@1234');
  const [selectedAccount, setSelectedAccount] = useState<DemoAccount>(DEMO_ACCOUNTS[0]);
  const [otp, setOtp] = useState(['5', '8', '2', '9', '4', '1']);
  const [loading, setLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Drifting Light Network Graph for Left Panel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodeColors = ['#FFFFFF', '#EEF0FF', '#E0F7FB', '#FDE8F3'];
    const nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 3 + 2.5,
      color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.28 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 450);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSuccess(true);
      setUser({
        id: 'user-01',
        name: selectedAccount.name,
        email: selectedAccount.email,
        role: 'IO',
        badge_no: selectedAccount.badge,
        agency_id: selectedAccount.agency
      });
      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    }, 600);
  };

  const selectDemoAccount = (acc: DemoAccount) => {
    setSelectedAccount(acc);
    setEmail(acc.email);
    setPassword('Demo@1234');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-canvas text-primary">
      {/* Left Column (60%): Vivid Gradient Mesh & Animated Network Graph */}
      <div className="relative flex-1 lg:flex-[1.4] bg-gradient-to-br from-[#4F46E5] via-[#8B5CF6] to-[#EC4899] p-8 lg:p-14 flex flex-col justify-between overflow-hidden text-white select-none">
        {/* Animated Network Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Ambient subtle glow overlay */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-pink-400/20 blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shadow-black/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight font-display text-white">
                  ChainShield
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/25 text-white uppercase border border-white/30">
                  LEA v2.0
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Real-Time Crypto Fraud Attribution & Asset Freeze Platform
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs text-white backdrop-blur-md font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>FIU-IND & Section 106 BNSS Ready</span>
          </div>
        </div>

        {/* Center Punchy Headline & Mission Statement */}
        <div className="relative z-10 my-12 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Forensic speed for cyber cell investigators</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
            From victim complaint to exchange freeze request in seconds.
          </h2>

          <p className="text-sm lg:text-base text-white/90 leading-relaxed font-sans">
            Automating multi-hop blockchain tracing across TRON, Bitcoin, Ethereum, and EVM chains. Instant VASP deposit clustering with Section 106 BNSS requisition notices.
          </p>
        </div>

        {/* Floating Stat Cards Strip */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Attribution Confidence
            </div>
            <div className="text-2xl font-black font-display text-white">
              94.2%
            </div>
            <div className="text-[10px] text-white/70">
              Deterministic VASP matching
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
              <Clock className="w-4 h-4 text-cyan-300" />
              Time-to-Attribution
            </div>
            <div className="text-2xl font-black font-display text-white">
              &lt; 8.0s
            </div>
            <div className="text-[10px] text-white/70">
              Multi-hop sweep resolution
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-lg space-y-1">
            <div className="flex items-center gap-2 text-white/80 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-pink-200" />
              Custodial Recovery
            </div>
            <div className="text-2xl font-black font-display text-white">
              ₹122.9 Cr
            </div>
            <div className="text-[10px] text-white/70">
              Frozen at FIU exchanges
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (40%): Clean White Login Card */}
      <div className="flex-1 lg:flex-[1.0] bg-surface flex flex-col justify-between p-8 lg:p-14 border-l border-border">
        {/* Top Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              OFFICIAL LEA PORTAL ACCESS
            </span>
          </div>

          <h3 className="text-2xl lg:text-3xl font-black font-display text-primary tracking-tight">
            {step === 'credentials' ? 'Officer Authentication' : 'Two-Factor OTP Verification'}
          </h3>

          <p className="text-xs text-secondary">
            {step === 'credentials' 
              ? 'Authorized for State Cyber Crime Cells, CID, IFSO, and Central Investigative Agencies.'
              : `Enter the 6-digit OTP sent to verified terminal (${email}).`}
          </p>
        </div>

        {/* Step 1: Credentials Form */}
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="my-8 space-y-5">
            {/* Quick Demo Account Selector Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary uppercase font-mono tracking-wide">
                Quick Autofill Demo Officer:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.map((acc, idx) => {
                  const isSelected = selectedAccount.email === acc.email;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectDemoAccount(acc)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-brand-indigo bg-brand-indigoTint shadow-xs'
                          : 'border-border bg-surface hover:bg-subtle'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-brand-indigo text-white' : 'bg-subtle text-secondary'
                        }`}>
                          {acc.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-primary truncate">
                            {acc.name}
                          </div>
                          <div className="text-[10px] text-muted truncate">
                            {acc.role} · {acc.badge}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-brand-indigo shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary">
                Official Government Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-subtle/40 focus:bg-surface focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 outline-none text-xs text-primary font-medium transition-all"
                  placeholder="name@agency.gov.in"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary">
                Cryptographic Access Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-border bg-subtle/40 focus:bg-surface focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 outline-none text-xs text-primary font-medium transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to OTP Verification
            </Button>
          </form>
        ) : (
          /* Step 2: 6-Digit Polished OTP Form */
          <form onSubmit={handleOtpSubmit} className="my-8 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-secondary uppercase font-mono tracking-wide">
                Terminal Security Code (6 Digits):
              </label>

              <div className="flex items-center justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    autoFocus={idx === 0}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 border-border focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/15 outline-none bg-surface text-primary shadow-xs transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-brand-indigoTint border border-brand-indigo/20 flex items-center justify-between text-xs text-brand-indigo font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-indigo" />
                Demo 2FA OTP Pre-filled
              </span>
              <span className="font-mono text-[11px] underline cursor-pointer" onClick={() => setOtp(['5', '8', '2', '9', '4', '1'])}>
                Reset OTP
              </span>
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                variant={otpSuccess ? 'success' : 'primary'}
                size="lg"
                loading={loading}
                className="w-full justify-center text-sm font-bold"
                icon={otpSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              >
                {otpSuccess ? 'Access Granted · Opening Workspace...' : 'Authorize Terminal Session'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setStep('credentials')}
                className="w-full justify-center text-xs text-secondary"
              >
                ← Back to Credentials
              </Button>
            </div>
          </form>
        )}

        {/* Footer Note */}
        <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted font-mono">
          <span>Simulation Engine · 250 Cases</span>
          <span className="px-2 py-0.5 rounded bg-semantic-warningTint text-semantic-warningText border border-semantic-warning/20 font-bold">
            DEMO DATA ONLY
          </span>
        </div>
      </div>
    </div>
  );
}
