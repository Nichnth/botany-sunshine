import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Coins,
  Calendar,
  Clock,
  Zap,
  ShoppingCart,
  Store,
  Package,
  Moon,
  RotateCcw,
  Pause,
  Play,
  GitBranch,
  Leaf,
} from "lucide-react";
import { useGame } from "../game/useGame";
import { getWeather, getTimePhase } from "../game/gameData";
import FarmGrid from "../game/components/FarmGrid";
import {
  SlotModal,
  ShopModal,
  MarketModal,
  InventoryModal,
  SleepModal,
} from "../game/components/GameModals";

const GamePage = () => {
  const { state, actions } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const weather = getWeather(state.weather);
  const timePhase = getTimePhase(state.hour);

  return (
    <div 
      className="p-4 md:p-6 lg:p-8 animate-fade-up min-h-screen text-slate-100 flex flex-col justify-start relative select-none"
      style={{
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)), url('/growroom_bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Top status bar (HUD) */}
      <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-2xl relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 font-[Outfit] tracking-wide uppercase">
                Botany Sunshine
              </h1>
              <Link
                to="/"
                className="text-[10px] text-sky-400 flex items-center gap-1 hover:text-sky-300 transition-colors"
              >
                <GitBranch size={10} /> Kembali ke FSM
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StatusPill icon={<Coins size={14} />} label="Saldo" value={`Rp${state.money}`} color="#34d399" />
            <StatusPill icon={<Calendar size={14} />} label="Hari" value={state.day} color="#38bdf8" />
            <StatusPill
              icon={<Clock size={14} />}
              label={timePhase.name}
              value={`${String(state.hour).padStart(2, "0")}:00 ${timePhase.emoji}`}
              color="#a78bfa"
            />
            <StatusPill
              icon={<span className="text-sm">{weather.emoji}</span>}
              label="Cuaca"
              value={weather.name}
              color="#fbbf24"
            />
            <StatusPill icon={<Zap size={14} />} label="Stamina" value={`${state.stamina}%`} color="#fb923c" />

            <div className="flex items-center gap-2 ml-2 border-l border-slate-800 pl-3">
              <button
                onClick={actions.togglePause}
                data-testid="btn-pause"
                className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500 hover:text-emerald-400 flex items-center justify-center text-slate-400 transition-all"
                title={state.paused ? "Lanjutkan" : "Jeda"}
              >
                {state.paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Reset semua progres game?")) actions.reset();
                }}
                data-testid="btn-reset"
                className="w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800 hover:bg-red-950/30 hover:border-red-500 hover:text-red-400 flex items-center justify-center text-slate-400 transition-all"
                title="Reset Game"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {state.paused && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-2 rounded-xl text-center animate-pulse">
            ⏸ Game dijeda — klik tombol play untuk melanjutkan
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Left column: Farm & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FarmGrid slots={state.slots} onSlotClick={setSelectedSlot} />

          {/* Action Dock */}
          <div className="grid grid-cols-4 gap-4">
            <ActionTile
              icon={<ShoppingCart size={22} />}
              label="Toko"
              onClick={() => setActiveModal("shop")}
              color="#10B981"
              testId="btn-shop"
            />
            <ActionTile
              icon={<Store size={22} />}
              label="Pasar"
              onClick={() => setActiveModal("market")}
              color="#F97316"
              testId="btn-market"
            />
            <ActionTile
              icon={<Package size={22} />}
              label="Inventaris"
              onClick={() => setActiveModal("inventory")}
              color="#8B5CF6"
              testId="btn-inventory"
            />
            <ActionTile
              icon={<Moon size={22} />}
              label="Tidur"
              onClick={() => setActiveModal("sleep")}
              color="#0284C7"
              testId="btn-sleep"
            />
          </div>
        </div>

        {/* Right column: Game Terminal Log */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 shadow-2xl flex flex-col min-h-[400px] lg:min-h-0">
          <h3 className="font-extrabold text-slate-300 mb-4 font-[Outfit] text-sm tracking-widest uppercase border-b border-slate-800 pb-2">
            📟 Terminal Aktivitas
          </h3>
          <div 
            className="space-y-2.5 overflow-y-auto flex-1 max-h-[520px] pr-1.5" 
            data-testid="game-log"
            style={{ scrollbarWidth: "thin" }}
          >
            {state.log.map((entry, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-300 bg-slate-900/40 rounded-xl p-3 border border-slate-850 hover:border-slate-800/60 transition-all font-mono"
              >
                <div className="text-[9px] text-sky-400 font-bold mb-1 tracking-wider">
                  HARI {entry.day} · {String(entry.hour).padStart(2, "0")}:00
                </div>
                {entry.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedSlot && (
        <SlotModal
          slot={state.slots[selectedSlot.id]}
          state={state}
          actions={actions}
          onClose={() => setSelectedSlot(null)}
        />
      )}
      {activeModal === "shop" && (
        <ShopModal state={state} actions={actions} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "market" && (
        <MarketModal state={state} actions={actions} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "inventory" && (
        <InventoryModal state={state} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "sleep" && (
        <SleepModal actions={actions} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

const StatusPill = ({ icon, label, value, color }) => (
  <div
    className="flex items-center gap-2.5 bg-slate-950/60 border border-slate-800/80 backdrop-blur px-3 py-2 rounded-xl text-slate-200"
    data-testid={`status-${label.toLowerCase()}`}
  >
    <span style={{ color }}>{icon}</span>
    <div className="leading-tight">
      <div className="text-[9px] tracking-widest uppercase text-slate-500 font-bold">{label}</div>
      <div className="text-xs font-black font-mono text-slate-100">{value}</div>
    </div>
  </div>
);

const ActionTile = ({ icon, label, onClick, color, testId }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className="bg-slate-900/60 border-2 border-slate-800/85 hover:border-[currentColor] hover:bg-slate-900/90 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5 text-slate-300 hover:text-slate-100"
    style={{ color }}
  >
    <div className="p-2 rounded-xl bg-slate-950/40">
      {icon}
    </div>
    <span className="text-xs font-black tracking-wide uppercase">{label}</span>
  </button>
);

export default GamePage;
