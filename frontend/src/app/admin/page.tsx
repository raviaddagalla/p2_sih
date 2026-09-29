'use client';

import React, { useEffect, useState } from 'react';
import { 
  Settings, Users, Shield, Database, Activity, CheckCircle2, Search, FileDown,
  Building, UserCheck, Lock, ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatIST } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

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
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              SYSTEM & GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-black font-display text-primary mt-1">
            Forensic Administration & Audit Trail
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Role-based access control (RBAC), multi-agency federation, and tamper-evident forensic audit logs.
          </p>
        </div>

        {health && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-semantic-successTint border border-semantic-success/30 text-xs text-semantic-successText font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
            <span>FastAPI: {health.status} · SQLite / PG Synced</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-secondary hover:text-primary hover:bg-subtle'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Forensic Audit Trail ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-secondary hover:text-primary hover:bg-subtle'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Authorized Investigators ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('agencies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'agencies'
              ? 'bg-brand-indigo text-white shadow-xs'
              : 'text-secondary hover:text-primary hover:bg-subtle'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Participating Agencies ({agencies.length})</span>
        </button>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-subtle/50 text-secondary font-mono text-[11px]">
                <th className="py-3 px-4">Event Timestamp</th>
                <th className="py-3 px-4">Officer / Subject</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Forensic Target</th>
                <th className="py-3 px-4">Cryptographic Hash Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-subtle/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-muted text-[11px]">
                    {formatIST(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-bold text-primary">
                    {log.user_id || 'IO Rajan Sharma'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-indigoTint text-brand-indigo border border-brand-indigo/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary">
                    {log.target_type}: {log.target_id?.slice(0, 14)}...
                  </td>
                  <td className="py-3 px-4 font-mono text-muted text-[11px]">
                    {log.hash_sha256?.slice(0, 24)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-surface border border-border shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-subtle/50 text-secondary font-mono text-[11px]">
                <th className="py-3 px-4">Officer Name</th>
                <th className="py-3 px-4">Official Email</th>
                <th className="py-3 px-4">Role / Designation</th>
                <th className="py-3 px-4">Police Badge No.</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-subtle/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary font-display">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-secondary">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-subtle text-secondary">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-brand-indigo font-bold">{u.badge_no}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-semantic-successTint text-semantic-successText">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Agencies */}
      {activeTab === 'agencies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agencies.map((ag) => (
            <div key={ag.id} className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-indigo" />
                <h4 className="font-bold text-sm text-primary font-display">{ag.name}</h4>
              </div>
              <p className="text-xs text-secondary font-mono">Jurisdiction: {ag.state}</p>
              <div className="text-[10px] text-muted font-mono pt-2 border-t border-border">
                Agency ID: {ag.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
