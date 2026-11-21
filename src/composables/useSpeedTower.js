import { ref, computed, watch } from "vue";

const WORKSHOP_SPEED_STORAGE_KEY = "tower-workshop-speed-level";
const POTION_V_STORAGE_KEY = "tower-potion-v";
const BASE_SPEED_STORAGE_KEY = "tower-base-speed";

const WORKSHOP_SPEED_BONUS_PER_LEVEL = 0.015;
const WORKSHOP_SPEED_LEVEL_MIN = 0;
const WORKSHOP_SPEED_LEVEL_MAX = 20;
const CLIMBERS_CHARM_SPEED_BONUS = 0.6;
const MASKED_MAN_SPEED_BONUS = 0.3;
const POTION_V_SPEED_BONUS = 0.4;

// climbersCharm/maskedManCharm sont les refs partagées avec useTowerTier : ces deux
// charmes boostent déjà les cartes, et donnent en plus un bonus de vitesse.
export function useSpeedTower(climbersCharm, maskedManCharm) {
  let initialLevel = WORKSHOP_SPEED_LEVEL_MIN;
  try {
    const saved = +localStorage.getItem(WORKSHOP_SPEED_STORAGE_KEY);
    if (Number.isInteger(saved) && saved >= WORKSHOP_SPEED_LEVEL_MIN && saved <= WORKSHOP_SPEED_LEVEL_MAX) {
      initialLevel = saved;
    }
  } catch (e) {}

  let initialPotionV = false;
  try {
    initialPotionV = localStorage.getItem(POTION_V_STORAGE_KEY) === "1";
  } catch (e) {}

  let initialBaseSpeed = "10";
  try {
    const saved = localStorage.getItem(BASE_SPEED_STORAGE_KEY);
    if (saved != null && saved !== "") initialBaseSpeed = saved;
  } catch (e) {}

  const workshopSpeedLevel = ref(initialLevel);
  const potionV = ref(initialPotionV);
  const baseSpeedInput = ref(initialBaseSpeed);

  const baseSpeed = computed(() => {
    const s = String(baseSpeedInput.value ?? "").trim().replace(",", ".");
    if (!s) return null;
    const v = parseFloat(s);
    return Number.isFinite(v) && v > 0 ? v : null;
  });

  const totalSpeedBonus = computed(() =>
    workshopSpeedLevel.value * WORKSHOP_SPEED_BONUS_PER_LEVEL +
    (climbersCharm.value ? CLIMBERS_CHARM_SPEED_BONUS : 0) +
    (maskedManCharm.value ? MASKED_MAN_SPEED_BONUS : 0) +
    (potionV.value ? POTION_V_SPEED_BONUS : 0)
  );

  const speedBonusPercent = computed(() => Math.round(totalSpeedBonus.value * 1000) / 10);

  watch(workshopSpeedLevel, (v) => {
    try { localStorage.setItem(WORKSHOP_SPEED_STORAGE_KEY, v); } catch (e) {}
  });

  watch(potionV, (v) => {
    try { localStorage.setItem(POTION_V_STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  });

  watch(baseSpeedInput, (v) => {
    try { localStorage.setItem(BASE_SPEED_STORAGE_KEY, v ?? ""); } catch (e) {}
  });

  const effectiveSpeed = computed(() =>
    baseSpeed.value != null ? baseSpeed.value * (1 + totalSpeedBonus.value) : null
  );

  const effectiveSpeedLabel = computed(() => {
    if (effectiveSpeed.value == null) return null;
    const rounded = Math.round(effectiveSpeed.value * 100) / 100;
    return "×" + rounded.toLocaleString(undefined, { maximumFractionDigits: 2 });
  });

  function resetSpeedSettings() {
    workshopSpeedLevel.value = WORKSHOP_SPEED_LEVEL_MIN;
    potionV.value = false;
    baseSpeedInput.value = "10";
  }

  return {
    workshopSpeedLevel,
    workshopSpeedLevelMin: WORKSHOP_SPEED_LEVEL_MIN,
    workshopSpeedLevelMax: WORKSHOP_SPEED_LEVEL_MAX,
    potionV,
    baseSpeedInput,
    totalSpeedBonus,
    speedBonusPercent,
    effectiveSpeed,
    effectiveSpeedLabel,
    resetSpeedSettings,
  };
}
