import { ref, watch } from "vue";

const STORAGE_KEY = "tower-theme";

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

export function useTheme() {
  let initial;
  try {
    initial = localStorage.getItem(STORAGE_KEY);
  } catch (e) {}
  if (initial !== "light" && initial !== "dark") {
    initial = systemPrefersDark() ? "dark" : "light";
  }

  const theme = ref(initial);
  applyTheme(theme.value);

  watch(theme, (v) => {
    applyTheme(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch (e) {}
  });

  function toggleTheme() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }

  function resetTheme() {
    theme.value = systemPrefersDark() ? "dark" : "light";
  }

  return { theme, toggleTheme, resetTheme };
}
