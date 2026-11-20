<script setup>
import { useLocale } from "../composables/useLocale";
import pkg from "../../package.json";

const { locale, setLocale, locales, t } = useLocale();

const appVersion = pkg.version;

const props = defineProps({
  theme: { type: String, required: true },
  palette: { type: String, required: true },
  palettes: { type: Array, required: true },
});
const emit = defineEmits(["toggleTheme", "selectPalette", "reset"]);
</script>

<template>
  <footer class="footer">
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

    <button type="button" class="footer-btn" @click="emit('toggleTheme')">
      <span aria-hidden="true">{{ theme === "dark" ? "☾" : "☀" }}</span>
      {{ theme === "dark" ? t("themeDark") : t("themeLight") }}
    </button>

    <button type="button" class="footer-btn" @click="emit('reset')">
      <span aria-hidden="true">↺</span>
      {{ t("resetSettings") }}
    </button>

    <div class="version">{{ t("version") }} {{ appVersion }}</div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px 32px;
  border-top: 2px solid var(--color-text);
  background: var(--color-bg);
}

.lang-row { display: flex; }
.lang-btn {
  padding: 8px 12px;
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

.palette-row { display: flex; gap: 8px; flex-wrap: wrap; }
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

.footer-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; font: 500 13px var(--font-body); color: var(--color-neutral-700);
  background: transparent; border: 1px solid var(--color-divider);
  cursor: pointer;
}
.footer-btn:hover { color: var(--color-accent-700); border-color: var(--color-accent-700); }

.version {
  margin-left: auto;
  font-size: 11px;
  color: var(--color-neutral-700);
  white-space: nowrap;
}

@media (max-width: 860px) {
  .footer { padding: 14px 20px; gap: 14px; }
  .version { margin-left: 0; width: 100%; }
}
</style>
