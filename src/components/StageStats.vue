<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import { abbr } from "../lib/format";
import { estimateSeconds, formatDuration } from "../lib/speed";
import { calibrationLevel } from "../lib/tiers";
import { useLocale } from "../composables/useLocale";

const { t } = useLocale();

const props = defineProps({
  hp: { type: Function, required: true },
  atkFromHp: { type: Function, required: true },
  cards: { type: Function, required: true },
  hasCards: { type: Boolean, required: true },
  tierLabel: { type: String, required: true },
  effectiveSpeed: { type: Number, default: null },
  hpCalibration: { type: Object, default: null },
  cardsCalibration: { type: Object, default: null },
});

function calibBadge(calibration) {
  const level = calibrationLevel(calibration);
  const n = calibration?.points ?? 0;
  const text = level === "none" ? t("calibNone") : level === "low" ? t("calibLow") : t("calibHigh");
  const title = n > 0 ? t("calibTooltip", { n }) : t("calibTooltipNone");
  return { level, text, title };
}

const hpBadge = computed(() => calibBadge(props.hpCalibration));
const cardsBadge = computed(() => calibBadge(props.cardsCalibration));

const stage = ref(500);
const clampedStage = computed(() => Math.max(1, Math.floor(stage.value || 1)));

const h = computed(() => props.hp(clampedStage.value));
const a = computed(() => props.atkFromHp(h.value));
const c = computed(() => props.cards(clampedStage.value));

const estimatedTime = computed(() =>
  props.effectiveSpeed > 0 ? estimateSeconds(props.effectiveSpeed, clampedStage.value) : null
);

function dec() { stage.value = Math.max(1, clampedStage.value - 1); }
function inc() { stage.value = clampedStage.value + 1; }

const HOLD_DELAY = 400;
const HOLD_INTERVAL = 80;
const FAST_AFTER = 4500;
const FAST_SPEED = 3;
let holdTimeout = null;
let holdInterval = null;
let fastTimeout = null;

function startHold(fn) {
  fn();
  holdTimeout = setTimeout(() => {
    holdInterval = setInterval(fn, HOLD_INTERVAL);
  }, HOLD_DELAY);
  fastTimeout = setTimeout(() => {
    clearInterval(holdInterval);
    holdInterval = setInterval(fn, HOLD_INTERVAL / FAST_SPEED);
  }, FAST_AFTER);
}
function stopHold() {
  clearTimeout(holdTimeout);
  clearInterval(holdInterval);
  clearTimeout(fastTimeout);
  holdTimeout = null;
  holdInterval = null;
  fastTimeout = null;
}

onBeforeUnmount(stopHold);

let pointerHeld = false;
function onPointerDown(fn) {
  pointerHeld = true;
  startHold(fn);
}
function onPointerUp() {
  stopHold();
  setTimeout(() => { pointerHeld = false; }, 0);
}
function onClick(fn) {
  if (pointerHeld) return;
  fn();
}
</script>

<template>
  <section aria-labelledby="t1">
    <div class="hero">
      <div class="hero-text">
        <span class="eyebrow">{{ t("stageStatsEyebrow", { tier: tierLabel }) }}</span>
        <div class="stage-line">
          <span class="stage-word">{{ t("stageWord") }}</span>
          <input
            id="t1"
            v-model.number="stage"
            type="number"
            min="1"
            inputmode="numeric"
            :aria-label="t('stageWord')"
          />
        </div>
      </div>
      <div class="stepper">
        <button
          type="button"
          :aria-label="t('stagePrev')"
          @pointerdown="onPointerDown(dec)"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
          @pointercancel="onPointerUp"
          @click="onClick(dec)"
        >−</button>
        <button
          type="button"
          :aria-label="t('stageNext')"
          @pointerdown="onPointerDown(inc)"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
          @pointercancel="onPointerUp"
          @click="onClick(inc)"
        >+</button>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-head">
          <h6>{{ t("hp") }}</h6>
          <span class="tag" :class="'tag-' + hpBadge.level" :title="hpBadge.title">{{ hpBadge.text }}</span>
        </div>
        <div class="big">{{ abbr(h) }}</div>
      </div>
      <div class="stat">
        <div class="stat-head">
          <h6>{{ t("atk") }}</h6>
          <span class="tag" :class="'tag-' + hpBadge.level" :title="hpBadge.title">{{ hpBadge.text }}</span>
        </div>
        <div class="big">{{ abbr(a) }}</div>
      </div>
      <div class="stat">
        <div class="stat-head">
          <h6>{{ t("cardsIfDefeated") }}</h6>
          <span v-if="hasCards" class="tag" :class="'tag-' + cardsBadge.level" :title="cardsBadge.title">{{ cardsBadge.text }}</span>
        </div>
        <div class="big accent">{{ c == null ? "–" : abbr(c) }}</div>
        <div v-if="c == null" class="exact">{{ t("noData") }}</div>
      </div>
    </div>

    <div class="time-row">
      <span>{{ t("stageTimeLabel") }}</span>
      <strong v-if="estimatedTime != null">{{ formatDuration(estimatedTime) }}</strong>
      <span v-else class="time-empty">{{ t("stageTimeEmpty") }}</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 28px 40px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.hero-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.eyebrow { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
.stage-line { display: flex; align-items: baseline; gap: 14px; }
.stage-word { font: 600 15px var(--font-body); letter-spacing: 0.08em; text-transform: uppercase; opacity: .85; }
.stage-line input {
  width: 100%; max-width: 320px; border: 0; background: transparent; color: inherit;
  font: 800 clamp(40px, 8vw, 80px) var(--font-heading); letter-spacing: -0.03em; padding: 0;
}

.stepper { display: flex; border: 2px solid var(--color-bg); flex: none; }
.stepper button {
  width: 52px; height: 52px; display: flex; align-items: center; justify-content: center;
  font-size: 26px; font-weight: 600; border: 0; background: transparent; color: inherit; cursor: pointer;
}
.stepper button:first-child { border-right: 2px solid var(--color-bg); }
.stepper button:hover { background: rgba(255, 255, 255, 0.15); }

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 2px solid var(--color-text);
}
.stat {
  padding: 24px 24px 28px;
  display: flex; flex-direction: column; gap: 6px; min-width: 0;
  border-left: 2px solid var(--color-divider-soft);
}
.stat:first-child { border-left: 0; }
.stat-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.big { font: 800 clamp(32px, 6vw, 64px) var(--font-heading); line-height: 1; letter-spacing: -0.03em; overflow-wrap: anywhere; }
.big.accent { color: var(--color-accent); }
.exact { font-size: 14px; color: var(--color-neutral-700); overflow-wrap: anywhere; }

.time-row {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 16px 40px; border-bottom: 2px solid var(--color-text);
  font-size: 14px; color: var(--color-neutral-700);
}
.time-row strong { font-family: var(--font-heading); font-size: 18px; color: var(--color-accent-700); }
.time-empty { font-size: 13px; text-align: right; }

@media (max-width: 860px) {
  .hero { padding: 22px 20px; }
  .stats { grid-template-columns: 1fr; }
  .stat { border-left: 0; border-top: 2px solid var(--color-divider-soft); }
  .stat:first-child { border-top: 0; }
  .time-row { padding: 14px 20px; flex-wrap: wrap; }
}

/* Très petits écrans : steppers plus compacts pour ne pas déborder à côté du gros chiffre. */
@media (max-width: 380px) {
  .hero { padding: 18px 16px; gap: 14px; }
  .stepper button { width: 40px; height: 40px; font-size: 20px; }
}
</style>
