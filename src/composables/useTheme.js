import { ref, watch } from "vue";

const STORAGE_KEY = "tower-theme";
const PALETTE_STORAGE_KEY = "tower-palette";
const DEFAULT_PALETTE = "red";

export const PALETTES = [
  { id: "red", labelKey: "paletteRed" },
  { id: "blue", labelKey: "paletteBlue" },
  { id: "green", labelKey: "paletteGreen" },
  { id: "violet", labelKey: "paletteViolet" },
];
const PALETTE_IDS = PALETTES.map((p) => p.id);

function systemPrefersDark() {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch (e) {
    return false;
  }
}

function applyTheme(v) {
  document.documentElement.setAttribute("data-theme", v);
}

function applyPalette(v) {
  document.documentElement.setAttribute("data-palette", v);
}

export function useTheme() {
  let initial;
  try {
    initial = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}
  if (initial !== "light" && initial !== "dark") {
    initial = systemPrefersDark() ? "dark" : "light";
  }

  let initialPalette;
  try {
    initialPalette = localStorage.getItem(PALETTE_STORAGE_KEY);
  } catch (e) {}
  if (!PALETTE_IDS.includes(initialPalette)) initialPalette = DEFAULT_PALETTE;

  const theme = ref(initial);
  const palette = ref(initialPalette);
  applyTheme(theme.value);
  applyPalette(palette.value);

  watch(theme, (v) => {
    applyTheme(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch (e) {}
  });

  watch(palette, (v) => {
    applyPalette(v);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, v);
    } catch (e) {}
  });

  function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }

  function setPalette(id) {
    if (PALETTE_IDS.includes(id)) palette.value = id;
  }

  function resetTheme() {
    theme.value = systemPrefersDark() ? "dark" : "light";
    palette.value = DEFAULT_PALETTE;
  }

  return { theme, toggleTheme, palette, setPalette, palettes: PALETTES, resetTheme };
}
