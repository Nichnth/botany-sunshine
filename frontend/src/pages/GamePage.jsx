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
    <div className="p-4 md:p-6 lg:p-8 animate-fade-up max-w-[1400px]">
      {/* Top status bar */}
      <div className="bg-white border border-[#D1FAE5] rounded-2xl p-4 mb-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#0EA5E9] flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#064E3B] font-[Outfit]">Botany Sunshine</h1>
              <Link
                to="/"
                className="text-[10px] text-[#0284C7] flex items-center gap-1 hover:underline"
              >
                <GitBranch size={10} /> Lihat FSM
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <StatusPill icon={<Coins size={14} />} label="Saldo" value={`Rp${state.money}`} color="#10B981" />
            <StatusPill icon={<Calendar size={14} />} label="Hari" value={state.day} color="#0EA5E9" />
            <StatusPill
              icon={<Clock size={14} />}
              label={timePhase.name}
              value={`${String(state.hour).padStart(2, "0")}:00 ${timePhase.emoji}`}
              color="#8B5CF6"
            />
            <StatusPill
              icon={<span className="text-base">{weather.emoji}</span>}
              label="Cuaca"
              value={weather.name}
              color="#F59E0B"
            />
            <StatusPill icon={<Zap size={14} />} label="Stamina" value={`${state.stamina}%`} color="#F97316" />

            <button
              onClick={actions.togglePause}
              data-testid="btn-pause"
              className="w-10 h-10 rounded-xl border-2 border-[#D1FAE5] hover:bg-[#F4F9F4] flex items-center justify-center text-[#064E3B]"
              title={state.paused ? "Lanjutkan" : "Jeda"}
            >
              {state.paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={() => {
                if (window.confirm("Reset semua progres game?")) actions.reset();
              }}
              data-testid="btn-reset"
              className="w-10 h-10 rounded-xl border-2 border-[#D1FAE5] hover:bg-[#FEE2E2] hover:border-[#EF4444] hover:text-[#EF4444] flex items-center justify-center text-[#4B5563]"
              title="Reset Game"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        {state.paused && (
          <div className="mt-3 bg-[#FEF3C7] text-[#92400E] text-xs font-semibold px-3 py-2 rounded-xl text-center">
            ⏸ Game dijeda — klik tombol play untuk melanjutkan
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Farm */}
        <div className="lg:col-span-2">
          <FarmGrid slots={state.slots} onSlotClick={setSelectedSlot} />

          {/* Action bar */}
          <div className="mt-5 grid grid-cols-4 gap-3">
            <ActionTile
              icon={<ShoppingCart size={20} />}
              label="Toko"
              onClick={() => setActiveModal("shop")}
              color="#10B981"
              testId="btn-shop"
            />
            <ActionTile
              icon={<Store size={20} />}
              label="Pasar"
              onClick={() => setActiveModal("market")}
              color="#F97316"
              testId="btn-market"
            />
            <ActionTile
              icon={<Package size={20} />}
              label="Inventaris"
              onClick={() => setActiveModal("inventory")}
              color="#8B5CF6"
              testId="btn-inventory"
            />
            <ActionTile
              icon={<Moon size={20} />}
              label="Tidur"
              onClick={() => setActiveModal("sleep")}
              color="#0284C7"
              testId="btn-sleep"
            />
          </div>
        </div>

        {/* Right column: Game log */}
        <div className="bg-white border border-[#D1FAE5] rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="font-bold text-[#064E3B] mb-3 font-[Outfit]">Aktivitas</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto" data-testid="game-log">
            {state.log.map((entry, idx) => (
              <div
                key={idx}
                className="text-xs text-[#4B5563] bg-[#F4F9F4] rounded-xl p-2.5 border border-[#E5F0E5]"
              >
                <div className="text-[9px] text-[#0284C7] font-mono mb-0.5">
                  H{entry.day} · {String(entry.hour).padStart(2, "0")}:00
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
    className="flex items-center gap-2 bg-[#F4F9F4] border border-[#D1FAE5] px-3 py-2 rounded-xl"
    data-testid={`status-${label.toLowerCase()}`}
  >
    <span style={{ color }}>{icon}</span>
    <div className="leading-tight">
      <div className="text-[9px] tracking-[0.15em] uppercase text-[#4B5563]">{label}</div>
      <div className="text-xs font-bold font-mono text-[#064E3B]">{value}</div>
    </div>
  </div>
);

const ActionTile = ({ icon, label, onClick, color, testId }) => (
  <button
    onClick={onClick}
    data-testid={testId}
    className="bg-white border-2 border-[#D1FAE5] hover:border-[currentColor] rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:shadow-md hover:-translate-y-0.5"
    style={{ color }}
  >
    {icon}
    <span className="text-xs font-bold">{label}</span>
  </button>
);

export default GamePage;
