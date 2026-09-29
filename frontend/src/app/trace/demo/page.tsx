'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function TraceDemoRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function initHeadline() {
      try {
        const res = await api.simulateComplaint(1);
        router.replace(`/trace/${res.job_id}`);
      } catch (e) {
        // Fallback to static job id
        router.replace('/trace/headline-task-scam');
      }
    }
    initHeadline();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 text-slate-400 font-mono text-xs">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      <p>Initializing ChainShield Forensic Live Workspace...</p>
    </div>
  );
}
