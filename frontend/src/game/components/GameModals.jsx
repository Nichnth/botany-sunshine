import React, { useState } from "react";
import {
  X,
  Droplet,
  FlaskConical,
  Wrench,
  Sprout,
  Trash2,
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  Store,
  Package,
  Moon,
} from "lucide-react";
import { SEEDS_CATALOG, SUPPLIES, getSeed, getSupply } from "../gameData";

const Backdrop = ({ children, onClose, testId }) => (
  <div
    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-up"
    onClick={onClose}
    data-testid={testId}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const Header = ({ title, icon, onClose }) => (
  <div className="sticky top-0 bg-white border-b border-[#D1FAE5] p-5 flex items-center justify-between rounded-t-2xl z-10">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-bold text-[#064E3B] font-[Outfit]">{title}</h2>
    </div>
    <button
      onClick={onClose}
      data-testid="modal-close"
      className="w-9 h-9 rounded-full hover:bg-[#F4F9F4] flex items-center justify-center"
    >
      <X size={18} />
    </button>
  </div>
);

export const SlotModal = ({ slot, state, actions, onClose }) => {
  const [selectedSeed, setSelectedSeed] = useState(null);
  const seed = slot.seedId ? getSeed(slot.seedId) : null;
  const availableSeeds = Object.entries(state.inventory.seeds || {}).filter(([, q]) => q > 0);

  return (
    <Backdrop onClose={onClose} testId="slot-modal">
      <Header
        title={`Slot #${slot.id + 1}`}
        icon={<Sprout size={20} className="text-[#10B981]" />}
        onClose={onClose}
      />
      <div className="p-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <Stat label="Status" value={slot.status} color="#10B981" />
          <Stat label="Air" value={`${Math.round(slot.water)}%`} color="#0EA5E9" />
          <Stat label="Nutrisi" value={`${Math.round(slot.nutrient)}%`} color="#8B5CF6" />
          <Stat label="pH" value={slot.ph.toFixed(1)} color="#F59E0B" />
        </div>
        <div className="mb-5 p-3 rounded-xl bg-[#F4F9F4] border border-[#D1FAE5]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#4B5563]">Daya Tahan Alat</span>
            <span className="font-mono font-bold text-[#064E3B]">
              {Math.round(slot.durability)}%
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${slot.durability}%`,
                background: slot.durability < 30 ? "#EF4444" : "#10B981",
              }}
            />
          </div>
        </div>

        {seed && (
          <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-[#DCFCE7] to-[#F4F9F4]">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{seed.emoji}</span>
              <div>
                <p className="font-bold text-[#064E3B]">{seed.name}</p>
                <p className="text-xs text-[#4B5563]">
                  Pertumbuhan: {Math.round(slot.growth)}% — Hari ke-{state.day - (slot.plantedDay || 0) + 1} sejak tanam
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          {slot.status === "broken" ? (
            <ActionBtn
              icon={<Wrench size={16} />}
              label="Perbaiki Alat"
              onClick={() => { actions.repair(slot.id); onClose(); }}
              color="#F59E0B"
              testId="action-repair"
              disabled={!(state.inventory.supplies.spare_pump > 0)}
              hint={`Stok: ${state.inventory.supplies.spare_pump || 0}`}
            />
          ) : slot.status === "mature" ? (
            <ActionBtn
              icon={<Sprout size={16} />}
              label="🌾 Panen Sekarang!"
              onClick={() => { actions.harvest(slot.id); onClose(); }}
              color="#F97316"
              testId="action-harvest"
            />
          ) : slot.status === "empty" ? (
            <div className="col-span-2">
              <p className="text-xs font-semibold text-[#064E3B] mb-2">Pilih bibit untuk ditanam:</p>
              {availableSeeds.length === 0 ? (
                <p className="text-xs text-[#4B5563] bg-[#FEE2E2] p-3 rounded-xl">
                  Belum ada bibit. Beli di Toko dulu.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {availableSeeds.map(([sid, q]) => {
                    const s = getSeed(sid);
                    return (
                      <button
                        key={sid}
                        data-testid={`plant-seed-${sid}`}
                        onClick={() => { actions.plant(slot.id, sid); onClose(); }}
                        className="p-3 rounded-xl border-2 border-[#D1FAE5] hover:border-[#10B981] hover:bg-[#F4F9F4] transition-all text-center"
                      >
                        <div className="text-2xl mb-1">{s.emoji}</div>
                        <div className="text-xs font-semibold">{s.name}</div>
                        <div className="text-[10px] text-[#4B5563]">x{q}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : slot.status === "wilted" ? (
            <>
              <ActionBtn
                icon={<Droplet size={16} />} label="Siram"
                onClick={() => actions.water(slot.id)} color="#0EA5E9" testId="action-water"
              />
              <ActionBtn
                icon={<FlaskConical size={16} />} label="Beri Nutrisi"
                onClick={() => actions.fertilize(slot.id)} color="#8B5CF6"
                disabled={!(state.inventory.supplies.abmix > 0)}
                hint={`Stok: ${state.inventory.supplies.abmix || 0}`} testId="action-fertilize"
              />
              <ActionBtn
                icon={<Trash2 size={16} />} label="Buang Tanaman"
                onClick={() => { actions.clearDead(slot.id); onClose(); }} color="#EF4444"
                testId="action-clear"
              />
            </>
          ) : (
            <>
              <ActionBtn
                icon={<Droplet size={16} />} label="Siram"
                onClick={() => actions.water(slot.id)} color="#0EA5E9" testId="action-water"
              />
              <ActionBtn
                icon={<FlaskConical size={16} />} label="Beri Nutrisi"
                onClick={() => actions.fertilize(slot.id)} color="#8B5CF6"
                disabled={!(state.inventory.supplies.abmix > 0)}
                hint={`Stok: ${state.inventory.supplies.abmix || 0}`} testId="action-fertilize"
              />
              <ActionBtn
                icon={<ArrowUp size={16} />} label="pH Up"
                onClick={() => actions.adjustPh(slot.id, "up")} color="#10B981"
                disabled={!(state.inventory.supplies.ph_up > 0)}
                hint={`Stok: ${state.inventory.supplies.ph_up || 0}`} testId="action-ph-up"
              />
              <ActionBtn
                icon={<ArrowDown size={16} />} label="pH Down"
                onClick={() => actions.adjustPh(slot.id, "down")} color="#F97316"
                disabled={!(state.inventory.supplies.ph_down > 0)}
                hint={`Stok: ${state.inventory.supplies.ph_down || 0}`} testId="action-ph-down"
              />
            </>
          )}
        </div>
      </div>
    </Backdrop>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="bg-[#F4F9F4] rounded-xl p-3 text-center">
    <div className="text-[9px] tracking-[0.15em] uppercase text-[#4B5563] mb-1">{label}</div>
    <div className="font-bold text-sm font-mono" style={{ color }}>{value}</div>
  </div>
);

const ActionBtn = ({ icon, label, onClick, color, disabled, hint, testId }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    data-testid={testId}
    className="p-3 rounded-xl border-2 transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed text-left"
    style={{ borderColor: color, color }}
  >
    <div className="flex items-center gap-2 font-semibold text-sm">
      {icon} {label}
    </div>
    {hint && <div className="text-[10px] text-[#4B5563] mt-0.5">{hint}</div>}
  </button>
);

export const ShopModal = ({ state, actions, onClose }) => (
  <Backdrop onClose={onClose} testId="shop-modal">
    <Header title="Toko Bibit & Nutrisi" icon={<ShoppingCart size={20} className="text-[#10B981]" />} onClose={onClose} />
    <div className="p-5">
      <p className="text-xs tracking-[0.2em] uppercase text-[#4B5563] mb-3">Bibit</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {SEEDS_CATALOG.map((s) => (
          <div key={s.id} className="border border-[#D1FAE5] rounded-xl p-4 flex items-center gap-3">
            <span className="text-4xl">{s.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#064E3B]">{s.name}</p>
              <p className="text-[10px] text-[#4B5563]">Tumbuh {s.growthDays} hari · Jual Rp{s.sellPrice}</p>
              <p className="text-xs font-mono text-[#0284C7] mt-1">Rp{s.price}</p>
            </div>
            <button
              onClick={() => actions.buySeed(s.id, 1)}
              disabled={state.money < s.price}
              data-testid={`buy-seed-${s.id}`}
              className="bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 text-white px-3 py-2 rounded-lg text-xs font-semibold"
            >
              Beli
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs tracking-[0.2em] uppercase text-[#4B5563] mb-3">Perlengkapan</p>
      <div className="grid grid-cols-2 gap-3">
        {SUPPLIES.map((s) => (
          <div key={s.id} className="border border-[#D1FAE5] rounded-xl p-4 flex items-center gap-3">
            <span className="text-3xl">{s.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-[#064E3B]">{s.name}</p>
              <p className="text-[10px] text-[#4B5563]">{s.description}</p>
              <p className="text-xs font-mono text-[#0284C7] mt-1">Rp{s.price}</p>
            </div>
            <button
              onClick={() => actions.buySupply(s.id, 1, s.price, s.name)}
              disabled={state.money < s.price}
              data-testid={`buy-supply-${s.id}`}
              className="bg-[#0EA5E9] hover:bg-[#0284C7] disabled:opacity-40 text-white px-3 py-2 rounded-lg text-xs font-semibold"
            >
              Beli
            </button>
          </div>
        ))}
      </div>
    </div>
  </Backdrop>
);

export const MarketModal = ({ state, actions, onClose }) => {
  const harvestEntries = Object.entries(state.inventory.harvest || {}).filter(([, q]) => q > 0);
  return (
    <Backdrop onClose={onClose} testId="market-modal">
      <Header title="Pasar — Jual Panen" icon={<Store size={20} className="text-[#F97316]" />} onClose={onClose} />
      <div className="p-5">
        {harvestEntries.length === 0 ? (
          <div className="text-center py-12 text-[#4B5563]">
            <Store size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada hasil panen untuk dijual.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {harvestEntries.map(([sid, qty]) => {
              const s = getSeed(sid);
              return (
                <div key={sid} className="border border-[#D1FAE5] rounded-xl p-4 flex items-center gap-3">
                  <span className="text-4xl">{s.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#064E3B]">{s.name}</p>
                    <p className="text-xs text-[#4B5563]">Stok: {qty} · Harga pasar Rp{s.sellPrice} (±20%)</p>
                  </div>
                  <button
                    onClick={() => actions.sell(sid, 1)}
                    data-testid={`sell-${sid}-1`}
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white px-3 py-2 rounded-lg text-xs font-semibold"
                  >
                    Jual 1
                  </button>
                  {qty > 1 && (
                    <button
                      onClick={() => actions.sell(sid, qty)}
                      data-testid={`sell-${sid}-all`}
                      className="bg-[#10B981] hover:bg-[#059669] text-white px-3 py-2 rounded-lg text-xs font-semibold"
                    >
                      Jual Semua
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Backdrop>
  );
};

export const InventoryModal = ({ state, onClose }) => {
  const seedEntries = Object.entries(state.inventory.seeds || {}).filter(([, q]) => q > 0);
  const supplyEntries = Object.entries(state.inventory.supplies || {}).filter(([, q]) => q > 0);
  const harvestEntries = Object.entries(state.inventory.harvest || {}).filter(([, q]) => q > 0);
  return (
    <Backdrop onClose={onClose} testId="inventory-modal">
      <Header title="Inventaris" icon={<Package size={20} className="text-[#8B5CF6]" />} onClose={onClose} />
      <div className="p-5 space-y-5">
        <Section title="Bibit" empty="Kosong" entries={seedEntries} mapper={(id) => getSeed(id)} />
        <Section title="Perlengkapan" empty="Kosong" entries={supplyEntries} mapper={(id) => getSupply(id)} />
        <Section title="Hasil Panen" empty="Kosong" entries={harvestEntries} mapper={(id) => getSeed(id)} />
      </div>
    </Backdrop>
  );
};

const Section = ({ title, empty, entries, mapper }) => (
  <div>
    <p className="text-xs tracking-[0.2em] uppercase text-[#4B5563] mb-3">{title}</p>
    {entries.length === 0 ? (
      <p className="text-xs text-[#4B5563] italic">{empty}</p>
    ) : (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {entries.map(([id, qty]) => {
          const item = mapper(id);
          if (!item) return null;
          return (
            <div key={id} className="bg-[#F4F9F4] rounded-xl p-3 text-center border border-[#D1FAE5]">
              <div className="text-3xl mb-1">{item.emoji}</div>
              <div className="text-xs font-bold text-[#064E3B]">{item.name}</div>
              <div className="text-[10px] text-[#4B5563]">x{qty}</div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export const SleepModal = ({ actions, onClose }) => (
  <Backdrop onClose={onClose} testId="sleep-modal">
    <Header title="Tidur" icon={<Moon size={20} className="text-[#8B5CF6]" />} onClose={onClose} />
    <div className="p-8 text-center">
      <div className="text-6xl mb-4 animate-float">😴</div>
      <p className="text-sm text-[#4B5563] mb-6 leading-relaxed">
        Tidur akan memulihkan stamina ke 100% dan melewatkan waktu hingga pagi pukul 06:00.
        Tanaman akan terus bertumbuh, jadi pastikan kondisinya optimal.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="border-2 border-[#D1FAE5] text-[#4B5563] px-6 py-3 rounded-xl font-semibold"
        >
          Batal
        </button>
        <button
          onClick={() => { actions.sleep(); onClose(); }}
          data-testid="confirm-sleep"
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold"
        >
          Ya, Tidur
        </button>
      </div>
    </div>
  </Backdrop>
);
