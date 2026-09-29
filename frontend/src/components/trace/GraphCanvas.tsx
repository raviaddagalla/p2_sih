'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
// @ts-ignore
import dagre from 'cytoscape-dagre';
import { 
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Download, Sparkles, SlidersHorizontal, Eye
} from 'lucide-react';
import { TraceNode, TraceEdge, VASPAttribution } from '@/lib/types';
import { formatUSD, truncateAddress } from '@/lib/formatters';

// Register dagre layout
if (typeof window !== 'undefined') {
  try {
    cytoscape.use(dagre);
  } catch (e) {
    // Already registered or fallback
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

  // Initialize and update Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    // Filter elements
    const filteredEdges = edges.filter(e => e.total_value_usd >= minValFilter);
    const validNodeAddrs = new Set<string>();
    filteredEdges.forEach(e => {
      validNodeAddrs.add(e.from_addr);
      validNodeAddrs.add(e.to_addr);
    });
    // Always include root
    nodes.filter(n => n.is_root).forEach(n => validNodeAddrs.add(n.address));

    const displayNodes = nodes.filter(n => validNodeAddrs.has(n.address));

    const cyElements: any[] = [];

    // Add nodes
    displayNodes.forEach((n) => {
      let nodeColor = '#334155'; // default slate
      let borderColor = '#64748B';
      let shape = 'ellipse';
      let size = 48;

      if (n.is_root) {
        nodeColor = '#06B6D4'; // cyan
        borderColor = '#22D3EE';
        size = 56;
      } else if (n.is_vasp || n.entity_type === 'EXCHANGE') {
        nodeColor = '#059669'; // emerald green
        borderColor = '#34D399';
        size = 64;
        shape = 'round-rectangle';
      } else if (n.entity_type === 'MIXER') {
        nodeColor = '#7C3AED'; // violet
        borderColor = '#A78BFA';
        shape = 'hexagon';
        size = 52;
      } else if (n.entity_type === 'BRIDGE') {
        nodeColor = '#D97706'; // amber
        borderColor = '#FBBF24';
        shape = 'diamond';
        size = 52;
      } else if (n.risk_category === 'CRITICAL') {
        nodeColor = '#DC2626'; // red
        borderColor = '#F87171';
      }

      cyElements.push({
        group: 'nodes',
        data: {
          id: n.address,
          label: n.vasp_name || truncateAddress(n.address, 5, 4),
          sublabel: n.is_root ? 'VICTIM' : (n.vasp_name || n.entity_type),
          color: nodeColor,
          borderColor: borderColor,
          shape: shape,
          size: size,
          raw: n
        }
      });
    });

    // Add edges
    filteredEdges.forEach((e, idx) => {
      const edgeWeight = Math.min(6, Math.max(1.5, Math.log10(e.total_value_usd || 100)));
      cyElements.push({
        group: 'edges',
        data: {
          id: `e_${e.from_addr}_${e.to_addr}_${idx}`,
          source: e.from_addr,
          target: e.to_addr,
          label: formatUSD(e.total_value_usd, true),
          weight: edgeWeight,
          isBridge: e.pattern_tag === 'CROSS_CHAIN_BRIDGE' || e.chain === 'BSC',
          raw: e
        }
      });
    });

    if (!cyRef.current) {
      const cy = cytoscape({
        container: containerRef.current,
        elements: cyElements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': 'data(color)',
              'border-width': 2,
              'border-color': 'data(borderColor)',
              'width': 'data(size)',
              'height': 'data(size)',
              'shape': 'data(shape)' as any,
              'label': 'data(label)',
              'color': '#F8FAFC',
              'font-size': 11,
              'font-family': 'JetBrains Mono, monospace',
              'font-weight': 'bold',
              'text-valign': 'bottom',
              'text-margin-y': 6,
              'text-background-color': 'rgba(7, 11, 20, 0.85)',
              'text-background-opacity': 0.85,
              'text-background-padding': '3px',
              'text-background-shape': 'roundrectangle',
              'overlay-opacity': 0
            }
          },
          {
            selector: 'node:selected',
            style: {
              'border-color': '#22D3EE',
              'border-width': 4,
              'shadow-blur': 25,
              'shadow-color': '#22D3EE',
              'shadow-opacity': 0.8
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 'data(weight)',
              'line-color': '#475569',
              'target-arrow-color': '#64748B',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'arrow-scale': 1.2,
              'label': 'data(label)',
              'color': '#94A3B8',
              'font-size': 10,
              'font-family': 'Space Grotesk, sans-serif',
              'font-weight': '600',
              'text-background-color': 'rgba(11, 17, 32, 0.9)',
              'text-background-opacity': 0.9,
              'text-background-padding': '2px',
              'text-background-shape': 'roundrectangle'
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
              'line-color': '#22D3EE',
              'target-arrow-color': '#22D3EE',
              'width': 5,
              'shadow-blur': 15,
              'shadow-color': '#22D3EE',
              'shadow-opacity': 0.9
            }
          }
        ],
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

      cyRef.current = cy;
    } else {
      // Incremental update elements
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

  // "Follow the money" path highlight animation
  const followTheMoney = () => {
    const cy = cyRef.current;
    if (!cy) return;

    setIsFollowingMoney(true);
    cy.elements().removeClass('money-path');

    // Find root node and VASP node
    const root = cy.nodes('[?is_root]');
    const vasp = cy.nodes('[?is_vasp]');

    if (root.length && vasp.length) {
      const aStar = cy.elements().aStar({
        root: root[0],
        goal: vasp[0],
        weight: (edge) => 1 / (edge.data('weight') || 1)
      });

      if (aStar.found) {
        aStar.path.addClass('money-path');
        cy.animate({
          fit: { eles: aStar.path, padding: 80 },
          duration: 600
        });
      }
    }

    setTimeout(() => setIsFollowingMoney(false), 3000);
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 50);

  const exportPNG = () => {
    const cy = cyRef.current;
    if (!cy) return;
    const png64 = cy.png({ full: true, bg: '#070B14' });
    const link = document.createElement('a');
    link.download = `ChainShield_Graph_${Date.now()}.png`;
    link.href = png64;
    link.click();
  };

  return (
    <div className="relative w-full h-full bg-[#070B14] overflow-hidden cyber-grid-bg select-none">
      {/* Cytoscape DOM container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={followTheMoney}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
            isFollowingMoney
              ? 'bg-cyan-400 text-black shadow-glow-cyan animate-pulse'
              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30'
          }`}
          title="Highlight and animate highest-value path to exchange"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Follow The Money</span>
        </button>

        {/* Layout Switcher */}
        <div className="flex items-center bg-slate-900/80 border border-white/10 rounded-xl p-1 text-xs text-slate-300">
          {(['dagre', 'concentric', 'breadthfirst'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLayoutName(l)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium ${
                layoutName === l ? 'bg-cyan-500 text-black font-bold' : 'hover:text-white'
              }`}
            >
              {l === 'dagre' ? 'Hierarchical' : l === 'concentric' ? 'Radial' : 'Flow'}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-1.5 bg-slate-900/90 border border-white/10 rounded-xl p-1.5 shadow-2xl backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFit}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Fit Graph to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button
          onClick={exportPNG}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          title="Export Court Evidence PNG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-6 left-6 z-10 hidden md:flex items-center gap-4 px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-[11px] text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Root Mule</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
          <span>Intermediary</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-glow-emerald" />
          <span className="font-semibold text-emerald-400">VASP Exchange</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>Mixer</span>
        </div>
      </div>
    </div>
  );
};
