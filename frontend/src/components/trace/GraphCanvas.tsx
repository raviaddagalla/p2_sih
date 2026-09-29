'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
// @ts-ignore
import dagre from 'cytoscape-dagre';
import { 
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Download, Sparkles, SlidersHorizontal, 
  Eye, HelpCircle, Layers, Filter, CheckCircle2, ChevronDown
} from 'lucide-react';
import { TraceNode, TraceEdge, VASPAttribution } from '@/lib/types';
import { formatUSD, truncateAddress } from '@/lib/formatters';

// Register dagre layout safely
if (typeof window !== 'undefined') {
  try {
    cytoscape.use(dagre);
  } catch (e) {
    // Ignore already registered
  }
}

interface GraphCanvasProps {
  nodes: TraceNode[];
  edges: TraceEdge[];
  attribution?: VASPAttribution | null;
  onSelectNode: (node: TraceNode | null) => void;
  selectedNodeId?: string | null;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  attribution,
  onSelectNode,
  selectedNodeId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [layoutName, setLayoutName] = useState<'dagre' | 'concentric' | 'breadthfirst'>('dagre');
  const [minValFilter, setMinValFilter] = useState<number>(0);
  const [isFollowingMoney, setIsFollowingMoney] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<{ node: TraceNode; x: number; y: number } | null>(null);

  // Initialize and update Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    // Filter elements based on min value
    const filteredEdges = edges.filter(e => e.total_value_usd >= minValFilter);
    const validNodeAddrs = new Set<string>();
    filteredEdges.forEach(e => {
      validNodeAddrs.add(e.from_addr);
      validNodeAddrs.add(e.to_addr);
    });
    // Always include root node
    nodes.filter(n => n.is_root).forEach(n => validNodeAddrs.add(n.address));

    const displayNodes = nodes.filter(n => validNodeAddrs.has(n.address));

    const cyElements: any[] = [];

    // Add nodes with bright intelligence light theme colors
    displayNodes.forEach((n) => {
      let nodeColor = '#FFFFFF';
      let borderColor = '#CBD5E1';
      let textColor = '#0B1220';
      let shape = 'ellipse';
      let size = 46;

      if (n.is_root) {
        // Root / Victim: Solid Indigo with soft halo
        nodeColor = '#4F46E5';
        borderColor = '#818CF8';
        textColor = '#4F46E5';
        size = 54;
      } else if (n.is_vasp || n.entity_type === 'EXCHANGE') {
        // VASP Exchange: Emerald Green with rounded rectangle
        nodeColor = '#DDF7EC';
        borderColor = '#10B981';
        textColor = '#047857';
        size = 62;
        shape = 'round-rectangle';
      } else if (n.entity_type === 'MIXER') {
        // Mixer: Violet
        nodeColor = '#F1EBFF';
        borderColor = '#8B5CF6';
        textColor = '#6B21A8';
        shape = 'hexagon';
        size = 50;
      } else if (n.entity_type === 'BRIDGE') {
        // Bridge: Amber
        nodeColor = '#FEF1D6';
        borderColor = '#F59E0B';
        textColor = '#B45309';
        shape = 'diamond';
        size = 50;
      } else if (n.risk_category === 'CRITICAL') {
        // Critical Risk: Red halo
        nodeColor = '#FDE4E4';
        borderColor = '#EF4444';
        textColor = '#B91C1C';
        size = 48;
      }

      cyElements.push({
        group: 'nodes',
        data: {
          id: n.address,
          label: n.vasp_name || truncateAddress(n.address, 5, 4),
          sublabel: n.is_root ? 'VICTIM' : (n.vasp_name || n.entity_type),
          color: nodeColor,
          borderColor: borderColor,
          textColor: textColor,
          shape: shape,
          size: size,
          raw: n
        }
      });
    });

    // Add edges with chain colors and light pills
    filteredEdges.forEach((e, idx) => {
      const edgeWeight = Math.min(5.5, Math.max(2, Math.log10(e.total_value_usd || 100)));
      
      // Chain colors
      let edgeColor = '#94A3B8'; // Slate default
      if (e.chain === 'TRON') edgeColor = '#EF0027';
      else if (e.chain === 'BTC') edgeColor = '#F7931A';
      else if (e.chain === 'ETH') edgeColor = '#627EEA';
      else if (e.chain === 'BSC') edgeColor = '#F3BA2F';

      const isCrossChain = e.pattern_tag === 'CROSS_CHAIN_BRIDGE' || e.chain === 'BSC';

      cyElements.push({
        group: 'edges',
        data: {
          id: `e_${e.from_addr}_${e.to_addr}_${idx}`,
          source: e.from_addr,
          target: e.to_addr,
          label: formatUSD(e.total_value_usd, true),
          weight: edgeWeight,
          color: edgeColor,
          isBridge: isCrossChain,
          raw: e
        }
      });
    });

    if (!cyRef.current) {
      const cy = cytoscape({
        container: containerRef.current,
        elements: cyElements,
        style: ([
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              'border-width': 2.5,
              'border-color': 'data(borderColor)',
              'width': 'data(size)',
              'height': 'data(size)',
              'shape': 'data(shape)' as any,
              'label': 'data(label)',
              'color': '#0B1220',
              'font-size': 11,
              'font-family': 'Inter, sans-serif',
              'font-weight': 'bold',
              'text-valign': 'bottom',
              'text-margin-y': 6,
              'text-background-color': '#FFFFFF',
              'text-background-opacity': 0.95,
              'text-background-padding': '3px',
              'text-background-shape': 'roundrectangle',
              'overlay-opacity': 0
            }
          },
          {
            selector: 'node:selected',
            style: {
              'border-color': '#4F46E5',
              'border-width': 4,
              'shadow-blur': 18,
              'shadow-color': 'rgba(79, 70, 229, 0.4)',
              'shadow-opacity': 0.8
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 'data(weight)',
              'line-color': 'data(color)',
              'target-arrow-color': 'data(color)',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'arrow-scale': 1.1,
              'label': 'data(label)',
              'color': '#1E293B',
              'font-size': 10,
              'font-family': 'JetBrains Mono, monospace',
              'font-weight': '600',
              'text-background-color': '#FFFFFF',
              'text-background-opacity': 0.95,
              'text-background-padding': '2px',
              'text-background-shape': 'roundrectangle',
              'text-border-color': '#E2E8F0',
              'text-border-width': 1,
              'text-border-opacity': 1
            }
          },
          {
            selector: 'edge[?isBridge]',
            style: {
              'line-style': 'dashed',
              'line-color': '#F59E0B',
              'target-arrow-color': '#F59E0B'
            }
          },
          {
            selector: '.money-path',
            style: {
              'line-color': '#4F46E5',
              'target-arrow-color': '#4F46E5',
              'width': 5,
              'shadow-blur': 12,
              'shadow-color': 'rgba(79, 70, 229, 0.5)',
              'shadow-opacity': 0.9
            }
          }
        ] as any[]),
        layout: {
          name: layoutName,
          // @ts-ignore
          rankDir: 'LR',
          nodeDimensionsIncludeLabels: true,
          padding: 60,
          animate: true,
          animationDuration: 400
        }
      });

      cy.on('tap', 'node', (evt) => {
        const nodeData = evt.target.data('raw');
        onSelectNode(nodeData);
      });

      cy.on('tap', (evt) => {
        if (evt.target === cy) {
          onSelectNode(null);
        }
      });

      // Hover tooltip
      cy.on('mouseover', 'node', (evt) => {
        const nodeData = evt.target.data('raw');
        const renderedPos = evt.target.renderedPosition();
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setHoveredNode({
            node: nodeData,
            x: renderedPos.x,
            y: renderedPos.y
          });
        }
      });

      cy.on('mouseout', 'node', () => {
        setHoveredNode(null);
      });

      cyRef.current = cy;
    } else {
      const cy = cyRef.current;
      cy.elements().remove();
      cy.add(cyElements);
      const layout = cy.layout({
        name: layoutName,
        // @ts-ignore
        rankDir: 'LR',
        nodeDimensionsIncludeLabels: true,
        padding: 60,
        animate: true,
        animationDuration: 350
      });
      layout.run();
    }
  }, [nodes, edges, layoutName, minValFilter]);

  // Toolbar Actions
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 50);
  const handleReset = () => {
    cyRef.current?.reset();
    handleFit();
  };

  const toggleFollowMoney = () => {
    if (!cyRef.current) return;
    setIsFollowingMoney(!isFollowingMoney);
    if (!isFollowingMoney) {
      // Find highest value edge path
      const sortedEdges = cyRef.current.edges().sort((a, b) => {
        return (b.data('raw')?.total_value_usd || 0) - (a.data('raw')?.total_value_usd || 0);
      });
      sortedEdges.slice(0, 4).addClass('money-path');
    } else {
      cyRef.current.elements().removeClass('money-path');
    }
  };

  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const png64 = cyRef.current.png({ full: true, scale: 2, bg: '#FBFCFF' });
    const link = document.createElement('a');
    link.download = `chainshield-trace-${Date.now()}.png`;
    link.href = png64;
    link.click();
  };

  return (
    <div className="relative w-full h-full bg-[#FBFCFF] dot-grid-bg overflow-hidden select-none">
      {/* Cytoscape Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* Floating White Top Toolbar */}
      <div className="absolute top-4 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Toolbar Controls (Interactive) */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border shadow-md">
          {/* Layout switcher */}
          <div className="flex items-center gap-1 bg-subtle/80 p-1 rounded-xl">
            {(['dagre', 'concentric', 'breadthfirst'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLayoutName(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  layoutName === l
                    ? 'bg-surface text-brand-indigo shadow-xs'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {l === 'dagre' ? 'Hierarchical' : l === 'concentric' ? 'Radial' : 'Tree'}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-subtle text-secondary hover:text-primary transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-subtle text-secondary hover:text-primary transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleFit}
              className="p-1.5 rounded-lg hover:bg-subtle text-secondary hover:text-primary transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-subtle text-secondary hover:text-primary transition-colors"
              title="Reset Layout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Toolbar Controls (Interactive) */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border shadow-md">
          {/* Follow the Money Action */}
          <button
            onClick={toggleFollowMoney}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isFollowingMoney
                ? 'bg-brand-indigo text-white shadow-sm'
                : 'bg-brand-indigoTint text-brand-indigo hover:bg-brand-indigo/15 border border-brand-indigo/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Follow The Money</span>
          </button>

          {/* Export Graph PNG */}
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface border border-border hover:bg-subtle text-secondary hover:text-primary transition-colors"
            title="Export high-resolution forensic diagram PNG"
          >
            <Download className="w-3.5 h-3.5 text-brand-indigo" />
            <span>Export PNG</span>
          </button>

          {/* Legend Popover Toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-1.5 rounded-xl bg-surface border border-border hover:bg-subtle text-secondary hover:text-primary transition-colors"
            title="Graph Legend & Node Shapes"
          >
            <HelpCircle className="w-4 h-4 text-brand-indigo" />
          </button>
        </div>
      </div>

      {/* Hover Node Tooltip Card */}
      {hoveredNode && (
        <div
          className="absolute z-30 p-3 rounded-xl bg-surface border border-border shadow-xl text-xs pointer-events-none transition-all duration-75 space-y-1"
          style={{
            left: Math.min(hoveredNode.x + 15, (containerRef.current?.offsetWidth || 800) - 220),
            top: Math.max(hoveredNode.y - 40, 20),
            width: '210px'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary truncate">
              {hoveredNode.node.vasp_name || hoveredNode.node.entity_type}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-subtle text-muted">
              Hop {hoveredNode.node.hop}
            </span>
          </div>
          <div className="font-mono text-[11px] text-brand-indigo">
            {truncateAddress(hoveredNode.node.address, 8, 6)}
          </div>
          <div className="text-[11px] text-secondary flex justify-between pt-1 border-t border-border">
            <span>Balance:</span>
            <span className="font-mono font-bold text-primary">{formatUSD(hoveredNode.node.balance_usd)}</span>
          </div>
        </div>
      )}

      {/* Legend Card Popover */}
      {showLegend && (
        <div className="absolute top-20 right-6 z-30 w-72 p-4 rounded-2xl bg-surface border border-border shadow-xl text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-bold text-primary font-display uppercase tracking-wider">
              Forensic Graph Legend
            </span>
            <button onClick={() => setShowLegend(false)} className="text-muted hover:text-primary text-xs">
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#4F46E5] border border-[#818CF8]" />
              <span className="text-secondary font-medium">Root / Victim Wallet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-md bg-[#DDF7EC] border border-[#10B981]" />
              <span className="text-secondary font-medium">VASP / Custodial Exchange</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-white border border-[#CBD5E1]" />
              <span className="text-secondary font-medium">Intermediary Wallet</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-sm bg-[#F1EBFF] border border-[#8B5CF6]" />
              <span className="text-secondary font-medium">Tornado / Crypto Mixer</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rotate-45 bg-[#FEF1D6] border border-[#F59E0B]" />
              <span className="text-secondary font-medium">Cross-Chain Bridge</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full bg-[#FDE4E4] border border-[#EF4444]" />
              <span className="text-secondary font-medium">Critical Risk Suspect Node</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
