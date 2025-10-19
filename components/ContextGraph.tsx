import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '../types';
import { NodeType } from '../types';

interface ContextGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

const MAX_NODES = 500; // Safety cap for performance

const nodeTypeConfig = {
    [NodeType.Commit]: { color: '#f59e0b', radius: 18 }, // amber-500
    [NodeType.Issue]: { color: '#ef4444', radius: 18 },   // red-500
    [NodeType.PullRequest]: { color: '#8b5cf6', radius: 18 }, // violet-500
    [NodeType.User]: { color: '#3b82f6', radius: 12 },    // blue-500
};

const getIconSvgString = (type: NodeType, className: string): string => {
  const attrs = `xmlns="http://www.w3.org/2000/svg" class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

  switch (type) {
    case NodeType.Commit:
      return `<svg ${attrs}><circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/></svg>`;
    case NodeType.Issue:
      return `<svg ${attrs}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/><path d="M12 8h.01"/></svg>`;
    case NodeType.PullRequest:
      return `<svg ${attrs}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/></svg>`;
    case NodeType.User:
      return `<svg ${attrs}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    default:
      return '';
  }
};

const GraphLoadingIndicator: React.FC = () => (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-20 transition-opacity duration-300">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400 delay-200"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-cyan-400 delay-400"></div>
            <span className="text-gray-300">Building graph...</span>
        </div>
    </div>
);

export const ContextGraph: React.FC<ContextGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, null, undefined> | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [originalNodeCount, setOriginalNodeCount] = useState(0);

  useEffect(() => {
    simulationRef.current?.stop();
    tooltipRef.current?.remove();

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!svgRef.current || !containerRef.current) {
      return;
    }
    
    let processedNodes = nodes;
    setOriginalNodeCount(nodes.length);

    if (nodes.length > MAX_NODES) {
      processedNodes = nodes.slice(0, MAX_NODES);
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }

    if (processedNodes.length === 0) {
      setShowNoDataMessage(true);
      setIsRendering(false);
      return;
    }

    setShowNoDataMessage(false);
    setIsRendering(true);

    const timerId = setTimeout(() => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      svg.attr('width', width)
         .attr('height', height)
         .attr('viewBox', [-width / 2, -height / 2, width, height]);

      const simulation = d3.forceSimulation<GraphNode>(processedNodes)
          .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(60))
          .force('charge', d3.forceManyBody().strength(-200))
          .force('center', d3.forceCenter(0, 0))
          .stop(); // Stop the simulation from running automatically
      
      simulationRef.current = simulation;

      // Run the simulation for a fixed number of ticks to calculate layout.
      // This is much more performant than running it on every animation frame.
      simulation.tick(300);

      const link = svg.append('g')
          .attr('stroke', '#4b5563')
          .attr('stroke-opacity', 0.6)
          .selectAll('line')
          .data(links)
          .join('line')
          .attr('stroke-width', 1.5)
          .attr('x1', d => (d.source as GraphNode).x!)
          .attr('y1', d => (d.source as GraphNode).y!)
          .attr('x2', d => (d.target as GraphNode).x!)
          .attr('y2', d => (d.target as GraphNode).y!);

      const nodeGroup = svg.append('g')
          .selectAll('g')
          .data(processedNodes)
          .join('g')
          .attr('transform', d => `translate(${d.x},${d.y})`);

      nodeGroup.append('circle')
          .attr('r', d => nodeTypeConfig[d.type].radius)
          .attr('fill', d => nodeTypeConfig[d.type].color)
          .attr('stroke', '#1e1e1e')
          .attr('stroke-width', 2);

      const iconSize = 16;
      nodeGroup.append('foreignObject')
          .attr('x', -iconSize / 2)
          .attr('y', -iconSize / 2)
          .attr('width', iconSize)
          .attr('height', iconSize)
          .html(d => getIconSvgString(d.type, "w-full h-full text-white"));

      const tooltip = d3.select(containerRef.current).append('div')
          .attr('class', 'tooltip absolute opacity-0 pointer-events-none p-2 text-sm bg-gray-900 border border-gray-600 rounded-md shadow-lg transition-opacity duration-200 text-white z-10')
          .style('transform', 'translate(-50%, -110%)');
      
      tooltipRef.current = tooltip;
          
      nodeGroup
          .on('mouseover', (event, d) => {
              tooltip.transition().duration(200).style('opacity', 1);
              tooltip.html(`<strong>${d.type}:</strong> ${d.label}`)
                  .style('left', `${event.pageX - containerRef.current!.offsetLeft}px`)
                  .style('top', `${event.pageY - containerRef.current!.offsetTop}px`);
          })
          .on('mouseout', () => {
              tooltip.transition().duration(500).style('opacity', 0);
          });
          
      const drag = (simulation: d3.Simulation<GraphNode, undefined>) => {
          function dragstarted(event: any, d: GraphNode) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
          }
          function dragged(event: any, d: GraphNode) {
              d.fx = event.x;
              d.fy = event.y;
          }
          function dragended(event: any, d: GraphNode) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
              // No need for a continuous tick, dragging will re-heat and cool the simulation.
          }
          return d3.drag<SVGGElement, GraphNode>().on('start', dragstarted).on('drag', dragged).on('end', dragended);
      }

      nodeGroup.call(drag(simulation));

      setIsRendering(false);
    }, 50);

    return () => {
      clearTimeout(timerId);
    };
  }, [nodes, links]);

  return (
    <div ref={containerRef} className="w-full h-full absolute">
      {isRendering && <GraphLoadingIndicator />}
      {showNoDataMessage && !isRendering && (
         <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No activity found to display.
         </div>
      )}
      {isTruncated && !isRendering && (
        <div className="absolute bottom-2 left-2 bg-gray-900/80 text-yellow-400 text-xs p-2 rounded-md border border-yellow-600">
          Displaying a subset of the graph for performance. ({MAX_NODES} of {originalNodeCount} nodes shown)
        </div>
      )}
      <svg ref={svgRef}></svg>
    </div>
  );
};