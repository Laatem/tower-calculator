// Chaque tier : formule de vie (ATK = vie / 2) et cartes gagnées en cas de défaite.
// Pour ajouter un tier : ajouter une entrée ici, le bouton correspondant se génère automatiquement dans Sidebar.vue.
export const TIERS = {
  1: {
    label: "Tier 1",
    hp: (s) => Math.floor(20 * Math.pow(s, 0.95)),
    cards: (s) => Math.max(0, Math.floor(1.539 * Math.pow(Math.max(0, s - 1), 1.5))),
  },
  2: {
    label: "Tier 2",
    hp: (s) => Math.floor(65090 * Math.exp(0.0004394 * s)),
    // Mise à l'échelle (×1.7077) sur 1 point mesuré in-game (floor 9300, avec bonus cartes
    // +92.5% = Climber's Charm + workshop lvl 13) : la courbe d'origine sous-estimait d'un
    // facteur ~1.7 à ce stage. Un 2e point réel permettrait d'affiner la forme de la courbe.
    cards: (s) => (s <= 1 ? 0 : Math.floor(474.74 * (s - 1) + 1 + 0.06489 * (s - 1) ** 2)),
  },
  3: {
    label: "Tier 3",
    // Recalée sur 5 points mesurés in-game (stage 19000 à 23000) : la vie croît en fait de
    // façon exponentielle (ratio ×1.93 tous les 1000 stages, constant sur les 5 points), pas
    // en loi de puissance comme l'ancienne formule — celle-ci, calée sur stage 200/300/400,
    // restait correcte sur cette plage basse mais sous-estimait d'un facteur ~34 000 à stage
    // 20000. Cette nouvelle formule reste cohérente (< 1%) avec les anciens points 200/300/400.
    hp: (s) => Math.floor(305500 * Math.exp(0.00065834 * s)),
    cards: (s) => (s <= 1 ? 0 : Math.floor(688 * (s - 1) + 0.096 * (s - 1) ** 2)),
  },
  4: {
    label: "Tier 4",
    // Recalée sur 14 points mesurés in-game (stage 5 à 120), écart < 0,2%.
    hp: (s) => Math.floor(3453024 + 3451 * s),
    cards: (s) => (s <= 1 ? 0 : Math.floor(2052.78 * (s - 1) + 0.5556 * (s - 1) ** 2)),
  },
};
