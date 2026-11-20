<script setup>
import { ref, computed } from "vue";
import { TIERS } from "../lib/tiers";
import { estimatedTargetHp, maxStageForHp } from "../lib/estimate";
import { fmtExact, parseShorthand } from "../lib/format";
import { useLocale } from "../composables/useLocale";

const { localeTag, t } = useLocale();

const cardHpInput = ref("");
const cardAtkInput = ref("");

const cardHp = computed(() => parseShorthand(cardHpInput.value));
const cardAtk = computed(() => parseShorthand(cardAtkInput.value));

const targetHp = computed(() => estimatedTargetHp(cardHp.value, cardAtk.value));

const rows = computed(() => {
  if (!targetHp.value) return [];
  return Object.keys(TIERS)
    .map(Number)
    .sort((a, b) => a - b)
    .filter((id) => !TIERS[id].wip)
    .map((id) => ({
      id,
      label: TIERS[id].label,
      stage: maxStageForHp(TIERS[id].hp, targetHp.value),
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
        <span>{{ t("estimateCardHp") }}</span>
        <input v-model="cardHpInput" type="text" inputmode="decimal" :placeholder="t('estimatePlaceholder')" />
      </label>
      <label class="field">
        <span>{{ t("estimateCardAtk") }}</span>
        <input v-model="cardAtkInput" type="text" inputmode="decimal" :placeholder="t('estimatePlaceholder')" />
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
