// Chaque tier : formule de vie (ATK = vie / 2) et cartes gagnées en cas de défaite.
// Pour ajouter un tier : ajouter une entrée ici, le bouton correspondant se génère automatiquement dans Sidebar.vue.
export const TIERS = {
  1: {
    label: "Tier 1",
    hp: (s) => Math.floor(20 * Math.pow(s, 0.95)),
    hpCalibration: { points: 0 },
    cards: (s) => Math.max(0, Math.floor(1.539 * Math.pow(Math.max(0, s - 1), 1.5))),
    cardsCalibration: { points: 0 },
  },
  2: {
    label: "Tier 2",
    hp: (s) => Math.floor(65090 * Math.exp(0.0004394 * s)),
    hpCalibration: { points: 4 },
    // Mise à l'échelle (×1.7077) sur 1 point mesuré in-game (floor 9300, avec bonus cartes
    // +92.5% = Climber's Charm + workshop lvl 13) : la courbe d'origine sous-estimait d'un
    // facteur ~1.7 à ce stage. Un 2e point réel permettrait d'affiner la forme de la courbe.
    cards: (s) => (s <= 1 ? 0 : Math.floor(474.74 * (s - 1) + 1 + 0.06489 * (s - 1) ** 2)),
    cardsCalibration: { points: 1 },
  },
  3: {
    label: "Tier 3",
    // Recalée sur 5 points mesurés in-game (stage 19000 à 23000) : la vie croît en fait de
    // façon exponentielle (ratio ×1.93 tous les 1000 stages, constant sur les 5 points), pas
    // en loi de puissance comme l'ancienne formule — celle-ci, calée sur stage 200/300/400,
    // restait correcte sur cette plage basse mais sous-estimait d'un facteur ~34 000 à stage
    // 20000. Cette nouvelle formule reste cohérente (< 1%) avec les anciens points 200/300/400.
    hp: (s) => Math.floor(305500 * Math.exp(0.00065834 * s)),
    hpCalibration: { points: 5 },
    cards: (s) => (s <= 1 ? 0 : Math.floor(688 * (s - 1) + 0.096 * (s - 1) ** 2)),
    cardsCalibration: { points: 0 },
  },
  4: {
    label: "Tier 4",
    // Recalée sur 14 points mesurés in-game (stage 5 à 120), écart < 0,2%.
    hp: (s) => Math.floor(3453024 + 3451 * s),
    hpCalibration: { points: 14 },
    cards: (s) => (s <= 1 ? 0 : Math.floor(2052.78 * (s - 1) + 0.5556 * (s - 1) ** 2)),
    cardsCalibration: { points: 14 },
  },
};

// Niveau de fiabilité affiché en badge (StageStats.vue) à partir du nombre de points
// mesurés en jeu ayant servi à caler une formule : 0 = jamais vérifiée, 1-2 = juste mise à
// l'échelle sur trop peu de points pour fiabiliser la forme de la courbe, 3+ = fiable.
export function calibrationLevel(calibration) {
  const points = calibration?.points ?? 0;
  if (points === 0) return "none";
  if (points < 3) return "low";
  return "high";
}

// Garde-fou dev uniquement : un tier supérieur ne doit jamais avoir moins de vie qu'un tier
// inférieur à stage égal (on a dû corriger ce genre d'inversion deux fois par le passé après
// coup, à cause de formules de formes différentes — exponentielle vs loi de puissance —
// qui divergent très différemment en dehors de leur plage mesurée).
if (import.meta.env?.DEV) {
  const ids = Object.keys(TIERS).map(Number).sort((a, b) => a - b);
  const SAMPLE_STAGES = [1, 10, 100, 500, 1000, 5000, 10000, 20000, 30000];
  for (let i = 1; i < ids.length; i++) {
    const prev = TIERS[ids[i - 1]];
    const cur = TIERS[ids[i]];
    for (const s of SAMPLE_STAGES) {
      const prevHp = prev.hp(s);
      const curHp = cur.hp(s);
      if (curHp < prevHp) {
        console.warn(
          `[tiers.js] Tier ${ids[i]} (${curHp}) a moins de vie que Tier ${ids[i - 1]} (${prevHp}) au stage ${s} — formules incohérentes entre tiers.`
        );
      }
    }
  }
}
