// Chaque tier : formule de vie (ATK = vie / 2) et cartes gagnées en cas de défaite.
// Pour ajouter un tier : ajouter une entrée ici, le bouton correspondant se génère automatiquement dans Sidebar.vue.
export const TIERS = {
  1: {
    label: "Tier 1",
    hp: (s) => Math.floor(20 * Math.pow(s, 0.95)),
    hpCalibration: { points: 0 },
    // Recalée sur 14 points réels (floor 2 à 25000) via l'API officieuse du jeu
    // (cbp-tower.vercel.app/api/rewards, cartes cumulées sans aucun bonus) : loi de
    // puissance confirmée, écart < 0,1% sur toute la plage.
    cards: (s) => Math.max(0, Math.floor(1.52 * Math.pow(Math.max(0, s - 1), 1.5))),
    cardsCalibration: { points: 14 },
  },
  2: {
    label: "Tier 2",
    hp: (s) => Math.floor(65090 * Math.exp(0.0004394 * s)),
    hpCalibration: { points: 4 },
    // Recalée sur 14 points réels (floor 2 à 25000) via la même API : les cartes gagnées par
    // floor croissent en fait exponentiellement, donc le cumul suit une exponentielle décalée
    // C*(e^(k·(s-1)) - 1), pas la forme linéaire+quadratique mise à l'échelle précédemment sur
    // un seul point. Écart < 0,1% sur toute la plage.
    cards: (s) => (s <= 1 ? 0 : Math.floor(1204475 * (Math.exp(0.00023101 * (s - 1)) - 1))),
    cardsCalibration: { points: 14 },
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
    // Recalée sur 14 points réels (floor 2 à 25000) via la même API, même constat que Tier 2 :
    // exponentielle décalée, écart < 0,05% sur toute la plage.
    cards: (s) => (s <= 1 ? 0 : Math.floor(1982980 * (Math.exp(0.00034660 * (s - 1)) - 1))),
    cardsCalibration: { points: 14 },
  },
  4: {
    label: "Tier 4",
    // Recalée sur 5 points mesurés in-game à haut stage (floor 8320 à 12000) : même schéma
    // que Tier 3, la vie est en fait exponentielle (ratio ×2.56 tous les 1000 stages), pas
    // linéaire comme l'ancienne formule — celle-ci, calée sur stage 5-120, restait correcte
    // sur cette plage basse (écart < 0,2% avec la nouvelle formule à s=120) mais sous-estimait
    // massivement à haut stage.
    hp: (s) => Math.floor(3451620 * Math.exp(0.00094014 * s)),
    hpCalibration: { points: 19 },
    // Recalée sur 14 points réels (floor 2 à 25000) via la même API, même constat : exponentielle
    // décalée, écart < 0,02% sur toute la plage.
    cards: (s) => (s <= 1 ? 0 : Math.floor(4146453 * (Math.exp(0.00049511 * (s - 1)) - 1))),
    cardsCalibration: { points: 14 },
  },
};

// Mutations : modificateurs de stats que le jeu impose selon le tier (obligatoires côté jeu,
// l'utilisateur coche simplement celles actives sur son run pour ajuster les calculs). Swarm
// boost toutes les stats ; Vanguard ne touche que le premier mob (stage 1).
export const MUTATIONS = {
  swarm: { statMultiplier: 1.15 },
  vanguard: { firstMobMultiplier: 2 },
};

// Enrobe une formule de vie avec les mutations actives, pour réutilisation identique dans le
// panneau principal (useTowerTier.js) et l'Estimation de stage (CardEstimateTool.vue).
export function applyMutations(hpFn, { swarm, vanguard } = {}) {
  if (!hpFn) return hpFn;
  const swarmMult = swarm ? MUTATIONS.swarm.statMultiplier : 1;
  const vanguardMult = vanguard ? MUTATIONS.vanguard.firstMobMultiplier : 1;
  if (swarmMult === 1 && vanguardMult === 1) return hpFn;
  return (s) => {
    const base = hpFn(s);
    if (base == null) return base;
    return Math.floor(base * swarmMult * (s === 1 ? vanguardMult : 1));
  };
}

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
