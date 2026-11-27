import { ref, computed, watch } from "vue";
import { TIERS, applyMutations } from "../lib/tiers";

const STORAGE_KEY = "tower-tier";
const CHARM_STORAGE_KEY = "tower-climbers-charm";
const MASKED_MAN_CHARM_STORAGE_KEY = "tower-masked-man-charm";
const WORKSHOP_LEVEL_STORAGE_KEY = "tower-workshop-level";
const SWARM_MUTATION_STORAGE_KEY = "tower-mutation-swarm";
const VANGUARD_MUTATION_STORAGE_KEY = "tower-mutation-vanguard";

const CLIMBERS_CHARM_BONUS = 0.6;
const MASKED_MAN_CHARM_BONUS = 0.2;
const WORKSHOP_BONUS_PER_LEVEL = 0.025;
const WORKSHOP_LEVEL_MIN = 0;
const WORKSHOP_LEVEL_MAX = 20;

const AVAILABLE_TIERS = Object.keys(TIERS)
  .map(Number)
  .sort((a, b) => a - b)
  .map((id) => ({ id, wip: !!TIERS[id].wip }));

export function useTowerTier() {
  let initial = 1;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (TIERS[saved]) initial = +saved;
  } catch (e) {}

  let initialCharm = false;
  try {
    initialCharm = localStorage.getItem(CHARM_STORAGE_KEY) === "1";
  } catch (e) {}

  let initialMaskedManCharm = false;
  try {
    initialMaskedManCharm = localStorage.getItem(MASKED_MAN_CHARM_STORAGE_KEY) === "1";
  } catch (e) {}

  let initialWorkshopLevel = WORKSHOP_LEVEL_MIN;
  try {
    const saved = +localStorage.getItem(WORKSHOP_LEVEL_STORAGE_KEY);
    if (Number.isInteger(saved) && saved >= WORKSHOP_LEVEL_MIN && saved <= WORKSHOP_LEVEL_MAX) {
      initialWorkshopLevel = saved;
    }
  } catch (e) {}

  let initialSwarmMutation = false;
  try {
    initialSwarmMutation = localStorage.getItem(SWARM_MUTATION_STORAGE_KEY) === "1";
  } catch (e) {}

  let initialVanguardMutation = false;
  try {
    initialVanguardMutation = localStorage.getItem(VANGUARD_MUTATION_STORAGE_KEY) === "1";
  } catch (e) {}

  const tierId = ref(initial);
  const climbersCharm = ref(initialCharm);
  const maskedManCharm = ref(initialMaskedManCharm);
  const workshopLevel = ref(initialWorkshopLevel);
  const swarmMutation = ref(initialSwarmMutation);
  const vanguardMutation = ref(initialVanguardMutation);
  const tier = computed(() => TIERS[tierId.value]);

  const totalCardsBonus = computed(() =>
    (climbersCharm.value ? CLIMBERS_CHARM_BONUS : 0) +
    (maskedManCharm.value ? MASKED_MAN_CHARM_BONUS : 0) +
    workshopLevel.value * WORKSHOP_BONUS_PER_LEVEL
  );

  const cardsBonusPercent = computed(() => Math.round(totalCardsBonus.value * 1000) / 10);

  watch(tierId, (v) => {
    try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  });

  watch(climbersCharm, (v) => {
    try { localStorage.setItem(CHARM_STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  });

  watch(maskedManCharm, (v) => {
    try { localStorage.setItem(MASKED_MAN_CHARM_STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  });

  watch(workshopLevel, (v) => {
    try { localStorage.setItem(WORKSHOP_LEVEL_STORAGE_KEY, v); } catch (e) {}
  });

  watch(swarmMutation, (v) => {
    try { localStorage.setItem(SWARM_MUTATION_STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  });

  watch(vanguardMutation, (v) => {
    try { localStorage.setItem(VANGUARD_MUTATION_STORAGE_KEY, v ? "1" : "0"); } catch (e) {}
  });

  function resetSettings() {
    tierId.value = 1;
    climbersCharm.value = false;
    maskedManCharm.value = false;
    workshopLevel.value = WORKSHOP_LEVEL_MIN;
    swarmMutation.value = false;
    vanguardMutation.value = false;
  }

  const hp = (s) => {
    const fn = applyMutations(tier.value.hp, { swarm: swarmMutation.value, vanguard: vanguardMutation.value });
    return fn ? fn(s) : null;
  };
  // atkFromHp évite de recalculer hp(s) quand l'appelant l'a déjà sous la main.
  const atkFromHp = (h) => (h == null ? null : Math.floor(h / 2));
  const atk = (s) => atkFromHp(hp(s));
  const cards = (s) => {
    if (!tier.value.cards) return null;
    const base = tier.value.cards(s);
    return totalCardsBonus.value > 0 ? Math.floor(base * (1 + totalCardsBonus.value)) : base;
  };

  return {
    tierId,
    tier,
    availableTiers: AVAILABLE_TIERS,
    climbersCharm,
    maskedManCharm,
    workshopLevel,
    workshopLevelMin: WORKSHOP_LEVEL_MIN,
    workshopLevelMax: WORKSHOP_LEVEL_MAX,
    swarmMutation,
    vanguardMutation,
    cardsBonusPercent,
    hp,
    atk,
    atkFromHp,
    cards,
    resetSettings,
  };
}
