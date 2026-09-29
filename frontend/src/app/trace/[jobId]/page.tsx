'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  GitBranch, ShieldCheck, Download, RefreshCw, Layers, List, CheckSquare, 
  Sparkles, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight
} from 'lucide-react';
import { GraphCanvas } from '@/components/trace/GraphCanvas';
import { PipelineStepper } from '@/components/trace/PipelineStepper';
import { FindingsFeed } from '@/components/trace/FindingsFeed';
import { NodeInspector } from '@/components/trace/NodeInspector';
import { AttributionBanner } from '@/components/trace/AttributionBanner';
import { FreezeModal } from '@/components/freeze/FreezeModal';
import { TraceNode, TraceEdge, Finding, VASPAttribution, TraceGraphData } from '@/lib/types';
import { api } from '@/lib/api';
import { formatUSD, formatINR, formatIST, truncateAddress } from '@/lib/formatters';
import { Button } from '@/components/ui/Button';

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
  const [activeBottomTab, setActiveBottomTab] = useState<'recs' | 'txs' | 'patterns'>('recs');

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

    // WebSocket for real-time live events
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
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-canvas text-primary">
      {/* Attribution Result Celebration Banner */}
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
        <div className="w-80 border-r border-border bg-surface flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
          <PipelineStepper
            progress={progress}
            hopsCount={maxHop}
            nodesCount={nodes.length}
            totalValueUsd={totalValue}
            chain={chain}
            vaspName={attribution?.vasp_name}
            elapsedSeconds={6.2}
          />
          <div className="border-t border-border flex-1">
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
          <div className="h-56 border-t border-border bg-surface flex flex-col shrink-0 z-20 shadow-xs">
            {/* Drawer Tabs Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-subtle/50">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveBottomTab('recs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeBottomTab === 'recs'
                      ? 'bg-surface text-brand-indigo shadow-xs border border-border'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>SOP Checklist & Actions</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('txs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeBottomTab === 'txs'
                      ? 'bg-surface text-brand-indigo shadow-xs border border-border'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Transaction Ledger ({edges.length})</span>
                </button>

                <button
                  onClick={() => setActiveBottomTab('patterns')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeBottomTab === 'patterns'
                      ? 'bg-surface text-brand-indigo shadow-xs border border-border'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cross-Chain Journey Strip</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-muted">
                Section 106 BNSS Investigation Protocol
              </div>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 p-4 overflow-y-auto text-xs bg-surface">
              {activeBottomTab === 'recs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary uppercase font-mono text-[11px]">
                      Recommended Standard Operating Procedures:
                    </span>
                    <span className="text-[11px] text-semantic-successText font-semibold font-mono">
                      4/4 Automated Steps Completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-subtle/70 border border-border flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-primary">Issue Statutory Section 106 Notice</div>
                        <div className="text-[11px] text-secondary">
                          Formal notice to {attribution?.vasp_name || 'VASP'} with deposit address and transaction hashes.
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-subtle/70 border border-border flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-primary">Download Evidence Dossier PDF</div>
                        <div className="text-[11px] text-secondary">
                          Courtroom-ready report with cryptographic trail, hash proofs, and investigator sign-off.
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-subtle/70 border border-border flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-primary">Register Deposit Account in NCRP</div>
                        <div className="text-[11px] text-secondary">
                          Flag recipient wallet across national law enforcement repository to prevent unfreezing.
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-subtle/70 border border-border flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-semantic-success shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-primary">Subpoena KYC & Connected Bank Accounts</div>
                        <div className="text-[11px] text-secondary">
                          Obtain linked Indian bank account IFSC/UPI IDs under Section 91 CrPC.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeBottomTab === 'txs' && (
                <div className="space-y-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border bg-subtle/50 text-muted font-mono text-[10px]">
                        <th className="py-1.5 px-2">From Address</th>
                        <th className="py-1.5 px-2">To Address</th>
                        <th className="py-1.5 px-2">Chain</th>
                        <th className="py-1.5 px-2">Amount USD</th>
                        <th className="py-1.5 px-2">Pattern Tag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-mono text-[11px]">
                      {edges.map((e, idx) => (
                        <tr key={idx} className="hover:bg-subtle/40">
                          <td className="py-2 px-2 text-brand-indigo font-bold">{truncateAddress(e.from_addr, 6, 4)}</td>
                          <td className="py-2 px-2 text-primary">{truncateAddress(e.to_addr, 6, 4)}</td>
                          <td className="py-2 px-2">{e.chain}</td>
                          <td className="py-2 px-2 font-bold text-primary">{formatUSD(e.total_value_usd)}</td>
                          <td className="py-2 px-2">
                            <span className="px-1.5 py-0.5 rounded bg-subtle text-[10px] text-secondary font-sans font-medium">
                              {e.pattern_tag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeBottomTab === 'patterns' && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-primary font-display uppercase tracking-wider">
                    Cross-Chain Movement Strip
                  </div>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <div className="p-3 rounded-xl bg-subtle/60 border border-border shrink-0 text-center space-y-1">
                      <span className="px-2 py-0.5 rounded bg-[#FEE7E9] text-[#9F1239] text-[10px] font-mono font-bold">
                        TRON
                      </span>
                      <div className="text-xs font-bold text-primary">Victim Deposit</div>
                      <div className="text-[10px] text-muted font-mono">$48,210 USDT</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted shrink-0" />
                    <div className="p-3 rounded-xl bg-subtle/60 border border-border shrink-0 text-center space-y-1">
                      <span className="px-2 py-0.5 rounded bg-[#FEF9E7] text-[#854D0E] text-[10px] font-mono font-bold">
                        BSC Bridge
                      </span>
                      <div className="text-xs font-bold text-primary">Peel Intermediary</div>
                      <div className="text-[10px] text-muted font-mono">$44,100 USDT</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted shrink-0" />
                    <div className="p-3 rounded-xl bg-semantic-successTint border border-semantic-success/40 shrink-0 text-center space-y-1">
                      <span className="px-2 py-0.5 rounded bg-semantic-success text-white text-[10px] font-mono font-bold">
                        Binance Hot Wallet
                      </span>
                      <div className="text-xs font-bold text-semantic-successText">Target Exchange</div>
                      <div className="text-[10px] text-semantic-successText font-mono font-bold">Attributed</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Region: Entity Inspector */}
        <div className="w-88 border-l border-border bg-surface flex flex-col shrink-0 overflow-y-auto hidden xl:flex">
          <NodeInspector
            node={selectedNode}
            onOpenFreezeModal={handleOpenFreeze}
            onAddToWatchlist={(addr, ch) => {
              alert(`Address ${truncateAddress(addr, 6, 4)} added to 24/7 Watchlist.`);
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
