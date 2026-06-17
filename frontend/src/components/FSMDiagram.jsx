import React, { useMemo, useState, useEffect, useRef } from "react";

/**
 * Renderer FSM dengan SVG murni.
 * Menampilkan state sebagai node bulat & transition sebagai panah lengkung dengan label.
 * Mendukung drag-and-drop interaktif untuk memindahkan box state.
 */

const NODE_W = 140;
const NODE_H = 60;

const nodeStyles = {
  initial: { fill: "#10B981", stroke: "#059669", text: "#FFFFFF" },
  final: { fill: "#0EA5E9", stroke: "#0284C7", text: "#FFFFFF" },
  error: { fill: "#FEE2E2", stroke: "#EF4444", text: "#B91C1C" },
  normal: { fill: "#FFFFFF", stroke: "#10B981", text: "#064E3B" },
};

const getEdgePath = (from, to, curveOffset = 0) => {
  // entry & exit points (right side of source -> left side of target)
  let x1 = from.x + NODE_W;
  let y1 = from.y + NODE_H / 2;
  let x2 = to.x;
  let y2 = to.y + NODE_H / 2;

  // Self-loop
  if (from.id === to.id) {
    const cx = from.x + NODE_W / 2;
    const cy = from.y - 30;
    return {
      path: `M ${from.x + NODE_W * 0.7} ${from.y} C ${cx + 40} ${cy}, ${cx - 40} ${cy}, ${from.x + NODE_W * 0.3} ${from.y}`,
      labelX: cx,
      labelY: cy - 5,
    };
  }

  // Determine direction
  if (to.x < from.x) {
    // Going backward: use left of source -> right of target
    x1 = from.x;
    x2 = to.x + NODE_W;
  } else if (Math.abs(to.x - from.x) < NODE_W) {
    // Nodes nearly vertically aligned: use top/bottom
    if (to.y > from.y) {
      x1 = from.x + NODE_W / 2;
      y1 = from.y + NODE_H;
      x2 = to.x + NODE_W / 2;
      y2 = to.y;
    } else {
      x1 = from.x + NODE_W / 2;
      y1 = from.y;
      x2 = to.x + NODE_W / 2;
      y2 = to.y + NODE_H;
    }
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + curveOffset;

  // Bezier control points
  const c1x = x1 + dx * 0.3;
  const c1y = y1 + curveOffset;
  const c2x = x2 - dx * 0.3;
  const c2y = y2 + curveOffset;

  return {
    path: `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`,
    labelX: mx,
    labelY: my - 6,
  };
};

export const FSMDiagram = ({ fsm }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [activeDragNode, setActiveDragNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef(null);

  // Initialize and reset local positions when FSM changes
  useEffect(() => {
    const initialPositions = {};
    fsm.states.forEach((s) => {
      initialPositions[s.id] = { x: s.x, y: s.y };
    });
    setNodePositions(initialPositions);
  }, [fsm]);

  // Stable viewBox calculations based on initial FSM configuration
  const viewBoxParams = useMemo(() => {
    const xs = fsm.states.map((s) => s.x);
    const ys = fsm.states.map((s) => s.y);
    const minX = Math.min(...xs) - 60;
    const minY = Math.min(...ys) - 100;
    const maxX = Math.max(...xs) + NODE_W + 60;
    const maxY = Math.max(...ys) + NODE_H + 80;

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    };
  }, [fsm]);

  // Drag handlers
  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = viewBoxParams.minX + ((e.clientX - rect.left) / rect.width) * viewBoxParams.width;
    const svgY = viewBoxParams.minY + ((e.clientY - rect.top) / rect.height) * viewBoxParams.height;
    
    const currentPos = nodePositions[nodeId] || { x: 0, y: 0 };
    setActiveDragNode(nodeId);
    setDragOffset({
      x: svgX - currentPos.x,
      y: svgY - currentPos.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!activeDragNode || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = viewBoxParams.minX + ((e.clientX - rect.left) / rect.width) * viewBoxParams.width;
    const svgY = viewBoxParams.minY + ((e.clientY - rect.top) / rect.height) * viewBoxParams.height;
    
    setNodePositions((prev) => ({
      ...prev,
      [activeDragNode]: {
        x: svgX - dragOffset.x,
        y: svgY - dragOffset.y,
      },
    }));
  };

  const handleTouchStart = (e, nodeId) => {
    if (!svgRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = viewBoxParams.minX + ((touch.clientX - rect.left) / rect.width) * viewBoxParams.width;
    const svgY = viewBoxParams.minY + ((touch.clientY - rect.top) / rect.height) * viewBoxParams.height;
    
    const currentPos = nodePositions[nodeId] || { x: 0, y: 0 };
    setActiveDragNode(nodeId);
    setDragOffset({
      x: svgX - currentPos.x,
      y: svgY - currentPos.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!activeDragNode || !svgRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = viewBoxParams.minX + ((touch.clientX - rect.left) / rect.width) * viewBoxParams.width;
    const svgY = viewBoxParams.minY + ((touch.clientY - rect.top) / rect.height) * viewBoxParams.height;
    
    setNodePositions((prev) => ({
      ...prev,
      [activeDragNode]: {
        x: svgX - dragOffset.x,
        y: svgY - dragOffset.y,
      },
    }));
  };

  const handleMouseUp = () => {
    setActiveDragNode(null);
  };

  // Re-calculate nodes and edge paths when local positions change
  const { nodes, edges } = useMemo(() => {
    const nodes = fsm.states.map((s) => ({
      ...s,
      x: nodePositions[s.id]?.x ?? s.x,
      y: nodePositions[s.id]?.y ?? s.y,
    }));

    const stateMap = Object.fromEntries(nodes.map((s) => [s.id, s]));
    const edgeCounter = {};

    const edges = fsm.transitions.map((t, idx) => {
      const key = `${t.from}->${t.to}`;
      edgeCounter[key] = (edgeCounter[key] || 0) + 1;
      const offset = (edgeCounter[key] - 1) * 35 - (edgeCounter[key] > 1 ? 17 : 0);
      const from = stateMap[t.from];
      const to = stateMap[t.to];
      
      if (!from || !to) return null;
      
      const { path, labelX, labelY } = getEdgePath(from, to, offset);
      return { id: `${idx}`, ...t, path, labelX, labelY };
    }).filter(Boolean);

    return { nodes, edges };
  }, [fsm, nodePositions]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBoxParams.viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      data-testid={`fsm-diagram-${fsm.id}`}
    >
      <defs>
        <marker
          id="arrow-blue"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#0EA5E9" />
        </marker>
        <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#10B981" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((e) => (
        <g key={e.id} className="fsm-edge">
          <path
            d={e.path}
            fill="none"
            stroke="#0EA5E9"
            strokeWidth="2"
            markerEnd="url(#arrow-blue)"
            opacity={hoveredState && hoveredState !== e.from && hoveredState !== e.to ? 0.2 : 0.85}
            style={{ transition: "opacity 0.2s" }}
          />
          <g transform={`translate(${e.labelX}, ${e.labelY})`}>
            <rect
              x={-((e.event.length * 5.5) / 2) - 6}
              y={-10}
              width={e.event.length * 5.5 + 12}
              height={18}
              rx={6}
              fill="#F4F9F4"
              stroke="#D1FAE5"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fill="#0284C7"
              fontFamily="JetBrains Mono, monospace"
              y={0}
            >
              {e.event}
            </text>
          </g>
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((n) => {
        const s = nodeStyles[n.type] || nodeStyles.normal;
        const isHovered = hoveredState === n.id;
        const isDragging = activeDragNode === n.id;
        return (
          <g
            key={n.id}
            transform={`translate(${n.x}, ${n.y})`}
            onMouseDown={(e) => handleMouseDown(e, n.id)}
            onTouchStart={(e) => handleTouchStart(e, n.id)}
            onMouseEnter={() => setHoveredState(n.id)}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            data-testid={`fsm-state-${fsm.id}-${n.id}`}
          >
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={16}
              ry={16}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={isHovered || isDragging ? 3 : 2}
              filter="url(#node-shadow)"
              style={{ transition: isDragging ? "none" : "stroke-width 0.2s, fill 0.2s" }}
            />
            {n.type === "initial" && (
              <circle cx={-12} cy={NODE_H / 2} r={6} fill="#059669" />
            )}
            {n.type === "final" && (
              <circle
                cx={NODE_W / 2}
                cy={NODE_H / 2}
                r={NODE_H / 2 - 6}
                fill="none"
                stroke={s.text}
                strokeWidth="1.5"
                opacity="0.5"
              />
            )}
            <text
              x={NODE_W / 2}
              y={NODE_H / 2 - 8}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="13"
              fontWeight="700"
              fill={s.text}
              fontFamily="Outfit, sans-serif"
              style={{ pointerEvents: "none" }}
            >
              {n.name}
            </text>
            <text
              x={NODE_W / 2}
              y={NODE_H / 2 + 10}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill={s.text}
              opacity="0.7"
              fontFamily="JetBrains Mono, monospace"
              style={{ pointerEvents: "none" }}
            >
              {n.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default FSMDiagram;
