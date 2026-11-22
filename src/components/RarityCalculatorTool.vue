<script setup>
import { ref, computed } from "vue";
import { abbr, parseShorthand } from "../lib/format";
import { computeRarityVariants } from "../lib/rarity";
import { useLocale } from "../composables/useLocale";

const { t } = useLocale();

const baseInput = ref("");
const baseDenominator = computed(() => parseShorthand(baseInput.value));
const variants = computed(() => computeRarityVariants(baseDenominator.value));

// border-image (nécessaire pour un dégradé) ignore border-radius dans tous les navigateurs :
// on simule le contour rond avec deux fonds superposés (clip padding-box + border-box).
function pillStyle(part) {
  if (part.gradient) {
    return {
      backgroundImage: `linear-gradient(var(--color-surface), var(--color-surface)), ${part.gradient}`,
      backgroundOrigin: "border-box",
      backgroundClip: "padding-box, border-box",
    };
  }
  return { borderColor: part.color };
}

// Le texte est dans un <span> séparé : le dégradé du texte (background-clip: text)
// ne peut pas partager le même élément que l'astuce de bordure ci-dessus.
function pillLabelStyle(part) {
  if (part.gradient) {
    return {
      backgroundImage: part.gradient,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    };
  }
  return { color: part.color };
}
</script>

<template>
  <section class="rarity" aria-labelledby="t-rarity">
    <div class="hero">
      <h2 id="t-rarity">{{ t("rarityTitle") }}</h2>

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
    </div>

    <div class="results" v-if="variants.length">
      <div v-for="v in variants" :key="v.name" class="result">
        <div class="pills">
          <span v-for="p in v.parts" :key="p.word" class="pill" :style="pillStyle(p)">
            <span class="pill-label" :style="pillLabelStyle(p)">{{ p.word }}</span>
          </span>
        </div>
        <span class="result-value">1 / {{ abbr(v.denominator) }}</span>
      </div>
    </div>
    <p v-else class="placeholder">{{ t("rarityEmpty") }}</p>
  </section>
</template>

<style scoped>
.rarity { display: flex; flex-direction: column; }

.hero {
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 28px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.hero h2 { font-size: 24px; }

.field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; max-width: 260px; color: inherit; }
.field small { color: inherit; opacity: 0.8; font-size: 12px; }

.base-row { display: flex; align-items: center; gap: 8px; }
.base-prefix { font: 700 16px var(--font-heading); opacity: 0.85; flex: none; }
.base-row input {
  flex: 1; height: 44px; padding: 0 12px; font: 700 16px var(--font-body);
  background: var(--color-bg); color: var(--color-text);
  border: 0;
}
.base-row input::placeholder { color: var(--color-neutral-700); opacity: 0.7; }

.results { display: flex; flex-direction: column; gap: 10px; padding: 24px 40px 32px; }
.result {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  flex-wrap: wrap; padding: 10px 18px; background: var(--color-surface);
}
.pills { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pill {
  display: inline-flex;
  padding: 7px 18px; border-radius: 999px; border: 2px solid transparent;
  background-color: var(--color-surface);
  white-space: nowrap;
}
.pill-label { font: 700 15px var(--font-heading); }
.result-value { font: 800 18px var(--font-heading); }

.placeholder { margin: 0; padding: 32px 40px; font-size: 14px; color: var(--color-neutral-700); }

@media (max-width: 860px) {
  .hero { padding: 22px 20px; }
  .results { padding: 20px 20px 24px; }
  .placeholder { padding: 24px 20px; }
}
</style>
