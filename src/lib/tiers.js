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
    cards: (s) => (s <= 1 ? 0 : Math.floor(278 * (s - 1) + 1 + 0.038 * (s - 1) ** 2)),
  },
  3: {
    label: "Tier 3",
    // Recalée sur 3 points mesurés in-game (stage 200/300/400), écart < 0,3%.
    hp: (s) => Math.floor(363.7 * Math.pow(s + 1164.8, 0.95)),
    cards: (s) => (s <= 1 ? 0 : Math.floor(688 * (s - 1) + 0.096 * (s - 1) ** 2)),
  },
  4: {
    label: "Tier 4",
    // Recalée sur 14 points mesurés in-game (stage 5 à 120), écart < 0,2%.
    hp: (s) => Math.floor(3453024 + 3451 * s),
    cards: (s) => (s <= 1 ? 0 : Math.floor(2052.78 * (s - 1) + 0.5556 * (s - 1) ** 2)),
  },
};
