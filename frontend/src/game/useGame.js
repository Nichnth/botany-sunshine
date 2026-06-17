import { useEffect, useReducer, useCallback, useRef } from "react";
import {
  GAME_KEY,
  TICK_INTERVAL_MS,
  HOURS_PER_DAY,
  WEATHERS,
  getSeed,
  initialGameState,
  getWeather,
  getSupply,
} from "./gameData";

const loadState = () => {
  try {
    const saved = localStorage.getItem(GAME_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return initialGameState();
};

const saveState = (state) => {
  try {
    localStorage.setItem(GAME_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
};

const addLog = (state, text) => {
  const entry = { day: state.day, hour: state.hour, text };
  const log = [entry, ...state.log].slice(0, 30);
  return { ...state, log };
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TICK": {
      // Advance 1 hour
      let nextHour = state.hour + 1;
      let nextDay = state.day;
      if (nextHour >= HOURS_PER_DAY) {
        nextHour = 0;
        nextDay += 1;
      }

      const weatherDef = getWeather(state.weather);
      const waterDrain = weatherDef.waterDrain;

      // Random weather change every 6 hours
      let nextWeather = state.weather;
      if (nextHour % 6 === 0) {
        const wOptions = WEATHERS.map((w) => w.id);
        nextWeather = wOptions[Math.floor(Math.random() * wOptions.length)];
      }

      // Update slots
      const slots = state.slots.map((slot) => {
        if (slot.status === "empty" || slot.status === "broken") return slot;

        // Drain resources (water percentage and PPM)
        const newWater = Math.max(0, slot.water - 3 * waterDrain);
        const newNutrient = Math.max(0, slot.nutrient - 15); // Consume 15 PPM per tick
        const phDrift = (Math.random() - 0.5) * 0.1;
        const newPh = Math.max(3.5, Math.min(8.5, slot.ph + phDrift));

        // Random durability loss
        const durLoss = Math.random() < 0.04 ? 2 : 0;
        const newDur = Math.max(0, slot.durability - durLoss);

        let status = slot.status;
        let growth = slot.growth;

        // Growth conditions evaluated dynamically against specific plant guides
        const seed = getSeed(slot.seedId);
        const totalGrowthNeeded = seed ? seed.growthDays * 24 : 100;
        
        let optimalConditions = false;
        let wiltConditions = false;
        let isOptimalNutrientType = true;

        if (seed) {
          isOptimalNutrientType = slot.nutrientType === seed.optimalNutrientType;
          
          optimalConditions =
            newWater >= seed.waterToleranceMin &&
            newNutrient >= seed.ppmMin &&
            newNutrient <= seed.ppmMax &&
            newPh >= seed.phMin &&
            newPh <= seed.phMax &&
            newDur > 0;
            
          wiltConditions =
            newWater < (seed.waterToleranceMin / 2) ||
            newNutrient < (seed.ppmMin / 2) ||
            newNutrient > (seed.ppmMax * 1.5) || // Nutrient burn
            newPh < (seed.phMin - 0.8) ||
            newPh > (seed.phMax + 0.8) ||
            newDur === 0;
        } else {
          optimalConditions = newWater > 30 && newDur > 0;
        }

        if (optimalConditions && status !== "mature" && status !== "wilted") {
          // Growth per hour (speed is halved if using the wrong nutrient type)
          const speedFactor = isOptimalNutrientType ? 1.0 : 0.5;
          growth = Math.min(100, growth + (100 / totalGrowthNeeded) * weatherDef.growthMod * speedFactor);
          if (growth >= 100) {
            status = "mature";
          } else if (growth >= 25) {
            status = "growing";
          }
        }

        if (wiltConditions && status !== "mature") {
          status = "wilted";
        } else if (!wiltConditions && status === "wilted") {
          // Recover if conditions improve
          status = growth >= 25 ? "growing" : "seeded";
        }

        // Random equipment break
        let nextStatus = status;
        if (newDur === 0 && status !== "broken") {
          nextStatus = "broken";
        }

        return {
          ...slot,
          water: newWater,
          nutrient: newNutrient,
          ph: parseFloat(newPh.toFixed(2)),
          durability: newDur,
          growth,
          status: nextStatus,
        };
      });

      // Stamina recover during night, drain during day
      let stamina = state.stamina;
      if (nextHour >= 22 || nextHour <= 5) {
        stamina = Math.min(100, stamina + 5);
      }

      let newState = {
        ...state,
        hour: nextHour,
        day: nextDay,
        weather: nextWeather,
        slots,
        stamina,
      };

      if (nextWeather !== state.weather) {
        const wDef = getWeather(nextWeather);
        newState = addLog(newState, `Cuaca berubah menjadi ${wDef.name} ${wDef.emoji}`);
      }
      if (nextDay !== state.day) {
        newState = addLog(newState, `🌅 Hari baru dimulai! Hari ke-${nextDay}`);
      }

      saveState(newState);
      return newState;
    }

    case "BUY_SEED": {
      const { seedId, qty } = action;
      const seed = getSeed(seedId);
      const cost = seed.price * qty;
      if (state.money < cost) {
        return addLog(state, `❌ Saldo tidak cukup untuk beli ${seed.name}`);
      }
      const inventory = {
        ...state.inventory,
        seeds: {
          ...state.inventory.seeds,
          [seedId]: (state.inventory.seeds[seedId] || 0) + qty,
        },
      };
      const newState = addLog(
        { ...state, money: state.money - cost, inventory },
        `🛒 Membeli ${qty}x ${seed.name} (-Rp${cost})`
      );
      saveState(newState);
      return newState;
    }

    case "BUY_SUPPLY": {
      const { supplyId, qty, price, name } = action;
      const cost = price * qty;
      if (state.money < cost) {
        return addLog(state, `❌ Saldo tidak cukup`);
      }
      const inventory = {
        ...state.inventory,
        supplies: {
          ...state.inventory.supplies,
          [supplyId]: (state.inventory.supplies[supplyId] || 0) + qty,
        },
      };
      const newState = addLog(
        { ...state, money: state.money - cost, inventory },
        `🛒 Membeli ${qty}x ${name} (-Rp${cost})`
      );
      saveState(newState);
      return newState;
    }

    case "PLANT": {
      const { slotId, seedId } = action;
      const seedQty = state.inventory.seeds[seedId] || 0;
      if (seedQty <= 0) return addLog(state, `❌ Bibit habis`);

      const slots = state.slots.map((s) =>
        s.id === slotId
          ? { ...s, status: "seeded", seedId, growth: 0, plantedDay: state.day, nutrientType: null }
          : s
      );
      const inventory = {
        ...state.inventory,
        seeds: { ...state.inventory.seeds, [seedId]: seedQty - 1 },
      };
      const seed = getSeed(seedId);
      const newState = addLog(
        { ...state, slots, inventory, stamina: Math.max(0, state.stamina - 3) },
        `🌱 Menanam ${seed.name} di slot #${slotId + 1}`
      );
      saveState(newState);
      return newState;
    }

    case "WATER": {
      const { slotId } = action;
      const slots = state.slots.map((s) =>
        s.id === slotId ? { ...s, water: Math.min(100, s.water + 40) } : s
      );
      const newState = addLog(
        { ...state, slots, stamina: Math.max(0, state.stamina - 2) },
        `💧 Menyiram slot #${slotId + 1}`
      );
      saveState(newState);
      return newState;
    }

    case "FERTILIZE": {
      const { slotId, supplyId } = action;
      const abQty = state.inventory.supplies[supplyId] || 0;
      if (abQty <= 0) {
        const name = getSupply(supplyId)?.name || "Nutrisi";
        return addLog(state, `❌ ${name} habis, beli di toko`);
      }
      
      const slots = state.slots.map((s) =>
        s.id === slotId 
          ? { ...s, nutrient: Math.min(3000, s.nutrient + 450), nutrientType: supplyId } 
          : s
      );
      const inventory = {
        ...state.inventory,
        supplies: { ...state.inventory.supplies, [supplyId]: abQty - 1 },
      };
      const supplyName = getSupply(supplyId)?.name || "Nutrisi";
      const newState = addLog(
        { ...state, slots, inventory, stamina: Math.max(0, state.stamina - 2) },
        `🧪 Memberi ${supplyName} ke slot #${slotId + 1} (+450 PPM)`
      );
      saveState(newState);
      return newState;
    }

    case "ADJUST_PH": {
      const { slotId, direction } = action;
      const supplyId = direction === "up" ? "ph_up" : "ph_down";
      const qty = state.inventory.supplies[supplyId] || 0;
      if (qty <= 0) return addLog(state, `❌ ${supplyId === "ph_up" ? "pH Up" : "pH Down"} habis`);
      const slots = state.slots.map((s) =>
        s.id === slotId
          ? { ...s, ph: parseFloat((s.ph + (direction === "up" ? 0.4 : -0.4)).toFixed(2)) }
          : s
      );
      const inventory = {
        ...state.inventory,
        supplies: { ...state.inventory.supplies, [supplyId]: qty - 1 },
      };
      const newState = addLog(
        { ...state, slots, inventory, stamina: Math.max(0, state.stamina - 1) },
        `⚗️ Menyesuaikan pH slot #${slotId + 1}`
      );
      saveState(newState);
      return newState;
    }

    case "REPAIR": {
      const { slotId } = action;
      const partQty = state.inventory.supplies.spare_pump || 0;
      if (partQty <= 0) return addLog(state, `❌ Suku cadang habis, beli di toko`);
      const slots = state.slots.map((s) =>
        s.id === slotId
          ? { ...s, durability: 100, status: s.seedId ? "growing" : "empty" }
          : s
      );
      const inventory = {
        ...state.inventory,
        supplies: { ...state.inventory.supplies, spare_pump: partQty - 1 },
      };
      const newState = addLog(
        { ...state, slots, inventory, stamina: Math.max(0, state.stamina - 5) },
        `🔧 Memperbaiki slot #${slotId + 1}`
      );
      saveState(newState);
      return newState;
    }

    case "HARVEST": {
      const { slotId } = action;
      const slot = state.slots.find((s) => s.id === slotId);
      if (!slot || slot.status !== "mature") return state;

      const slots = state.slots.map((s) =>
        s.id === slotId
          ? { ...s, status: "empty", seedId: null, growth: 0, plantedDay: null, nutrientType: null }
          : s
      );
      const inventory = {
        ...state.inventory,
        harvest: {
          ...state.inventory.harvest,
          [slot.seedId]: (state.inventory.harvest[slot.seedId] || 0) + 1,
        },
      };
      const seed = getSeed(slot.seedId);
      const newState = addLog(
        { ...state, slots, inventory, stamina: Math.max(0, state.stamina - 4) },
        `🌾 Panen 1x ${seed.name} dari slot #${slotId + 1}`
      );
      saveState(newState);
      return newState;
    }

    case "CLEAR_DEAD": {
      const { slotId } = action;
      const slots = state.slots.map((s) =>
        s.id === slotId
          ? { ...s, status: "empty", seedId: null, growth: 0, plantedDay: null, water: 80, nutrient: 200, ph: 6.0, nutrientType: null }
          : s
      );
      const newState = addLog(
        { ...state, slots },
        `🗑️ Membersihkan slot #${slotId + 1}`
      );
      saveState(newState);
      return newState;
    }

    case "SELL": {
      const { seedId, qty } = action;
      const have = state.inventory.harvest[seedId] || 0;
      if (have < qty) return state;
      const seed = getSeed(seedId);
      // Market price fluctuation ±20%
      const priceMod = 0.8 + Math.random() * 0.4;
      const totalPrice = Math.floor(seed.sellPrice * priceMod * qty);

      const inventory = {
        ...state.inventory,
        harvest: { ...state.inventory.harvest, [seedId]: have - qty },
      };
      const newState = addLog(
        { ...state, money: state.money + totalPrice, inventory },
        `💰 Menjual ${qty}x ${seed.name} (+Rp${totalPrice})`
      );
      saveState(newState);
      return newState;
    }

    case "SLEEP": {
      // Skip to next 6 AM, restore stamina
      let nextHour = 6;
      let nextDay = state.day + (state.hour >= 6 ? 1 : 0);
      const slots = state.slots.map((slot) => {
        if (slot.status === "empty" || slot.status === "broken") return slot;
        const seed = getSeed(slot.seedId);
        const totalGrowthNeeded = seed ? seed.growthDays * 24 : 100;
        
        // Simulate ~8 hours of growth
        const hours = state.hour >= 6 ? 24 - state.hour + 6 : 6 - state.hour;
        const waterDrain = 3 * hours;
        const nutDrain = 15 * hours; // 15 PPM per hour
        let newWater = Math.max(0, slot.water - waterDrain);
        let newNut = Math.max(0, slot.nutrient - nutDrain);
        
        let growth = slot.growth;
        let isOptimalNutrientType = !seed || slot.nutrientType === seed.optimalNutrientType;
        
        let optimalConditions = false;
        let wiltConditions = false;

        if (seed) {
          optimalConditions =
            newWater >= seed.waterToleranceMin &&
            newNut >= seed.ppmMin &&
            newNut <= seed.ppmMax &&
            slot.ph >= seed.phMin &&
            slot.ph <= seed.phMax;

          wiltConditions =
            newWater < (seed.waterToleranceMin / 2) ||
            newNut < (seed.ppmMin / 2) ||
            newNut > (seed.ppmMax * 1.5) ||
            slot.ph < (seed.phMin - 0.8) ||
            slot.ph > (seed.phMax + 0.8);
        }

        if (optimalConditions) {
          const speed = isOptimalNutrientType ? 1.0 : 0.5;
          growth = Math.min(100, growth + (100 / totalGrowthNeeded) * hours * speed);
        }
        
        let status = slot.status;
        if (growth >= 100) status = "mature";
        else if (wiltConditions) status = "wilted";
        
        return { ...slot, water: newWater, nutrient: newNut, growth, status };
      });
      
      const newState = addLog(
        { ...state, hour: nextHour, day: nextDay, stamina: 100, slots },
        `😴 Tidur hingga pagi. Stamina pulih.`
      );
      saveState(newState);
      return newState;
    }

    case "RESET": {
      const fresh = initialGameState();
      saveState(fresh);
      return fresh;
    }

    case "TOGGLE_PAUSE": {
      return { ...state, paused: !state.paused };
    }

    default:
      return state;
  }
};

export const useGame = () => {
  const [state, dispatch] = useReducer(reducer, null, loadState);
  const tickRef = useRef(null);

  useEffect(() => {
    if (state.paused) return;
    tickRef.current = setInterval(() => {
      dispatch({ type: "TICK" });
    }, TICK_INTERVAL_MS);
    return () => clearInterval(tickRef.current);
  }, [state.paused]);

  const actions = {
    buySeed: useCallback((seedId, qty = 1) => dispatch({ type: "BUY_SEED", seedId, qty }), []),
    buySupply: useCallback(
      (supplyId, qty = 1, price, name) =>
        dispatch({ type: "BUY_SUPPLY", supplyId, qty, price, name }),
      []
    ),
    plant: useCallback((slotId, seedId) => dispatch({ type: "PLANT", slotId, seedId }), []),
    water: useCallback((slotId) => dispatch({ type: "WATER", slotId }), []),
    fertilize: useCallback((slotId, supplyId) => dispatch({ type: "FERTILIZE", slotId, supplyId }), []),
    adjustPh: useCallback(
      (slotId, direction) => dispatch({ type: "ADJUST_PH", slotId, direction }),
      []
    ),
    repair: useCallback((slotId) => dispatch({ type: "REPAIR", slotId }), []),
    harvest: useCallback((slotId) => dispatch({ type: "HARVEST", slotId }), []),
    clearDead: useCallback((slotId) => dispatch({ type: "CLEAR_DEAD", slotId }), []),
    sell: useCallback((seedId, qty) => dispatch({ type: "SELL", seedId, qty }), []),
    sleep: useCallback(() => dispatch({ type: "SLEEP" }), []),
    reset: useCallback(() => dispatch({ type: "RESET" }), []),
    togglePause: useCallback(() => dispatch({ type: "TOGGLE_PAUSE" }), []),
  };

  return { state, actions };
};
