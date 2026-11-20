// Calibré à partir de 6 mesures en jeu (team speed, moyenne sur 10 stages consécutifs,
// arrondi au supérieur) : x1 → 1min27, x2 → 46s, x4 → 23s, x6 → 16s, x10 → 10s, x11.5 → 9s.
// Le temps par stage suit temps(s) ≈ a/s + b : b est un overhead fixe par stage
// (chargement, déplacement...) que la vitesse ne réduit pas. Régression sur ces points : <3.5% d'erreur.
const TIME_A = 8.582;
const TIME_B = 0.1745;

export function timePerStage(speed) {
  if (!(speed > 0)) return null;
  return TIME_A / speed + TIME_B;
}

export function estimateSeconds(speed, stageCount) {
  const t = timePerStage(speed);
  if (t == null || !(stageCount > 0)) return null;
  return t * stageCount;
}

export function formatDuration(totalSeconds) {
  if (totalSeconds == null) return null;
  let s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const parts = [];
  if (h > 0) parts.push(h + "h");
  if (h > 0 || m > 0) parts.push(m + "min");
  parts.push(s + "s");
  return parts.join(" ");
}
