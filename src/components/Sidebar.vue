<script setup>
import { useLocale } from "../composables/useLocale";
import pkg from "../../package.json";

const { locale, setLocale, locales, localeTag, t } = useLocale();

const appVersion = pkg.version;

const props = defineProps({
  tierId: { type: Number, required: true },
  availableTiers: { type: Array, required: true },
  climbersCharm: { type: Boolean, required: true },
  maskedManCharm: { type: Boolean, required: true },
  workshopLevel: { type: Number, required: true },
  workshopLevelMin: { type: Number, default: 1 },
  workshopLevelMax: { type: Number, default: 20 },
  cardsBonusPercent: { type: Number, required: true },
  theme: { type: String, required: true },
  palette: { type: String, required: true },
  palettes: { type: Array, required: true },
});
const emit = defineEmits([
  "update:tierId",
  "update:climbersCharm",
  "update:maskedManCharm",
  "update:workshopLevel",
  "toggleTheme",
  "selectPalette",
  "reset",
]);

function fmtPercent(n) {
  return n.toLocaleString(localeTag.value, { maximumFractionDigits: 1 });
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <span>{{ t("brandLine1") }}</span>
      <span>{{ t("brandLine2") }}</span>
    </div>

    <div class="block">
      <h6>Tier</h6>
      <div class="tier-list" role="group" aria-label="Tier de la tour">
        <button
          v-for="tierItem in availableTiers"
          :key="tierItem.id"
          type="button"
          class="tier-btn"
          :class="{ active: tierId === tierItem.id }"
          :aria-pressed="tierId === tierItem.id"
          @click="emit('update:tierId', tierItem.id)"
        >
          Tier {{ tierItem.id }}
          <span class="tier-btn-right">
            <span v-if="tierItem.wip" class="tag tag-outline wip-tag">WIP</span>
            <span v-if="tierId === tierItem.id" class="dot" aria-hidden="true">●</span>
          </span>
        </button>
      </div>
    </div>

    <div class="block charms">
      <h6>{{ t("cardBonusTitle") }}</h6>

      <label class="charm">
        <input
          type="checkbox"
          class="sr-only"
          :checked="climbersCharm"
          @change="emit('update:climbersCharm', $event.target.checked)"
        />
        <span class="box" aria-hidden="true"></span>
        <span class="charm-text">
          <strong>Climber's Charm</strong>
          <small>{{ t("climbersDesc") }}</small>
        </span>
      </label>

      <label class="charm">
        <input
          type="checkbox"
          class="sr-only"
          :checked="maskedManCharm"
          @change="emit('update:maskedManCharm', $event.target.checked)"
        />
        <span class="box" aria-hidden="true"></span>
        <span class="charm-text">
          <strong>Masked Man</strong>
          <small>{{ t("maskedDesc") }}</small>
        </span>
      </label>

      <label class="workshop-field">
        <span class="workshop-label-row">
          <span class="workshop-label">{{ t("workshopLabel") }} <small>{{ t("workshopSuffix") }}</small></span>
          <strong class="workshop-value">{{ workshopLevel }}</strong>
        </span>
        <input
          type="range"
          class="workshop-slider"
          :min="workshopLevelMin"
          :max="workshopLevelMax"
          step="1"
          :value="workshopLevel"
          :aria-label="t('workshopLabel')"
          @input="emit('update:workshopLevel', +$event.target.value)"
        />
      </label>

      <div class="total-row">
        <span>{{ t("totalCards") }}</span>
        <strong>+{{ fmtPercent(cardsBonusPercent) }} %</strong>
      </div>
    </div>

    <div class="bottom">
      <div class="lang-row" role="group" aria-label="Langue">
        <button
          v-for="l in locales"
          :key="l.code"
          type="button"
          class="lang-btn"
          :class="{ active: locale === l.code }"
          :aria-pressed="locale === l.code"
          @click="setLocale(l.code)"
        >
          {{ l.label }}
        </button>
      </div>

      <div class="palette-row" role="group" :aria-label="t('paletteTitle')">
        <button
          v-for="p in palettes"
          :key="p.id"
          type="button"
          class="palette-btn"
          :class="['swatch-' + p.id, { active: palette === p.id }]"
          :aria-pressed="palette === p.id"
          @click="emit('selectPalette', p.id)"
        >
          <span class="swatch" aria-hidden="true"></span>
          {{ t(p.labelKey) }}
        </button>
      </div>

      <button
        type="button"
        class="bottom-toggle"
        @click="emit('toggleTheme')"
      >
        <span aria-hidden="true">{{ theme === "dark" ? "☾" : "☀" }}</span>
        {{ theme === "dark" ? t("themeDark") : t("themeLight") }}
      </button>

      <button
        type="button"
        class="bottom-toggle reset-toggle"
        @click="emit('reset')"
      >
        <span aria-hidden="true">↺</span>
        {{ t("resetSettings") }}
      </button>

      <div class="version">{{ t("version") }} {{ appVersion }}</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border-right: 2px solid var(--color-text);
}

@media (max-width: 860px) {
  .sidebar { border-right: 0; border-bottom: 2px solid var(--color-text); }
}

.brand {
  display: flex;
  flex-direction: column;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 30px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  padding: 28px 24px 24px;
  border-bottom: 2px solid var(--color-text);
}

.block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 24px;
  border-bottom: 2px solid var(--color-divider-soft);
}

.tier-list {
  display: flex;
  flex-direction: column;
  border: 2px solid var(--color-text);
}
.tier-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
  font: 800 15px var(--font-heading);
  color: var(--color-text);
  background: transparent;
  border: 0;
  border-top: 2px solid var(--color-text);
  cursor: pointer;
  text-align: left;
}
.tier-btn:first-child { border-top: 0; }
.tier-btn.active { background: var(--color-accent); color: var(--color-bg); }
.tier-btn:not(.active):hover { background: var(--color-divider-soft); }
.tier-btn-right { display: inline-flex; align-items: center; gap: 8px; }
.tier-btn.active .wip-tag { border-color: var(--color-bg); color: var(--color-bg); }

.charms { gap: 16px; }

.charm { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.charm .sr-only {
  position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none;
}
.charm .box {
  width: 20px; height: 20px; flex: none; margin-top: 2px;
  border: 2px solid var(--color-divider);
}
.charm .sr-only:checked + .box {
  background: var(--color-accent);
  border-color: var(--color-accent);
  box-shadow: inset 0 0 0 4px var(--color-bg);
}
.charm .sr-only:focus-visible + .box { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.charm-text { display: flex; flex-direction: column; font-size: 14px; }
.charm-text small { color: var(--color-neutral-700); font-size: 13px; }

.workshop-field { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; cursor: default; }
.workshop-label-row { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.workshop-label { font-size: 14px; }
.workshop-label small { color: var(--color-neutral-700); font-size: 13px; }
.workshop-value { font-family: var(--font-heading); font-size: 18px; color: var(--color-accent-700); flex: none; }

.workshop-slider {
  width: 100%;
  appearance: none;
  height: 6px;
  background: var(--color-divider-soft);
  border: 1px solid var(--color-divider);
  cursor: pointer;
}
.workshop-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px; height: 20px;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-accent);
  cursor: pointer;
}
.workshop-slider::-moz-range-thumb {
  width: 18px; height: 18px;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 1px var(--color-accent);
  cursor: pointer;
}
.workshop-slider:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.total-row {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-top: 12px; border-top: 1px solid var(--color-divider-soft);
  font-size: 13px; color: var(--color-neutral-700);
}
.total-row strong { font-family: var(--font-heading); font-size: 22px; color: var(--color-accent-700); }

.bottom { margin-top: auto; display: flex; flex-direction: column; }

.lang-row {
  display: flex;
  border-top: 2px solid var(--color-divider-soft);
  padding: 14px 24px 0;
}
.lang-btn {
  flex: 1;
  padding: 8px 4px;
  font: 700 12px var(--font-heading);
  letter-spacing: 0.04em;
  color: var(--color-neutral-700);
  background: transparent;
  border: 1px solid var(--color-divider);
  cursor: pointer;
}
.lang-btn + .lang-btn { border-left: 0; }
.lang-btn.active { background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); }
.lang-btn:not(.active):hover { background: var(--color-divider-soft); }

.palette-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 16px 24px 0;
  border-top: 2px solid var(--color-divider-soft);
}
.palette-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 10px; font: 600 12px var(--font-body);
  color: var(--color-neutral-700);
  background: transparent; border: 1px solid var(--color-divider);
  cursor: pointer;
}
.palette-btn:hover { background: var(--color-divider-soft); }
.palette-btn.active { border-color: var(--color-text); color: var(--color-text); }
.palette-btn .swatch {
  width: 12px; height: 12px; border-radius: 50%; flex: none;
  border: 1px solid var(--color-divider);
}
.swatch-red .swatch { background: #ec3013; }
.swatch-blue .swatch { background: #1958d6; }
.swatch-green .swatch { background: #1f8a4c; }
.swatch-violet .swatch { background: #7b2fd1; }

.bottom-toggle {
  display: flex; align-items: center; gap: 8px;
  padding: 16px 24px; font: 500 13px var(--font-body); color: var(--color-neutral-700);
  background: transparent; border: 0; border-top: 2px solid var(--color-divider-soft);
  cursor: pointer; text-align: left;
}
.bottom-toggle:hover { color: var(--color-accent-700); }
.reset-toggle { border-top: 0; padding-top: 4px; }

.version {
  padding: 10px 24px 16px;
  font-size: 11px;
  color: var(--color-neutral-700);
  text-align: left;
}

@media (max-width: 860px) {
  .brand { padding: 22px 20px 18px; font-size: 26px; }
  .block { padding: 18px 20px; }
  .bottom { margin-top: 0; }
  .lang-row { padding: 14px 20px 0; }
  .bottom-toggle { padding: 14px 20px; }
}

/* Très petits écrans : resserre encore le bloc bonus (select workshop, langues). */
@media (max-width: 380px) {
  .block { padding: 14px 16px; }
  .workshop-label { font-size: 13px; }
  .select-wrap select { font-size: 14px; padding: 0 26px 0 10px; }
  .lang-row { padding: 12px 16px 0; gap: 0; }
  .lang-btn { font-size: 11px; padding: 7px 2px; }
  .palette-row { padding: 12px 16px 0; }
  .palette-btn { font-size: 11px; padding: 7px 8px; }
}
</style>
