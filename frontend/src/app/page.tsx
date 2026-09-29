'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Lock, Mail, KeyRound, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('io@demo.gov.in');
  const [password, setPassword] = useState('Demo@1234');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: 'user-io-01',
        name: 'IO Rajan Sharma',
        email: email,
        role: 'IO',
        badge_no: 'MH-CY-2024-8841',
        agency_id: 'agency-mh-01'
      });
      router.push('/dashboard');
    }, 500);
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@1234');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#070B14] text-white overflow-hidden relative">
      {/* Left Column: Cinematic Visual & Stats */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative border-r border-white/10 cyber-grid-bg">
        {/* Top Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan">
            <Shield className="w-7 h-7 text-black fill-black/20" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider">
              CHAIN<span className="text-cyan-400">SHIELD</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Real-Time Crypto Fraud Attribution Platform
            </p>
          </div>
        </div>

        {/* Center Tagline & Graphic */}
        <div className="z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Indian Law Enforcement Agencies</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            From victim complaint to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">exchange freeze request</span> in seconds.
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed">
            Automating cross-chain tracing across TRON, Bitcoin, and EVM networks. Direct integration with FIU-IND registered VASPs under Section 106 BNSS 2023.
          </p>

          {/* 3 Key Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">₹ 318 Cr+</div>
              <div className="text-xs text-slate-400">Fraud Flagged</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">6.4s</div>
              <div className="text-xs text-slate-400">Avg Attribution</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white font-mono">15 States</div>
              <div className="text-xs text-slate-400">Cyber Cells Live</div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="z-10 text-xs text-slate-500 font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Compliant with MHA I4C Standard Operating Procedures (SOP)</span>
        </div>
      </div>

      {/* Right Column: Glass Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel-elevated border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
              {step === 'credentials' ? 'LEA Officer Login' : 'MFA Identity Verification'}
            </h3>
            <p className="text-xs text-slate-400">
              {step === 'credentials' 
                ? 'Access restricted to authorized cyber crime personnel'
                : 'Enter the 6-digit cryptographic security code'}
            </p>
          </div>

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
                    placeholder="officer@demo.gov.in"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-400 font-sans"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm tracking-wide shadow-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Proceed to MFA'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Accounts Chips */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Demo Accounts:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('io@demo.gov.in')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-cyan-300 font-mono text-[11px] transition-colors"
                  >
                    io@demo.gov.in (IO)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('supervisor@demo.gov.in')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 font-mono text-[11px] transition-colors"
                  >
                    supervisor@demo.gov.in (SP)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('nodal@demo.gov.in')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 font-mono text-[11px] transition-colors"
                  >
                    nodal@demo.gov.in (I4C)
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-11 h-12 text-center rounded-xl bg-slate-950/80 border border-cyan-400/50 text-xl font-mono font-bold text-cyan-400 focus:outline-none focus:border-cyan-300 shadow-glow-cyan"
                  />
                ))}
              </div>

              <div className="text-center text-xs text-slate-400">
                <span>Demo Code: </span>
                <strong className="text-cyan-300 font-mono">123456</strong>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-sm tracking-wide shadow-glow-emerald transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{loading ? 'Verifying...' : 'Verify & Enter Command Center'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
