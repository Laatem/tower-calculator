<script setup>
import { ref, computed } from "vue";
import { parsePairs, computeRegressions } from "../lib/regression";
import { useLocale } from "../composables/useLocale";

const { t } = useLocale();

const raw = ref("");
const points = computed(() => parsePairs(raw.value));
const results = computed(() => computeRegressions(points.value));
</script>

<template>
  <div class="recalib">
    <p class="help">{{ t("recalibHelp") }}</p>
    <textarea v-model="raw" :placeholder="t('recalibPlaceholder')" rows="5"></textarea>

    <p v-if="raw.trim() && !points.length" class="empty">{{ t("recalibEmpty") }}</p>
    <p v-else-if="points.length" class="count">{{ t("recalibPointsCount", { n: points.length }) }}</p>

    <div v-if="results.length" class="results">
      <div v-for="(r, i) in results" :key="r.name" class="result" :class="{ best: i === 0 }">
        <div class="result-head">
          <strong>{{ r.name }}</strong>
          <span v-if="i === 0" class="best-tag">{{ t("recalibBest") }}</span>
          <span class="err">{{ t("recalibError", { avg: r.avgErrorPercent.toFixed(2), max: r.maxErrorPercent.toFixed(2) }) }}</span>
        </div>
        <code>{{ r.formula }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recalib { display: flex; flex-direction: column; gap: 10px; padding: 16px 32px 20px; border-top: 1px solid var(--color-divider-soft); }
.help { margin: 0; font-size: 12px; color: var(--color-neutral-700); }
textarea {
  width: 100%; resize: vertical; padding: 10px 12px; font: 600 13px var(--font-body);
  background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-divider);
}
.count, .empty { margin: 0; font-size: 12px; color: var(--color-neutral-700); }

.results { display: flex; flex-direction: column; gap: 8px; }
.result { padding: 10px 12px; border: 1px solid var(--color-divider); display: flex; flex-direction: column; gap: 4px; }
.result.best { border-color: var(--color-accent); }
.result-head { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-size: 13px; }
.best-tag { font: 700 11px var(--font-heading); color: var(--color-accent-700); text-transform: uppercase; letter-spacing: 0.04em; }
.err { margin-left: auto; font-size: 12px; color: var(--color-neutral-700); }
code { font-size: 12px; overflow-wrap: anywhere; color: var(--color-accent-700); }

@media (max-width: 860px) {
  .recalib { padding: 14px 20px 18px; }
}
</style>
