'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  GitBranch, ShieldCheck, Download, RefreshCw, Layers, List, CheckSquare, Sparkles, AlertTriangle
} from 'lucide-react';
import { GraphCanvas } from '@/components/trace/GraphCanvas';
import { PipelineStepper } from '@/components/trace/PipelineStepper';
import { FindingsFeed } from '@/components/trace/FindingsFeed';
import { NodeInspector } from '@/components/trace/NodeInspector';
import { AttributionBanner } from '@/components/trace/AttributionBanner';
import { FreezeModal } from '@/components/freeze/FreezeModal';
import { TraceNode, TraceEdge, Finding, VASPAttribution, TraceGraphData } from '@/lib/types';
import { api } from '@/lib/api';
import { formatUSD, formatIST, truncateAddress } from '@/lib/formatters';

export default function TraceWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const jobId = (params?.jobId as string) || 'demo';

  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<TraceNode[]>([]);
  const [edges, setEdges] = useState<TraceEdge[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [attribution, setAttribution] = useState<VASPAttribution | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [progress, setProgress] = useState(10);
  const [chain, setChain] = useState('TRON');
  const [rootAddress, setRootAddress] = useState('TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L');
  const [selectedNode, setSelectedNode] = useState<TraceNode | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState<'txs' | 'patterns' | 'recs'>('recs');

  // Freeze Modal state
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [freezeModalData, setFreezeModalData] = useState<{
    vaspName: string;
    depositAddress: string;
    amountUsd: number;
  }>({
    vaspName: 'Binance',
    depositAddress: 'TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x',
    amountUsd: 48210.0
  });

  // Fetch initial graph or connect WebSocket
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isSubscribed = true;

    async function loadGraph() {
      setLoading(true);
      try {
        const data: TraceGraphData = await api.getTraceGraph(jobId);
        if (!isSubscribed) return;

        setRootAddress(data.root_address);
        setChain(data.chain);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setFindings(data.findings || []);
        setAttribution(data.attribution || null);
        setRecommendations(data.recommendations || []);
        setProgress(data.progress || 100);
        if (data.nodes && data.nodes.length > 0) {
          setSelectedNode(data.nodes[0]);
        }
      } catch (err) {
        console.error('Failed to load trace graph:', err);
      } finally {
        setLoading(false);
      }
    }

    loadGraph();

    // Try WebSocket for real-time live events if running
    try {
      const wsHost = window.location.hostname;
      const wsUrl = `ws://${wsHost}:8000/api/ws/trace/${jobId}`;
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'hop.completed') {
            setProgress(payload.progress);
            if (payload.new_nodes) {
              setNodes(prev => [...prev, ...payload.new_nodes]);
            }
            if (payload.new_edges) {
              setEdges(prev => [...prev, ...payload.new_edges]);
            }
          } else if (payload.type === 'vasp.identified') {
            setAttribution(payload.vasp);
          } else if (payload.type === 'pattern.detected') {
            setFindings(prev => [...prev, payload.finding]);
          } else if (payload.type === 'recommendations.ready') {
            setRecommendations(payload.recommendations);
          } else if (payload.type === 'job.completed') {
            setProgress(100);
          }
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };
    } catch (e) {
      console.log('WS not connected, using REST sync');
    }

    return () => {
      isSubscribed = false;
      if (ws) ws.close();
    };
  }, [jobId]);

  const handleDownloadPDF = async () => {
    try {
      window.open('http://127.0.0.1:8000/api/reports/default/download', '_blank');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenFreeze = (node?: TraceNode) => {
    if (attribution) {
      setFreezeModalData({
        vaspName: attribution.vasp_name,
        depositAddress: attribution.deposit_address,
        amountUsd: attribution.amount_usd
      });
    } else if (node) {
      setFreezeModalData({
        vaspName: node.vasp_name || 'Binance',
        depositAddress: node.address,
        amountUsd: node.balance_usd || 10000.0
      });
    }
    setIsFreezeModalOpen(true);
  };

  const totalValue = edges.reduce((acc, e) => acc + (e.total_value_usd || 0), 0);
  const maxHop = Math.max(0, ...nodes.map(n => n.hop || 0));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#070B14]">
      {/* Attribution Celebration Banner */}
      {attribution && (
        <AttributionBanner
          attribution={attribution}
          onGenerateFreeze={() => handleOpenFreeze()}
          onDownloadReport={handleDownloadPDF}
          onFollowMoney={() => {}}
        />
      )}

      {/* Hero Workspace 3-Region Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Region: Stepper & Findings */}
        <div className="w-80 border-r border-white/10 glass-panel flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
          <PipelineStepper
            progress={progress}
            hopsCount={maxHop}
            nodesCount={nodes.length}
            totalValueUsd={totalValue}
            chain={chain}
            vaspName={attribution?.vasp_name}
            elapsedSeconds={6.2}
          />
          <div className="border-t border-white/10 flex-1">
            <FindingsFeed findings={findings} />
          </div>
        </div>

        {/* Center Region: Graph Canvas & Bottom Tabs */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Main Graph Canvas */}
          <div className="flex-1 relative">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              attribution={attribution}
              onSelectNode={(n) => setSelectedNode(n)}
              selectedNodeId={selectedNode?.address}
            />
          </div>

          {/* Bottom Drawer Tabs */}
          <div className="h-56 border-t border-white/10 glass-panel flex flex-col shrink-0 z-20">
            {/* Drawer Tabs Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-slate-950/60">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveBottomTab('recs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeBottomTab === 'recs'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>SOP Recommendations ({recommendations.length})</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('patterns')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeBottomTab === 'patterns'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>AML Typology Findings ({findings.length})</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('txs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeBottomTab === 'txs'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Ledger Transactions ({edges.length})</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Root: <span className="text-cyan-300 font-semibold">{truncateAddress(rootAddress, 8, 6)}</span>
              </div>
            </div>

            {/* Drawer Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 text-xs">
              {activeBottomTab === 'recs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recommendations.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                            {r.step}
                          </span>
                          <span className="font-bold text-white">{r.action}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                            {r.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {r.details}
                        </p>
                      </div>

                      {r.is_actionable && (
                        <button
                          onClick={() => handleOpenFreeze()}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[11px] shrink-0 shadow-glow-emerald transition-all"
                        >
                          Execute
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {activeBottomTab === 'patterns' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {findings.map((f, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{f.title}</span>
                        <span className="font-mono text-[10px] text-slate-400">{Math.round(f.confidence * 100)}%</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{f.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeBottomTab === 'txs' && (
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-1.5">Hop</th>
                      <th className="pb-1.5">From Address</th>
                      <th className="pb-1.5">To Address</th>
                      <th className="pb-1.5">Amount (USD)</th>
                      <th className="pb-1.5">Pattern Tag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {edges.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-1.5 text-cyan-400 font-bold">Hop {e.hop_no}</td>
                        <td className="py-1.5 text-slate-300">{truncateAddress(e.from_addr, 6, 6)}</td>
                        <td className="py-1.5 text-slate-300">{truncateAddress(e.to_addr, 6, 6)}</td>
                        <td className="py-1.5 font-bold text-white">{formatUSD(e.total_value_usd)}</td>
                        <td className="py-1.5 text-amber-300 font-sans">{e.pattern_tag || 'TRANSFER'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Region: Node Entity Inspector */}
        <div className="w-80 border-l border-white/10 glass-panel flex flex-col shrink-0 overflow-hidden hidden xl:flex">
          <NodeInspector
            node={selectedNode}
            onOpenFreezeModal={handleOpenFreeze}
            onAddToWatchlist={async (addr, c) => {
              await api.startTrace({ address: addr, chain: c });
              alert(`Address ${truncateAddress(addr)} placed on 24/7 Watchlist!`);
            }}
          />
        </div>
      </div>

      {/* Freeze Requisition Modal */}
      <FreezeModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        vaspName={freezeModalData.vaspName}
        depositAddress={freezeModalData.depositAddress}
        amountUsd={freezeModalData.amountUsd}
      />
    </div>
  );
}
