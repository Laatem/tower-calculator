<script setup>
import { ref } from "vue";
import { useLocale } from "../composables/useLocale";
import RecalibrationTool from "./RecalibrationTool.vue";
import pkg from "../../package.json";

const { locale, setLocale, locales, t } = useLocale();

const appVersion = pkg.version;

const props = defineProps({
  theme: { type: String, required: true },
  palette: { type: String, required: true },
  palettes: { type: Array, required: true },
});
const emit = defineEmits(["toggleTheme", "selectPalette", "reset"]);

const showRecalib = ref(false);
</script>

<template>
  <div class="settings-panel">
    <div class="settings-head">{{ t("settingsTitle") }}</div>

    <div class="settings-section">
      <span class="settings-label">{{ t("langTitle") }}</span>
      <div class="segmented" role="group" :aria-label="t('langTitle')">
        <button
          v-for="l in locales"
          :key="l.code"
          type="button"
          class="segmented-btn"
          :class="{ active: locale === l.code }"
          :aria-pressed="locale === l.code"
          @click="setLocale(l.code)"
        >{{ l.label }}</button>
      </div>
    </div>

    <div class="settings-section">
      <span class="settings-label">{{ t("paletteTitle") }}</span>
      <div class="swatch-grid">
        <button
          v-for="p in palettes"
          :key="p.id"
          type="button"
          class="swatch-btn"
          :class="{ active: palette === p.id }"
          :aria-pressed="palette === p.id"
          @click="emit('selectPalette', p.id)"
        >
          <span class="swatch" :class="'swatch-' + p.id" aria-hidden="true"></span>
          {{ t(p.labelKey) }}
        </button>
      </div>
      <div class="segmented segmented-2">
        <button
          type="button"
          class="segmented-btn"
          :class="{ active: theme === 'dark' }"
          @click="theme !== 'dark' && emit('toggleTheme')"
        >{{ t("themeDark") }}</button>
        <button
          type="button"
          class="segmented-btn"
          :class="{ active: theme === 'light' }"
          @click="theme !== 'light' && emit('toggleTheme')"
        >{{ t("themeLight") }}</button>
      </div>
    </div>

    <div class="settings-actions">
      <button type="button" class="settings-action" @click="showRecalib = !showRecalib">
        {{ t("recalibToggle") }} <small>(dev)</small>
      </button>
      <button type="button" class="settings-action accent" @click="emit('reset')">
        {{ t("resetSettings") }}
      </button>
    </div>

    <RecalibrationTool v-if="showRecalib" />

    <div class="settings-version">{{ t("version") }} {{ appVersion }}</div>
  </div>
</template>

<style scoped>
.settings-panel {
  width: 320px;
  background: var(--color-bg);
  color: var(--color-text);
  border: 2px solid var(--color-text);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.settings-head {
  padding: 16px 20px;
  border-bottom: 2px solid var(--color-divider-soft);
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 18px;
}

.settings-section {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: 1px solid var(--color-divider-soft);
}
.settings-label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--color-neutral-700);
}

.segmented { display: flex; border: 2px solid var(--color-divider); }
.segmented-btn {
  flex: 1; padding: 8px 10px; font: 700 13px var(--font-heading);
  color: var(--color-text); background: transparent; border: 0; border-left: 2px solid var(--color-divider);
  cursor: pointer;
}
.segmented-btn:first-child { border-left: 0; }
.segmented-btn.active { background: var(--color-accent); color: var(--color-bg); }
.segmented-btn:not(.active):hover { background: var(--color-divider-soft); }
.segmented-2 { margin-top: 4px; }

.swatch-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.swatch-btn {
  display: flex; flex-direction: column; gap: 6px; padding: 0;
  font-size: 12px; color: var(--color-neutral-700); background: transparent; border: 0; cursor: pointer;
}
.swatch-btn.active { color: var(--color-text); }
.swatch { display: block; height: 28px; border: 1px solid var(--color-divider); }
.swatch-btn.active .swatch { outline: 2px solid var(--color-text); outline-offset: 2px; }
.swatch-red { background: #ec3013; }
.swatch-blue { background: #1958d6; }
.swatch-green { background: #1f8a4c; }
.swatch-violet { background: #7b2fd1; }

.settings-actions { display: flex; flex-direction: column; padding: 8px; }
.settings-action {
  padding: 10px 12px; font: 600 14px var(--font-body); text-align: left;
  color: var(--color-text); background: transparent; border: 0; cursor: pointer;
}
.settings-action:hover { background: var(--color-divider-soft); }
.settings-action small { color: var(--color-neutral-700); font-weight: 400; }
.settings-action.accent { color: var(--color-accent-700); }

.settings-version {
  padding: 10px 20px; border-top: 1px solid var(--color-divider-soft);
  font-size: 12px; color: var(--color-neutral-700);
}
</style>
