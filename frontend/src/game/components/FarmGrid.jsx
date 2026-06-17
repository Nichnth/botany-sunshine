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
      className="relative w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center p-1.5 group transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] z-10"
      style={{
        backgroundColor: "#201e1b", // Charcoal/clay pebble background of the pot
        borderColor: colors.border.split('-')[1] === "slate" ? "#475569" : 
                     colors.border.split('-')[1] === "yellow" ? "#facc15" :
                     colors.border.split('-')[1] === "emerald" ? "#10b981" :
                     colors.border.split('-')[1] === "amber" ? "#f59e0b" :
                     colors.border.split('-')[1] === "red" ? "#ef4444" : "#71717a",
        color: colors.text
      }}
    >
      {/* Slot Index */}
      <span className="absolute -top-7 bg-slate-800 text-[9px] text-slate-300 font-mono px-1.5 py-0.5 rounded shadow border border-slate-700 select-none">
        N-{slot.id + 1}
      </span>

      {/* Inside the Net Pot */}
      {slot.status === "broken" && (
        <div className="text-2xl animate-bounce">{colors.emoji}</div>
      )}

      {slot.status === "empty" && (
        <Sprout size={20} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
      )}

      {seed && slot.status !== "broken" && (
        <>
          {/* Plant Emoji */}
          <div
            className="text-3xl mb-0.5 select-none"
            style={{
              filter: slot.status === "wilted" ? "grayscale(85%)" : "none",
              transform: `scale(${0.65 + (slot.growth / 100) * 0.45})`,
              transition: "transform 0.4s ease-out",
            }}
          >
            {seed.emoji}
          </div>

          {/* Progress Bar inside pot */}
          <div className="w-12 bg-zinc-800 rounded-full h-1 overflow-hidden">
            <div
              className="h-1 rounded-full transition-all"
              style={{
                width: `${slot.growth}%`,
                background: slot.status === "mature" ? "#F59E0B" : "#10B981",
              }}
            />
          </div>

          {/* Water/Nutrient Status Indicators */}
          <div className="absolute -bottom-4 flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full shadow text-[8px] text-white">
            <span className="flex items-center gap-0.5 font-mono">
              <Droplet size={8} className={slot.water < 30 ? "text-red-400" : "text-sky-400"} />
              {Math.round(slot.water)}
            </span>
            <span className="flex items-center gap-0.5 font-mono">
              <FlaskConical size={8} className={slot.nutrient < 20 ? "text-red-400" : "text-emerald-400"} />
              {Math.round(slot.nutrient)}
            </span>
          </div>

          {/* Durability indicator if low */}
          {slot.durability < 30 && (
            <div className="absolute -top-3 right-0 bg-amber-500 text-white font-mono text-[8px] px-1 py-0.5 rounded shadow">
              {Math.round(slot.durability)}%
            </div>
          )}
        </>
      )}

      {/* Badges/Overlays */}
      {slot.status === "mature" && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white animate-pulse">
          PANEN!
        </div>
      )}

      {slot.status === "wilted" && (
        <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow border border-white">
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
      <div className="relative flex flex-col gap-10">
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
