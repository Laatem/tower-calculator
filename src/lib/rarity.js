// Multiplicateurs fixes, calés sur l'exemple en jeu (carte de base = 1/25k) :
// Gold 1/2.5M, Prismatic 1/25M, Shiny 1/25M, Cosmic 1/250M, Gold+Shiny 1/2.5B,
// Prismatic+Shiny 1/25B, Galactic 1/25B, Cosmic+Shiny 1/250B, Galactic+Shiny 1/25T,
// Rainbow 1/2.5Qa, Sketched 1/250Qa. Rainbow et Sketched n'existent pas en Shiny.
// Vérifié aussi sur une 2e carte (base 1/8T -> Gold 1/800T, Shiny 1/8Qa).
export const RARITY_VARIANTS = [
  { name: "Gold", mult: 1e2 },
  { name: "Prismatic", mult: 1e3 },
  { name: "Shiny", mult: 1e3 },
  { name: "Cosmic", mult: 1e4 },
  { name: "Gold + Shiny", mult: 1e5 },
  { name: "Prismatic + Shiny", mult: 1e6 },
  { name: "Galactic", mult: 1e6 },
  { name: "Cosmic + Shiny", mult: 1e7 },
  { name: "Galactic + Shiny", mult: 1e9 },
  { name: "Rainbow", mult: 1e11 },
  { name: "Sketched", mult: 1e13 },
];

// Couleur (ou dégradé) propre à chaque rareté de base. Pour une combo ("Cosmic + Shiny"),
// on affiche la couleur de la première rareté nommée.
const RARITY_COLORS = {
  Base: { color: "#9b9b9b" },
  Gold: { color: "#e4b22f" },
  Cosmic: { color: "#e4303f" },
  Galactic: { color: "#602fd2" },
  // Rainbow : reflet arc-en-ciel très saturé.
  Rainbow: { gradient: "linear-gradient(135deg, #ff3b30, #ff9500, #ffd60a, #34c759, #0a84ff, #bf5af2)" },
  // Prismatic : même reflet, mais sur des tons moins saturés (opale).
  Prismatic: { gradient: "linear-gradient(135deg, #d98f88, #d9b98a, #d9d08a, #9fd9ac, #8fb9d9, #b58fd9)" },
  // Shiny : reflet clair et lumineux, pas gris.
  Shiny: { gradient: "linear-gradient(135deg, #ffffff, #e8f4ff, #fff6e8, #e8fff0, #f0e8ff, #ffffff)" },
  // Sketched : couleur argentée.
  Sketched: { gradient: "linear-gradient(135deg, #f4f4f4, #b8b8b8, #ffffff, #9a9a9a, #e0e0e0)" },
};

function colorFor(word) {
  return RARITY_COLORS[word] ?? { color: "var(--color-text)" };
}

export function computeRarityVariants(baseDenominator) {
  if (!baseDenominator || baseDenominator <= 0) return [];
  const all = [{ name: "Base", mult: 1 }, ...RARITY_VARIANTS];
  return all.map((v) => ({
    name: v.name,
    denominator: baseDenominator * v.mult,
    parts: v.name.split(" + ").map((word) => ({ word, ...colorFor(word) })),
  }));
}
