import React from "react";
import { getSeed } from "../gameData";
import { Droplet, FlaskConical, Sprout } from "lucide-react";

const statusColor = {
  empty: { border: "border-slate-700", text: "text-slate-400", emoji: "" },
  seeded: { border: "border-yellow-400", text: "text-yellow-100", emoji: "🌱" },
  growing: { border: "border-emerald-500", text: "text-emerald-100", emoji: "🌿" },
  mature: { border: "border-amber-500", text: "text-amber-100", emoji: "✨" },
  wilted: { border: "border-red-500", text: "text-red-100", emoji: "🥀" },
  broken: { border: "border-zinc-500", text: "text-zinc-300", emoji: "🔧" },
};

const Slot = ({ slot, onClick }) => {
  const colors = statusColor[slot.status];
  const seed = slot.seedId ? getSeed(slot.seedId) : null;

  return (
    <button
      onClick={() => onClick(slot)}
      data-testid={`slot-${slot.id}`}
      className="relative w-24 h-28 flex flex-col items-center justify-center group transition-all hover:scale-105 active:scale-95 z-10"
    >
      {/* Slot Index */}
      <span className="absolute top-1 bg-slate-800 text-[8px] text-slate-300 font-mono px-1.5 py-0.5 rounded shadow border border-slate-700 select-none">
        N-{slot.id + 1}
      </span>

      {/* SVG drawing of a 3D Hydroponic Net Pot Cup */}
      <div className="w-20 h-20 relative flex items-center justify-center mt-3">
        <svg viewBox="0 0 100 100" className="w-20 h-20 absolute inset-0 select-none pointer-events-none">
          <defs>
            {/* Clay pebble texture gradient */}
            <radialGradient id="pebble-grad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="70%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#431407" />
            </radialGradient>
            
            {/* Net pot glow depending on state */}
            <filter id={`glow-${slot.id}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor={
                slot.status === "empty" ? "#475569" :
                slot.status === "seeded" ? "#eab308" :
                slot.status === "growing" ? "#10b981" :
                slot.status === "mature" ? "#f59e0b" :
                slot.status === "wilted" ? "#ef4444" : "#71717a"
              } floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Hole Shadow inside the PVC pipe */}
          <ellipse cx="50" cy="80" rx="30" ry="12" fill="#1e293b" opacity="0.8" />

          {/* 2. Water / Nutrient film inside the pipe (under the cup) */}
          <path d="M 22 80 C 35 84, 65 84, 78 80 C 65 77, 35 77, 22 80 Z" fill="#38bdf8" opacity="0.5" className="animate-pulse" />

          {/* 3. Tapered Net Pot Basket (Back grid ribs) */}
          <path d="M 25 35 L 32 78 C 34 83, 66 83, 68 78 L 75 35" fill="none" stroke="#27272a" strokeWidth="3" />
          
          {/* Vertical mesh bars of the net pot */}
          <line x1="33" y1="36" x2="38" y2="76" stroke="#18181b" strokeWidth="2.5" />
          <line x1="50" y1="36" x2="50" y2="79" stroke="#18181b" strokeWidth="2.5" />
          <line x1="67" y1="36" x2="62" y2="76" stroke="#18181b" strokeWidth="2.5" />
          
          {/* Horizontal mesh rings */}
          <path d="M 28 50 Q 50 54 72 50" fill="none" stroke="#18181b" strokeWidth="2" />
          <path d="M 30 65 Q 50 69 70 65" fill="none" stroke="#18181b" strokeWidth="2" />

          {/* 4. Clay Pebbles (Media) filled inside the net pot */}
          {slot.status !== "empty" && slot.status !== "broken" && (
            <g>
              <circle cx="42" cy="40" r="7" fill="url(#pebble-grad)" />
              <circle cx="58" cy="42" r="8" fill="url(#pebble-grad)" />
              <circle cx="48" cy="46" r="8" fill="url(#pebble-grad)" />
              <circle cx="37" cy="48" r="6" fill="url(#pebble-grad)" />
              <circle cx="62" cy="49" r="6" fill="url(#pebble-grad)" />
              <circle cx="50" cy="36" r="7" fill="url(#pebble-grad)" />
            </g>
          )}

          {/* 5. Front Lip Rim of the Net Pot (Sitting on the PVC pipe) */}
          <ellipse cx="50" cy="35" rx="28" ry="10" fill="#0f0f11" stroke={
            slot.status === "empty" ? "#475569" :
            slot.status === "seeded" ? "#eab308" :
            slot.status === "growing" ? "#10b981" :
            slot.status === "mature" ? "#f59e0b" :
            slot.status === "wilted" ? "#ef4444" : "#71717a"
          } strokeWidth="2.5" filter={`url(#glow-${slot.id})`} style={{ transition: "stroke 0.3s" }} />

          {/* 6. Roots growing out of the bottom of the cup (visible when plant grows) */}
          {seed && slot.growth > 25 && (
            <g opacity={slot.growth / 100} className="animate-pulse">
              <path d="M 40 78 Q 38 88 42 94" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
              <path d="M 50 79 Q 52 90 48 97" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
              <path d="M 60 78 Q 63 87 59 93" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* 7. Actual Plant Asset sitting in the net pot */}
        {seed && slot.status !== "broken" && (
          <div
            className="absolute text-4xl select-none"
            style={{
              filter: slot.status === "wilted" ? "grayscale(85%)" : "none",
              transform: `scale(${0.65 + (slot.growth / 100) * 0.45}) translate(-1px, -14px)`,
              transition: "transform 0.4s ease-out, filter 0.3s",
              transformOrigin: "bottom center"
            }}
          >
            {seed.emoji}
          </div>
        )}

        {/* Empty placeholder icon */}
        {slot.status === "empty" && (
          <Sprout size={18} className="absolute text-slate-500 group-hover:text-emerald-400 transition-colors pointer-events-none" />
        )}

        {/* Broken icon */}
        {slot.status === "broken" && (
          <div className="absolute text-xl animate-bounce pointer-events-none">🔧</div>
        )}
      </div>

      {/* Progress Line */}
      {seed && slot.status !== "broken" && (
        <div className="w-14 bg-zinc-800 rounded-full h-1 overflow-hidden mt-1.5 z-20">
          <div
            className="h-1 rounded-full transition-all"
            style={{
              width: `${slot.growth}%`,
              background: slot.status === "mature" ? "#F59E0B" : "#10B981",
            }}
          />
        </div>
      )}

      {/* Status Overlay details (water/nutrient) */}
      {seed && slot.status !== "broken" && (
        <div className="absolute -bottom-1.5 flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full shadow text-[8px] text-white z-20">
          <span className="flex items-center gap-0.5 font-mono">
            <Droplet size={8} className={slot.water < 30 ? "text-red-400" : "text-sky-400"} />
            {Math.round(slot.water)}
          </span>
          <span className="flex items-center gap-0.5 font-mono">
            <FlaskConical size={8} className={slot.nutrient < 20 ? "text-red-400" : "text-emerald-400"} />
            {Math.round(slot.nutrient)}
          </span>
        </div>
      )}

      {/* Panen Overlay badge */}
      {slot.status === "mature" && (
        <div className="absolute top-9 right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow border border-white animate-pulse z-20">
          PANEN
        </div>
      )}

      {/* Wilted warning */}
      {slot.status === "wilted" && (
        <div className="absolute top-9 right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow border border-white z-20">
          🥀
        </div>
      )}
    </button>
  );
};

const FarmGrid = ({ slots, onSlotClick }) => {
  // Split 12 slots into 3 pipes of 4 slots
  const pipes = [
    slots.slice(0, 4),
    slots.slice(4, 8),
    slots.slice(8, 12)
  ];

  return (
    <div
      className="bg-slate-950 border-4 border-slate-800 p-8 rounded-3xl relative shadow-2xl overflow-hidden flex flex-col justify-between"
      data-testid="farm-grid"
    >
      {/* Background grid representation */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Vertical Metal Rack Framing */}
      <div className="absolute left-6 top-0 bottom-0 w-3 bg-gradient-to-r from-slate-700 to-slate-500 border-x border-slate-800 shadow pointer-events-none" />
      <div className="absolute right-6 top-0 bottom-0 w-3 bg-gradient-to-r from-slate-700 to-slate-500 border-x border-slate-800 shadow pointer-events-none" />

      {/* Micro-tubing / Hoses running down the side */}
      <div className="absolute left-9 top-4 bottom-24 w-1.5 border-l-2 border-dashed border-sky-500/40 pointer-events-none" />
      <div className="absolute right-9 top-4 bottom-24 w-1.5 border-r-2 border-dashed border-emerald-500/40 pointer-events-none" />

      {/* The 3 PVC Pipes of the Hydroponic Rack */}
      <div className="relative flex flex-col gap-8">
        {pipes.map((pipeSlots, rowIndex) => (
          <div key={rowIndex} className="relative flex flex-col items-center">
            {/* LED Grow Light fixture hanging above */}
            <div className="w-[85%] h-2.5 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.7)] animate-pulse mb-3 border border-pink-300/30 flex items-center justify-around">
              <div className="w-1/4 h-0.5 bg-white/40" />
              <div className="w-1/4 h-0.5 bg-white/40" />
              <div className="w-1/4 h-0.5 bg-white/40" />
            </div>
            
            {/* White PVC Pipe / Grow Channel */}
            <div className="w-full bg-gradient-to-b from-slate-100 via-white to-slate-200 border-y-4 border-slate-300 rounded-full h-24 shadow-inner flex items-center justify-around px-8 relative">
              {/* Nutrient water flow inside the pipe indicator */}
              <div className="absolute inset-x-8 bottom-1.5 h-1 bg-sky-300/40 rounded-full animate-pulse pointer-events-none" />
              
              {pipeSlots.map((slot) => (
                <Slot key={slot.id} slot={slot} onClick={onSlotClick} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Water Reservoir / Pump controller at the bottom */}
      <div className="mt-8 bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 animate-pulse text-sm">
            💧
          </div>
          <div>
            <div className="font-bold text-slate-200">Sistem NFT Aktif</div>
            <div className="text-[10px] text-slate-500 font-mono">Nutrient Film Technique Flow</div>
          </div>
        </div>
        <div className="flex gap-2.5 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[9px] text-slate-400">
          <span className="text-emerald-400 font-bold">PUMP: ON</span>
          <span className="text-slate-600">|</span>
          <span className="text-sky-400 font-bold">FLOW: 1.8 L/min</span>
        </div>
      </div>
    </div>
  );
};

export default FarmGrid;
