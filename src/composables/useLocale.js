import { ref, computed, watch } from "vue";
import { DICT, LOCALES, DEFAULT_LOCALE } from "../i18n/dictionary";

const STORAGE_KEY = "tower-locale";
const CODES = LOCALES.map((l) => l.code);

let initial;
try {
  initial = localStorage.getItem(STORAGE_KEY);
} catch (e) {}
if (!CODES.includes(initial)) initial = DEFAULT_LOCALE;

const locale = ref(initial);

function updateDocumentTitle(v) {
  const dict = DICT[v] ?? DICT[DEFAULT_LOCALE];
  try { document.title = `${dict.brandLine1} ${dict.brandLine2}`; } catch (e) {}
}
updateDocumentTitle(locale.value);

watch(locale, (v) => {
  try { localStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  updateDocumentTitle(v);
});

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

export function useLocale() {
  const localeTag = computed(() => LOCALES.find((l) => l.code === locale.value)?.tag ?? "fr-FR");

  function t(key, vars) {
    const str = DICT[locale.value]?.[key] ?? DICT[DEFAULT_LOCALE][key] ?? key;
    return interpolate(str, vars);
  }

  function tierSure(tierId) {
    return DICT[locale.value]?.tierSure?.[tierId] ?? DICT[DEFAULT_LOCALE].tierSure[tierId];
  }

  function setLocale(code) {
    if (CODES.includes(code)) locale.value = code;
  }

  function resetLocale() {
    locale.value = DEFAULT_LOCALE;
  }

  return { locale, setLocale, resetLocale, locales: LOCALES, localeTag, t, tierSure };
}
