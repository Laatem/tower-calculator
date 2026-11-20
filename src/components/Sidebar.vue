<script setup>
import { useLocale } from "../composables/useLocale";

const { localeTag, t } = useLocale();

const props = defineProps({
  tierId: { type: Number, required: true },
  availableTiers: { type: Array, required: true },
  climbersCharm: { type: Boolean, required: true },
  maskedManCharm: { type: Boolean, required: true },
  workshopLevel: { type: Number, required: true },
  workshopLevelMin: { type: Number, default: 1 },
  workshopLevelMax: { type: Number, default: 20 },
  cardsBonusPercent: { type: Number, required: true },
  workshopSpeedLevel: { type: Number, required: true },
  workshopSpeedLevelMin: { type: Number, default: 1 },
  workshopSpeedLevelMax: { type: Number, default: 20 },
  potionV: { type: Boolean, required: true },
  baseSpeedInput: { type: String, required: true },
  speedBonusPercent: { type: Number, required: true },
  effectiveSpeedLabel: { type: String, default: null },
});
const emit = defineEmits([
  "update:tierId",
  "update:climbersCharm",
  "update:maskedManCharm",
  "update:workshopLevel",
  "update:workshopSpeedLevel",
  "update:potionV",
  "update:baseSpeedInput",
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
      <div class="tier-grid" role="group" aria-label="Tier de la tour">
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
          <span v-if="tierItem.wip" class="wip-dot" aria-label="WIP"></span>
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

    <div class="block charms">
      <h6>{{ t("speedBonusTitle") }}</h6>

      <label class="speed-field">
        <span class="workshop-label-row">
          <span class="workshop-label">{{ t("speedBaseLabel") }} <small>{{ t("speedBaseSuffix") }}</small></span>
        </span>
        <input
          type="text"
          inputmode="decimal"
          class="speed-input"
          :value="baseSpeedInput"
          :placeholder="t('speedBasePlaceholder')"
          @input="emit('update:baseSpeedInput', $event.target.value)"
        />
      </label>

      <label class="charm">
        <input
          type="checkbox"
          class="sr-only"
          :checked="potionV"
          @change="emit('update:potionV', $event.target.checked)"
        />
        <span class="box" aria-hidden="true"></span>
        <span class="charm-text">
          <strong>Battle Potion V</strong>
          <small>{{ t("potionVDesc") }}</small>
        </span>
      </label>

      <label class="workshop-field">
        <span class="workshop-label-row">
          <span class="workshop-label">{{ t("workshopSpeedLabel") }} <small>{{ t("workshopSpeedSuffix") }}</small></span>
          <strong class="workshop-value">{{ workshopSpeedLevel }}</strong>
        </span>
        <input
          type="range"
          class="workshop-slider"
          :min="workshopSpeedLevelMin"
          :max="workshopSpeedLevelMax"
          step="1"
          :value="workshopSpeedLevel"
          :aria-label="t('workshopSpeedLabel')"
          @input="emit('update:workshopSpeedLevel', +$event.target.value)"
        />
      </label>

      <div class="total-row">
        <span>{{ t("totalSpeed") }}</span>
        <strong>+{{ fmtPercent(speedBonusPercent) }} %</strong>
      </div>

      <div class="final-speed">
        <span>{{ t("speedFinalLabel") }}</span>
        <strong v-if="effectiveSpeedLabel">{{ effectiveSpeedLabel }}</strong>
        <span v-else class="final-speed-empty">—</span>
      </div>
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

.tier-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.tier-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  font: 800 14px var(--font-heading);
  color: var(--color-text);
  background: transparent;
  border: 2px solid var(--color-text);
  cursor: pointer;
  text-align: center;
}
.tier-btn.active { background: var(--color-accent); color: var(--color-bg); border-color: var(--color-accent); }
.tier-btn:not(.active):hover { background: var(--color-divider-soft); }
.wip-dot {
  position: absolute; top: 5px; right: 5px;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--color-accent);
}
.tier-btn.active .wip-dot { background: var(--color-bg); }

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

.speed-field { display: flex; flex-direction: column; gap: 8px; cursor: default; }
.speed-input {
  height: 40px; padding: 0 12px; font: 700 16px var(--font-body);
  background: var(--color-surface); color: var(--color-text);
  border: 1px solid var(--color-divider);
}
.speed-input::placeholder { color: var(--color-neutral-700); opacity: 0.7; }

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

.final-speed {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 14px 16px; background: var(--color-accent); color: var(--color-bg);
}
.final-speed strong { font-family: var(--font-heading); font-size: 26px; }
.final-speed-empty { font-size: 16px; opacity: 0.7; }

@media (max-width: 860px) {
  .brand { padding: 22px 20px 18px; font-size: 26px; }
  .block { padding: 18px 20px; }
}

/* Très petits écrans : resserre encore le bloc bonus. */
@media (max-width: 380px) {
  .block { padding: 14px 16px; }
  .workshop-label { font-size: 13px; }
}
</style>
