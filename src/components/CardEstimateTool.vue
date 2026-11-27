<script setup>
import { ref, computed } from "vue";
import { TIERS, applyMutations } from "../lib/tiers";
import { maxStageForHp } from "../lib/estimate";
import { fmtExact, parseShorthand } from "../lib/format";
import { useLocale } from "../composables/useLocale";

const { localeTag, t } = useLocale();

const props = defineProps({
  swarmMutation: { type: Boolean, default: false },
  vanguardMutation: { type: Boolean, default: false },
});
const emit = defineEmits(["update:swarmMutation", "update:vanguardMutation"]);

const cardAtkInput = ref("");

// Hypothèse speedfarm : la carte élimine l'ennemi en un coup tant que sa vie <= cet ATK,
// donc la vie de la carte elle-même n'a aucun impact sur le stage atteignable.
const targetHp = computed(() => parseShorthand(cardAtkInput.value));

const rows = computed(() => {
  if (!targetHp.value) return [];
  return Object.keys(TIERS)
    .map(Number)
    .sort((a, b) => a - b)
    .filter((id) => !TIERS[id].wip)
    .map((id) => ({
      id,
      label: TIERS[id].label,
      stage: maxStageForHp(
        applyMutations(TIERS[id].hp, { swarm: props.swarmMutation, vanguard: props.vanguardMutation }),
        targetHp.value
      ),
    }));
});
</script>

<template>
  <section class="estimate" aria-labelledby="t-estimate">
    <div class="estimate-head">
      <h2 id="t-estimate">{{ t("estimateTitle") }}</h2>
      <span class="sub">{{ t("estimateSub") }}</span>
    </div>

    <div class="fields">
      <label class="field">
        <span>{{ t("estimateCardAtk") }}</span>
        <input v-model="cardAtkInput" type="text" inputmode="decimal" :placeholder="t('estimatePlaceholder')" />
      </label>
    </div>

    <div class="mutations" role="group" :aria-label="t('mutationsTitle')">
      <label class="mutation">
        <input
          type="checkbox"
          class="sr-only"
          :checked="swarmMutation"
          @change="emit('update:swarmMutation', $event.target.checked)"
        />
        <span class="box" aria-hidden="true"></span>
        <span>Swarm <small>{{ t("swarmDesc") }}</small></span>
      </label>
      <label class="mutation">
        <input
          type="checkbox"
          class="sr-only"
          :checked="vanguardMutation"
          @change="emit('update:vanguardMutation', $event.target.checked)"
        />
        <span class="box" aria-hidden="true"></span>
        <span>Vanguard <small>{{ t("vanguardDesc") }}</small></span>
      </label>
    </div>

    <div class="results" v-if="rows.length">
      <div v-for="row in rows" :key="row.id" class="result">
        <span class="result-tier">{{ row.label }}</span>
        <span class="result-stage">
          {{ row.stage > 0 ? "≈ " + fmtExact(row.stage, localeTag) : t("estimateTooWeak") }}
        </span>
      </div>
    </div>
    <p v-else class="placeholder">{{ t("estimateEmpty") }}</p>

    <p class="warning">{{ t("estimateWarning") }}</p>
  </section>
</template>

<style scoped>
.estimate { padding: 40px 40px 32px; display: flex; flex-direction: column; gap: 20px; }
.estimate-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.estimate-head h2 { font-size: 24px; }
.sub { font-size: 13px; color: var(--color-neutral-700); }

.fields { display: flex; gap: 16px; flex-wrap: wrap; }
.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; flex: 1; min-width: 160px; }
.field input {
  height: 44px; padding: 0 12px; font: 600 16px var(--font-body);
  background: var(--color-surface); color: var(--color-text);
  border: 1px solid var(--color-divider);
}
.field input::placeholder { color: var(--color-neutral-700); opacity: 0.7; }

.mutations { display: flex; gap: 20px; flex-wrap: wrap; }
.mutation { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; cursor: pointer; }
.mutation .sr-only { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.mutation .box {
  width: 18px; height: 18px; flex: none; margin-top: 1px;
  border: 2px solid var(--color-divider);
}
.mutation .sr-only:checked + .box {
  background: var(--color-accent);
  border-color: var(--color-accent);
  box-shadow: inset 0 0 0 3px var(--color-bg);
}
.mutation .sr-only:focus-visible + .box { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.mutation small { display: block; color: var(--color-neutral-700); font-size: 12px; }

.results { display: flex; flex-direction: column; border: 2px solid var(--color-text); }
.result {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 14px 18px; border-top: 2px solid var(--color-text);
}
.result:first-child { border-top: 0; }
.result-tier { font: 800 15px var(--font-heading); }
.result-stage { font: 800 18px var(--font-heading); color: var(--color-accent-700); }

.placeholder { margin: 0; font-size: 14px; color: var(--color-neutral-700); }

.warning {
  margin: 0; font-size: 13px; color: var(--color-neutral-800); line-height: 1.5; text-wrap: pretty;
  padding-top: 4px; border-top: 1px solid var(--color-divider-soft);
}

@media (max-width: 860px) {
  .estimate { padding: 28px 20px 24px; }
}
</style>
