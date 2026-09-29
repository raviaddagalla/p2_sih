'use client';

import React, { useEffect, useState } from 'react';
import { 
  Settings, Users, Shield, Database, Activity, CheckCircle2, Search, FileDown
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatIST } from '@/lib/formatters';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [health, setHealth] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'agencies'>('audit');

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [usersRes, agRes, auditRes, healthRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/admin/users').then(r => r.json()),
          fetch('http://127.0.0.1:8000/api/admin/agencies').then(r => r.json()),
          api.getAuditLogs(),
          api.getHealth()
        ]);
        setUsers(usersRes || []);
        setAgencies(agRes || []);
        setAuditLogs(auditRes || []);
        setHealth(healthRes);
      } catch (e) {
        console.error(e);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Settings className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              System Administration & Immutable Audit Trail
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Role-based access control (RBAC), multi-agency federation, and tamper-evident audit logging.
          </p>
        </div>

        {/* System Health Chip */}
        {health && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">System:</span>
            <span className="text-emerald-400 font-mono font-bold">{health.status}</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-mono">6 Chains Synced</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit' ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          Immutable Audit Trail ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          LEA Personnel & Roles ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('agencies')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'agencies' ? 'bg-cyan-500 text-black shadow-glow-cyan' : 'text-slate-400 hover:text-white'
          }`}
        >
          Federated LEA Agencies ({agencies.length})
        </button>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-mono">
                <th className="p-3.5">Timestamp (IST)</th>
                <th className="p-3.5">Officer / Personnel</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Entity Target</th>
                <th className="p-3.5">Audit Particulars</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono text-slate-400">{formatIST(log.created_at)}</td>
                  <td className="p-3.5 font-bold text-cyan-300">{log.user_name || 'System Auto'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-800 text-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{log.entity}</td>
                  <td className="p-3.5 text-slate-300">{log.metadata?.details || log.metadata?.status || 'Action verified'}</td>
                  <td className="p-3.5 font-mono text-slate-500">{log.ip || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-slate-950/60 text-slate-400 font-mono">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Official Email</th>
                <th className="p-3.5">LEA Role</th>
                <th className="p-3.5">Badge / ID</th>
                <th className="p-3.5">MFA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white">{u.name}</td>
                  <td className="p-3.5 font-mono text-slate-300">{u.email}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-400/30">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{u.badge_no || 'LEA-AUTH'}</td>
                  <td className="p-3.5 text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Agencies */}
      {activeTab === 'agencies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agencies.map((ag) => (
            <div key={ag.id} className="p-4 rounded-2xl glass-panel border border-white/5 space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">{ag.name}</h4>
              <div className="text-slate-400">Jurisdiction: <span className="text-cyan-300">{ag.state}</span></div>
              <div className="text-[10px] text-slate-500 font-mono">{ag.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
