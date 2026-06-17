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
    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-up backdrop-blur-sm"
    onClick={onClose}
    data-testid={testId}
  >
    <div
      className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

const Header = ({ title, icon, onClose }) => (
  <div className="sticky top-0 bg-slate-950/90 border-b border-slate-800 p-5 flex items-center justify-between rounded-t-3xl z-10">
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-lg font-black text-slate-100 font-[Outfit] uppercase tracking-wider">{title}</h2>
    </div>
    <button
      onClick={onClose}
      data-testid="modal-close"
      className="w-9 h-9 rounded-xl hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
    >
      <X size={18} />
    </button>
  </div>
);

export const SlotModal = ({ slot, state, actions, onClose }) => {
  const [selectedSeed, setSelectedSeed] = useState(null);
  const seed = slot.seedId ? getSeed(slot.seedId) : null;
  const availableSeeds = Object.entries(state.inventory.seeds || {}).filter(([, q]) => q > 0);

  const abMixes = [
    { id: "abmix_daun", name: "AB Mix Daun", color: "#10b981" },
    { id: "abmix_buah", name: "AB Mix Buah", color: "#f59e0b" },
    { id: "abmix_stroberi", name: "AB Mix Stroberi", color: "#f43f5e" }
  ];

  return (
    <Backdrop onClose={onClose} testId="slot-modal">
      <Header
        title={`Status Slot #${slot.id + 1}`}
        icon={<Sprout size={20} className="text-emerald-400 animate-pulse" />}
        onClose={onClose}
      />
      <div className="p-6 text-slate-200">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <Stat label="Status" value={slot.status.toUpperCase()} color={
            slot.status === "wilted" ? "#EF4444" : 
            slot.status === "mature" ? "#F59E0B" : 
            slot.status === "growing" ? "#10B981" : "#94A3B8"
          } />
          <Stat label="Level Air" value={`${Math.round(slot.water)}%`} color="#38bdf8" />
          <Stat label="Nutrisi" value={`${Math.round(slot.nutrient)} PPM`} color="#a78bfa" />
          <Stat label="pH Air" value={slot.ph.toFixed(1)} color="#fbbf24" />
        </div>

        {/* Pump durability */}
        <div className="mb-5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Daya Tahan Pompa</span>
            <span className="font-mono font-bold text-slate-200">
              {Math.round(slot.durability)}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${slot.durability}%`,
                background: slot.durability < 30 ? "#ef4444" : "#10B981",
              }}
            />
          </div>
        </div>

        {/* Plant Details & Hydroponics Parameters */}
        {seed && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl animate-float">{seed.emoji}</span>
              <div>
                <p className="font-bold text-slate-100 text-base">{seed.name}</p>
                <p className="text-xs text-slate-400">
                  Pertumbuhan: <span className="text-emerald-400 font-bold">{Math.round(slot.growth)}%</span> — Hari ke-{state.day - (slot.plantedDay || 0) + 1} sejak tanam
                </p>
              </div>
            </div>
            
            {/* Technical Parameter Guide */}
            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
              <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">
                📋 Rekomendasi Parameter Hidroponik:
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span>pH Rentang:</span>
                  <span className="text-amber-400 font-bold">{seed.phMin} - {seed.phMax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nutrisi PPM:</span>
                  <span className="text-violet-400 font-bold">{seed.ppmMin} - {seed.ppmMax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Batas Air Min:</span>
                  <span className="text-sky-400 font-bold">{seed.waterToleranceMin}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Optimal Formula:</span>
                  <span className="text-emerald-400 font-bold">{getSupply(seed.optimalNutrientType)?.name}</span>
                </div>
              </div>
              
              {/* Active warnings */}
              {slot.nutrientType && slot.nutrientType !== seed.optimalNutrientType && (
                <p className="text-[10px] text-red-400 mt-2 bg-red-950/20 border border-red-900/50 p-2 rounded-lg font-semibold italic">
                  ⚠️ Salah Formula Nutrisi! Menggunakan {getSupply(slot.nutrientType)?.name} padahal {seed.name} membutuhkan {getSupply(seed.optimalNutrientType)?.name}. Kecepatan tumbuh terhambat 50%.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions grid */}
        <div className="grid grid-cols-2 gap-3">
          {slot.status === "broken" ? (
            <ActionBtn
              icon={<Wrench size={16} />}
              label="Perbaiki Pompa"
              onClick={() => { actions.repair(slot.id); onClose(); }}
              color="#F59E0B"
              testId="action-repair"
              disabled={!(state.inventory.supplies.spare_pump > 0)}
              hint={`Stok: ${state.inventory.supplies.spare_pump || 0}`}
            />
          ) : slot.status === "mature" ? (
            <ActionBtn
              icon={<Sprout size={16} />}
              label="🌾 Panen Tanaman!"
              onClick={() => { actions.harvest(slot.id); onClose(); }}
              color="#F97316"
              testId="action-harvest"
            />
          ) : slot.status === "empty" ? (
            <div className="col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tanam Bibit Baru:</p>
              {availableSeeds.length === 0 ? (
                <p className="text-xs text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-slate-800 italic">
                  Belum ada persediaan bibit. Kunjungi Toko untuk membeli.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableSeeds.map(([sid, q]) => {
                    const s = getSeed(sid);
                    return (
                      <button
                        key={sid}
                        data-testid={`plant-seed-${sid}`}
                        onClick={() => { actions.plant(slot.id, sid); onClose(); }}
                        className="p-3 bg-slate-950/60 border border-slate-800 hover:border-emerald-500 rounded-xl transition-all text-center hover:scale-[1.03]"
                      >
                        <div className="text-3xl mb-1">{s.emoji}</div>
                        <div className="text-xs font-bold text-slate-200">{s.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Stok: {q}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : slot.status === "wilted" ? (
            <>
              <ActionBtn
                icon={<Droplet size={16} />} label="Siram Air"
                onClick={() => actions.water(slot.id)} color="#0EA5E9" testId="action-water"
              />
              {/* Specific AB Mixes options */}
              <div className="col-span-2 grid grid-cols-3 gap-2 mt-2 border-t border-slate-850 pt-3">
                {abMixes.map((mix) => {
                  const qty = state.inventory.supplies[mix.id] || 0;
                  const isOptimal = seed && seed.optimalNutrientType === mix.id;
                  return (
                    <ActionBtn
                      key={mix.id}
                      icon={<FlaskConical size={14} />}
                      label={isOptimal ? `${mix.name} ⭐` : mix.name}
                      onClick={() => actions.fertilize(slot.id, mix.id)}
                      color={mix.color}
                      disabled={qty <= 0}
                      hint={`Stok: ${qty}`}
                      testId={`action-fertilize-${mix.id}`}
                    />
                  );
                })}
              </div>
              <div className="col-span-2 mt-2">
                <ActionBtn
                  icon={<Trash2 size={16} />} label="Bersihkan Slot (Buang Tanaman)"
                  onClick={() => { actions.clearDead(slot.id); onClose(); }} color="#EF4444"
                  testId="action-clear"
                />
              </div>
            </>
          ) : (
            <>
              <ActionBtn
                icon={<Droplet size={16} />} label="Siram Air"
                onClick={() => actions.water(slot.id)} color="#0EA5E9" testId="action-water"
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
              
              {/* Nutrient Feed Section */}
              <div className="col-span-2 grid grid-cols-3 gap-2 border-t border-slate-850 pt-3 mt-2">
                {abMixes.map((mix) => {
                  const qty = state.inventory.supplies[mix.id] || 0;
                  const isOptimal = seed && seed.optimalNutrientType === mix.id;
                  return (
                    <ActionBtn
                      key={mix.id}
                      icon={<FlaskConical size={14} />}
                      label={isOptimal ? `${mix.name} ⭐` : mix.name}
                      onClick={() => actions.fertilize(slot.id, mix.id)}
                      color={mix.color}
                      disabled={qty <= 0}
                      hint={`Stok: ${qty}`}
                      testId={`action-fertilize-${mix.id}`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Backdrop>
  );
};

const Stat = ({ label, value, color }) => (
  <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-3 text-center">
    <div className="text-[9px] tracking-widest uppercase text-slate-500 mb-1 font-bold">{label}</div>
    <div className="font-black text-sm font-mono" style={{ color }}>{value}</div>
  </div>
);

const ActionBtn = ({ icon, label, onClick, color, disabled, hint, testId }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    data-testid={testId}
    className="p-3 bg-slate-950/40 border-2 rounded-xl transition-all hover:bg-slate-900/50 hover:shadow-md disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed text-left hover:scale-[1.02]"
    style={{ borderColor: color, color }}
  >
    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
      {icon} {label}
    </div>
    {hint && <div className="text-[9px] text-slate-500 mt-1 font-mono">{hint}</div>}
  </button>
);

export const ShopModal = ({ state, actions, onClose }) => (
  <Backdrop onClose={onClose} testId="shop-modal">
    <Header title="Toko Benih & Nutrisi" icon={<ShoppingCart size={20} className="text-emerald-400 animate-pulse" />} onClose={onClose} />
    <div className="p-6 text-slate-200">
      <p className="text-xs font-black tracking-widest uppercase text-slate-500 mb-3">Benih Tanaman</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {SEEDS_CATALOG.map((s) => (
          <div key={s.id} className="border border-slate-800 bg-slate-950/40 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-4xl">{s.emoji}</span>
            <div className="flex-1">
              <p className="font-extrabold text-sm text-slate-100">{s.name}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Tumbuh: {s.growthDays} hari</p>
              <p className="text-[10px] text-emerald-400 font-mono">PPM: {s.ppmMin}-{s.ppmMax}</p>
              <p className="text-[10px] text-amber-500 font-mono font-bold mt-1">Rp{s.price} (Jual: Rp{s.sellPrice})</p>
            </div>
            <button
              onClick={() => actions.buySeed(s.id, 1)}
              disabled={state.money < s.price}
              data-testid={`buy-seed-${s.id}`}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
            >
              Beli
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-slate-500 mb-3">Larutan Nutrisi & Suku Cadang</p>
      <div className="grid grid-cols-2 gap-4">
        {SUPPLIES.map((s) => (
          <div key={s.id} className="border border-slate-800 bg-slate-950/40 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">{s.emoji}</span>
            <div className="flex-1">
              <p className="font-extrabold text-sm text-slate-100">{s.name}</p>
              <p className="text-[9px] text-slate-400 leading-tight mt-0.5">{s.description}</p>
              <p className="text-xs font-mono text-sky-400 font-bold mt-1">Rp{s.price}</p>
            </div>
            <button
              onClick={() => actions.buySupply(s.id, 1, s.price, s.name)}
              disabled={state.money < s.price}
              data-testid={`buy-supply-${s.id}`}
              className="bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
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
      <Header title="Pasar Jual Hasil Panen" icon={<Store size={20} className="text-orange-400" />} onClose={onClose} />
      <div className="p-6 text-slate-200">
        {harvestEntries.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Store size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm italic">Belum ada persediaan hasil panen untuk dijual.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {harvestEntries.map(([sid, qty]) => {
              const s = getSeed(sid);
              return (
                <div key={sid} className="border border-slate-800 bg-slate-950/40 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-4xl animate-bounce">{s.emoji}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-100">{s.name}</p>
                    <p className="text-xs text-slate-400">Jumlah Stok: {qty} ikat · Estimasi Harga: Rp{s.sellPrice}/ikat</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => actions.sell(sid, 1)}
                      data-testid={`sell-${sid}-1`}
                      className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
                    >
                      Jual 1
                    </button>
                    {qty > 1 && (
                      <button
                        onClick={() => actions.sell(sid, qty)}
                        data-testid={`sell-${sid}-all`}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
                      >
                        Semua
                      </button>
                    )}
                  </div>
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
      <Header title="Inventaris Penyimpanan" icon={<Package size={20} className="text-violet-400" />} onClose={onClose} />
      <div className="p-6 space-y-6 text-slate-200">
        <Section title="Benih / Bibit" empty="Loker Benih Kosong" entries={seedEntries} mapper={(id) => getSeed(id)} />
        <Section title="Nutrisi & Alat Tambahan" empty="Loker Perlengkapan Kosong" entries={supplyEntries} mapper={(id) => getSupply(id)} />
        <Section title="Hasil Panen" empty="Gudang Hasil Panen Kosong" entries={harvestEntries} mapper={(id) => getSeed(id)} />
      </div>
    </Backdrop>
  );
};

const Section = ({ title, empty, entries, mapper }) => (
  <div>
    <p className="text-xs font-black tracking-widest uppercase text-slate-500 mb-3">{title}</p>
    {entries.length === 0 ? (
      <p className="text-xs text-slate-500 italic bg-slate-950/40 p-3 rounded-xl border border-slate-900">{empty}</p>
    ) : (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {entries.map(([id, qty]) => {
          const item = mapper(id);
          if (!item) return null;
          return (
            <div key={id} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-3 text-center">
              <div className="text-3xl mb-1">{item.emoji}</div>
              <div className="text-xs font-extrabold text-slate-100">{item.name}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">x{qty}</div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export const SleepModal = ({ actions, onClose }) => (
  <Backdrop onClose={onClose} testId="sleep-modal">
    <Header title="Percepat Waktu (Tidur)" icon={<Moon size={20} className="text-indigo-400" />} onClose={onClose} />
    <div className="p-8 text-center text-slate-200">
      <div className="text-6xl mb-4 animate-bounce">😴</div>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
        Tidur akan memulihkan stamina Anda menjadi 100% dan mempercepat waktu langsung ke jam 06:00 pagi keesokan harinya.
        Sistem pompa air dan nutrisi akan tetap berjalan secara otomatis di latar belakang.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
        >
          Batal
        </button>
        <button
          onClick={() => { actions.sleep(); onClose(); }}
          data-testid="confirm-sleep"
          className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.97]"
        >
          Ya, Tidur
        </button>
      </div>
    </div>
  </Backdrop>
);
