import React, { useState } from "react";
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
  ChevronRight,
  User,
  X,
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
  const [screen, setScreen] = useState("menu"); // "menu" | "gameplay" | "author"
  const [activeModal, setActiveModal] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const weather = getWeather(state.weather);
  const timePhase = getTimePhase(state.hour);

  // Checks if a save file actually exists in localStorage
  const hasSaveData = () => {
    try {
      const saved = localStorage.getItem("hidrofarm_save_v1");
      return saved !== null;
    } catch (e) {
      return false;
    }
  };

  // 1. OPENING MENU SCREEN
  if (screen === "menu") {
    return (
      <div
        className="min-h-screen text-slate-100 flex flex-col items-center justify-between p-6 relative select-none"
        style={{
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)), url('/growroom_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute top-6 left-6">
          <a
            href="/"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold tracking-wide flex items-center gap-1 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
          >
            ← Kembali ke Dokumentasi FSM
          </a>
        </div>

        {/* Top/Middle Title */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl px-4 mt-12">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-6 animate-bounce">
            <Leaf size={36} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 font-[Outfit] tracking-wider uppercase mb-3 drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
            Botany Sunshine
          </h1>
          <p className="text-sm text-slate-400 tracking-[0.25em] uppercase font-mono mb-10">
            Simulasi Kebun Hidroponik NFT
          </p>

          {/* Menu Buttons Stack */}
          <div className="flex flex-col gap-4 w-64">
            {/* CONTINUE */}
            <button
              onClick={() => setScreen("gameplay")}
              disabled={!hasSaveData()}
              className={`w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-between transition-all border shadow-lg ${
                hasSaveData()
                  ? "bg-emerald-500 hover:bg-emerald-400 border-emerald-400 text-white hover:scale-[1.02] hover:shadow-emerald-500/10 active:scale-[0.98]"
                  : "bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Lanjutkan Game</span>
              <ChevronRight size={16} />
            </button>

            {/* NEW GAME */}
            <button
              onClick={() => {
                if (!hasSaveData() || window.confirm("Mulai game baru akan menghapus progres tersimpan saat ini. Lanjutkan?")) {
                  actions.reset();
                  setScreen("gameplay");
                }
              }}
              className="w-full py-4 px-6 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 text-slate-100 hover:text-emerald-400 hover:border-emerald-500/60 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              <span>Mulai Baru</span>
              <ChevronRight size={16} />
            </button>

            {/* GAME AUTHOR */}
            <button
              onClick={() => setScreen("author")}
              className="w-full py-4 px-6 bg-slate-950/80 hover:bg-slate-900/80 border border-slate-800/80 text-slate-400 hover:text-sky-400 hover:border-sky-500/50 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              <span className="flex items-center gap-1.5">
                <User size={14} /> Pembuat Game
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-slate-500 font-mono tracking-wider mb-2">
          v1.2.0 · Hak Cipta Dilindungi
        </div>
      </div>
    );
  }

  // 2. AUTHOR INFORMATION SCREEN
  if (screen === "author") {
    return (
      <div
        className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 relative select-none"
        style={{
          backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)), url('/growroom_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-8 max-w-md w-full shadow-2xl relative backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setScreen("menu")}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-500/10">
              <User size={30} />
            </div>
            <h2 className="text-2xl font-black text-slate-100 font-[Outfit] tracking-wide uppercase">
              Nicholas Abel
            </h2>
            <p className="text-[10px] tracking-widest uppercase font-mono text-emerald-400 mt-1">
              Lead Simulation Architect
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-slate-850 pt-5 font-sans">
            <p>
              Halo! Saya <strong>Nicholas Abel</strong>, pengembang di balik <strong>Botany Sunshine</strong>. 
            </p>
            <p>
              Proyek ini dirancang sebagai gabungan dari modul dokumentasi Finite State Machine (FSM) terperinci dengan game simulasi pertanian hidroponik NFT yang interaktif dan responsif.
            </p>
            <p className="text-xs text-slate-400">
              Pengembangan menggunakan React, Tailwind CSS, Lucide icons, dan FastAPI untuk backend status logging.
            </p>
          </div>

          <button
            onClick={() => setScreen("menu")}
            className="w-full mt-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-md shadow-emerald-500/10"
          >
            Kembali ke Menu
          </button>
        </div>
      </div>
    );
  }

  // 3. GAMEPLAY SCREEN
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
              <button
                onClick={() => setScreen("menu")}
                className="text-[10px] text-sky-400 flex items-center gap-1 hover:text-sky-300 transition-colors"
              >
                ← Menu Utama
              </button>
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

          {/* Action Dock with 4 main action buttons */}
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
