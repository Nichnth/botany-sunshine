/**
 * Konstanta & data untuk Game Simulasi Hydroponic Farming
 */

export const SEEDS_CATALOG = [
  { id: "selada", name: "Selada", emoji: "🥬", price: 15, growthDays: 4, sellPrice: 35, color: "#86EFAC" },
  { id: "bayam", name: "Bayam", emoji: "🌿", price: 12, growthDays: 3, sellPrice: 28, color: "#4ADE80" },
  { id: "kangkung", name: "Kangkung", emoji: "🥦", price: 10, growthDays: 3, sellPrice: 22, color: "#22C55E" },
  { id: "pakcoy", name: "Pakcoy", emoji: "🥗", price: 18, growthDays: 5, sellPrice: 45, color: "#84CC16" },
  { id: "tomat", name: "Tomat Cherry", emoji: "🍅", price: 35, growthDays: 8, sellPrice: 120, color: "#EF4444" },
  { id: "strawberry", name: "Strawberry", emoji: "🍓", price: 60, growthDays: 12, sellPrice: 240, color: "#F43F5E" },
];

export const SUPPLIES = [
  { id: "abmix", name: "AB Mix Nutrisi", emoji: "🧪", price: 25, description: "Untuk meracik larutan nutrisi" },
  { id: "ph_up", name: "pH Up", emoji: "💧", price: 15, description: "Menaikkan pH larutan" },
  { id: "ph_down", name: "pH Down", emoji: "🧴", price: 15, description: "Menurunkan pH larutan" },
  { id: "spare_pump", name: "Suku Cadang Pompa", emoji: "🔧", price: 50, description: "Untuk perbaikan pompa" },
];

export const WEATHERS = [
  { id: "sunny", name: "Cerah", emoji: "☀️", growthMod: 1.0, waterDrain: 1.2 },
  { id: "cloudy", name: "Berawan", emoji: "⛅", growthMod: 0.9, waterDrain: 0.8 },
  { id: "rainy", name: "Hujan", emoji: "🌧️", growthMod: 0.8, waterDrain: 0.5 },
  { id: "stormy", name: "Badai", emoji: "⛈️", growthMod: 0.6, waterDrain: 0.4 },
];

export const SLOT_COUNT = 12; // 4x3 grid
export const TICK_INTERVAL_MS = 2500; // 1 game-hour = 2.5 real seconds
export const HOURS_PER_DAY = 24;
export const STARTING_MONEY = 200;
export const SEED_COST_TIME = 1; // hours to plant
export const HARVEST_REWARD_MULT = 1.0;

export const GAME_KEY = "hidrofarm_save_v1";

export const initialGameState = () => ({
  money: STARTING_MONEY,
  day: 1,
  hour: 6, // start at 6 AM
  weather: "sunny",
  stamina: 100,
  slots: Array.from({ length: SLOT_COUNT }, (_, i) => ({
    id: i,
    status: "empty", // empty | seeded | growing | mature | wilted | broken
    seedId: null,
    growth: 0, // 0-100 (100 = ready to harvest)
    water: 80,
    nutrient: 60,
    ph: 6.0,
    durability: 100, // slot equipment health
    plantedDay: null,
  })),
  inventory: {
    seeds: {}, // {seedId: qty}
    supplies: {}, // {supplyId: qty}
    harvest: {}, // {seedId: qty}
  },
  log: [
    { day: 1, hour: 6, text: "Selamat datang di farm hidroponikmu! Beli bibit di toko untuk mulai." },
  ],
  paused: false,
});

export const getTimePhase = (hour) => {
  if (hour >= 5 && hour < 7) return { name: "Fajar", emoji: "🌅" };
  if (hour >= 7 && hour < 11) return { name: "Pagi", emoji: "🌞" };
  if (hour >= 11 && hour < 14) return { name: "Siang", emoji: "☀️" };
  if (hour >= 14 && hour < 18) return { name: "Sore", emoji: "🌤️" };
  if (hour >= 18 && hour < 20) return { name: "Senja", emoji: "🌇" };
  return { name: "Malam", emoji: "🌙" };
};

export const getSeed = (id) => SEEDS_CATALOG.find((s) => s.id === id);
export const getSupply = (id) => SUPPLIES.find((s) => s.id === id);
export const getWeather = (id) => WEATHERS.find((w) => w.id === id);
