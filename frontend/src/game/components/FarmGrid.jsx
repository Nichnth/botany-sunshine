import React from "react";
import { getSeed } from "../gameData";
import { Droplet, FlaskConical, Wrench, Sprout } from "lucide-react";

const statusColor = {
  empty: { bg: "#F4F9F4", border: "#D1FAE5", text: "#4B5563", emoji: "" },
  seeded: { bg: "#FEF9C3", border: "#FACC15", text: "#854D0E", emoji: "🌱" },
  growing: { bg: "#DCFCE7", border: "#22C55E", text: "#15803D", emoji: "🌿" },
  mature: { bg: "#FED7AA", border: "#F97316", text: "#9A3412", emoji: "✨" },
  wilted: { bg: "#FECACA", border: "#EF4444", text: "#991B1B", emoji: "🥀" },
  broken: { bg: "#E5E7EB", border: "#6B7280", text: "#374151", emoji: "🔧" },
};

const Slot = ({ slot, onClick }) => {
  const colors = statusColor[slot.status];
  const seed = slot.seedId ? getSeed(slot.seedId) : null;

  return (
    <button
      onClick={() => onClick(slot)}
      data-testid={`farm-slot-${slot.id}`}
      className="relative aspect-square rounded-2xl border-2 transition-all hover:scale-[1.03] hover:shadow-md flex flex-col items-center justify-center p-2 group"
      style={{ background: colors.bg, borderColor: colors.border, color: colors.text }}
    >
      <span className="absolute top-1.5 left-2 text-[10px] font-mono opacity-60">
        #{slot.id + 1}
      </span>

      {slot.status === "broken" && (
        <div className="text-3xl animate-pulse">{colors.emoji}</div>
      )}

      {slot.status === "empty" && (
        <Sprout size={28} className="opacity-30 group-hover:opacity-50 transition-opacity" />
      )}

      {seed && slot.status !== "broken" && (
        <>
          <div
            className="text-4xl mb-1"
            style={{
              filter: slot.status === "wilted" ? "grayscale(70%)" : "none",
              transform: `scale(${0.6 + (slot.growth / 100) * 0.6})`,
              transition: "transform 0.5s",
            }}
          >
            {seed.emoji}
          </div>
          <div className="w-full bg-white/60 rounded-full h-1.5 mb-1">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${slot.growth}%`,
                background: slot.status === "mature" ? "#F97316" : "#22C55E",
              }}
            />
          </div>
          <div className="flex items-center gap-1 text-[9px]">
            <Droplet size={9} className={slot.water < 30 ? "text-red-500" : "text-blue-500"} />
            <span className="font-mono">{Math.round(slot.water)}</span>
            <FlaskConical size={9} className={slot.nutrient < 20 ? "text-red-500" : "text-purple-500"} />
            <span className="font-mono">{Math.round(slot.nutrient)}</span>
          </div>
        </>
      )}

      {slot.status === "mature" && (
        <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
          PANEN!
        </div>
      )}
      {slot.status === "wilted" && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          ⚠
        </div>
      )}
      {slot.durability < 30 && slot.status !== "broken" && slot.status !== "empty" && (
        <div className="absolute bottom-1 right-1 bg-amber-500 text-white text-[8px] px-1 py-0.5 rounded">
          {Math.round(slot.durability)}%
        </div>
      )}
    </button>
  );
};

const FarmGrid = ({ slots, onSlotClick }) => {
  return (
    <div
      className="bg-gradient-to-br from-[#064E3B] to-[#10B981] p-6 rounded-2xl shadow-md relative overflow-hidden"
      data-testid="farm-grid"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative grid grid-cols-4 gap-3">
        {slots.map((slot) => (
          <Slot key={slot.id} slot={slot} onClick={onSlotClick} />
        ))}
      </div>
    </div>
  );
};

export default FarmGrid;
