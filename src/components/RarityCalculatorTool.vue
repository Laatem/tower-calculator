<script setup>
import { ref, computed } from "vue";
import { abbr, parseShorthand } from "../lib/format";
import { computeRarityVariants } from "../lib/rarity";
import { useLocale } from "../composables/useLocale";

const { t } = useLocale();

const baseInput = ref("");
const baseDenominator = computed(() => parseShorthand(baseInput.value));
const variants = computed(() => computeRarityVariants(baseDenominator.value));
</script>

<template>
  <section class="rarity" aria-labelledby="t-rarity">
    <div class="rarity-head">
      <h2 id="t-rarity">{{ t("rarityTitle") }}</h2>
    </div>

    <label class="field">
      <span>{{ t("rarityBaseLabel") }} <small>{{ t("rarityBaseSuffix") }}</small></span>
      <div class="base-row">
        <span class="base-prefix">1 /</span>
        <input
          v-model="baseInput"
          type="text"
          inputmode="decimal"
          :placeholder="t('rarityBasePlaceholder')"
        />
      </div>
    </label>

    <div class="results" v-if="variants.length">
      <div v-for="v in variants" :key="v.name" class="result">
        <span class="result-name">{{ v.name }}</span>
        <span class="result-value">1 / {{ abbr(v.denominator) }}</span>
      </div>
    </div>
    <p v-else class="placeholder">{{ t("rarityEmpty") }}</p>
  </section>
</template>

<style scoped>
.rarity { padding: 40px 40px 32px; display: flex; flex-direction: column; gap: 20px; }
.rarity-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.rarity-head h2 { font-size: 24px; }

.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; max-width: 260px; }
.field small { color: var(--color-neutral-700); font-size: 12px; }

.base-row { display: flex; align-items: center; gap: 8px; }
.base-prefix { font: 700 16px var(--font-heading); color: var(--color-neutral-700); flex: none; }
.base-row input {
  flex: 1; height: 44px; padding: 0 12px; font: 600 16px var(--font-body);
  background: var(--color-surface); color: var(--color-text);
  border: 1px solid var(--color-divider);
}
.base-row input::placeholder { color: var(--color-neutral-700); opacity: 0.7; }

.results { display: flex; flex-direction: column; border: 2px solid var(--color-text); }
.result {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 14px 18px; border-top: 2px solid var(--color-text);
}
.result:first-child { border-top: 0; }
.result-name { font: 800 15px var(--font-heading); }
.result-value { font: 800 18px var(--font-heading); color: var(--color-accent-700); }

.placeholder { margin: 0; font-size: 14px; color: var(--color-neutral-700); }

@media (max-width: 860px) {
  .rarity { padding: 28px 20px 24px; }
}
</style>
