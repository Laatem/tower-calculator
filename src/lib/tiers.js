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
    hp: (s) => Math.floor(637.9 * Math.pow(s + 1364.9, 0.95)),
    cards: (s) => (s <= 1 ? 0 : Math.floor(688 * (s - 1) + 0.096 * (s - 1) ** 2)),
  },
  4: {
    label: "Tier 4",
    // Pas encore de données in-game pour ce tier : wip:true désactive les stats/paliers côté UI.
    wip: true,
  },
};
