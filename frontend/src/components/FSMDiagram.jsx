import React, { useMemo, useState } from "react";

/**
 * Renderer FSM dengan SVG murni.
 * Menampilkan state sebagai node bulat & transition sebagai panah lengkung dengan label.
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

  const { nodes, edges, viewBox } = useMemo(() => {
    const stateMap = Object.fromEntries(fsm.states.map((s) => [s.id, s]));
    const edgeCounter = {};

    const edges = fsm.transitions.map((t, idx) => {
      const key = `${t.from}->${t.to}`;
      edgeCounter[key] = (edgeCounter[key] || 0) + 1;
      const offset = (edgeCounter[key] - 1) * 35 - (edgeCounter[key] > 1 ? 17 : 0);
      const from = stateMap[t.from];
      const to = stateMap[t.to];
      const { path, labelX, labelY } = getEdgePath(from, to, offset);
      return { id: `${idx}`, ...t, path, labelX, labelY };
    });

    // viewBox calculation
    const xs = fsm.states.map((s) => s.x);
    const ys = fsm.states.map((s) => s.y);
    const minX = Math.min(...xs) - 40;
    const minY = Math.min(...ys) - 80;
    const maxX = Math.max(...xs) + NODE_W + 40;
    const maxY = Math.max(...ys) + NODE_H + 60;

    return {
      nodes: fsm.states,
      edges,
      viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
    };
  }, [fsm]);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
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
        return (
          <g
            key={n.id}
            transform={`translate(${n.x}, ${n.y})`}
            onMouseEnter={() => setHoveredState(n.id)}
            onMouseLeave={() => setHoveredState(null)}
            style={{ cursor: "pointer" }}
            data-testid={`fsm-state-${fsm.id}-${n.id}`}
          >
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={16}
              ry={16}
              fill={s.fill}
              stroke={s.stroke}
              strokeWidth={isHovered ? 3 : 2}
              filter="url(#node-shadow)"
              style={{ transition: "all 0.2s" }}
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
