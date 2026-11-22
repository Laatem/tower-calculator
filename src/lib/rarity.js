// Multiplicateurs fixes, calés sur l'exemple en jeu (carte de base = 1/25) :
// Gold 1/2.5M, Prismatic 1/25M, Shiny 1/25M, Cosmic 1/250M, Gold+Shiny 1/2.5B,
// Prismatic+Shiny 1/25B, Galactic 1/25B, Cosmic+Shiny 1/250B, Galactic+Shiny 1/25T,
// Rainbow 1/2.5Qa, Sketched 1/250Qa. Rainbow et Sketched n'existent pas en Shiny.
export const RARITY_VARIANTS = [
  { name: "Gold", mult: 1e5 },
  { name: "Prismatic", mult: 1e6 },
  { name: "Shiny", mult: 1e6 },
  { name: "Cosmic", mult: 1e7 },
  { name: "Gold + Shiny", mult: 1e8 },
  { name: "Prismatic + Shiny", mult: 1e9 },
  { name: "Galactic", mult: 1e9 },
  { name: "Cosmic + Shiny", mult: 1e10 },
  { name: "Galactic + Shiny", mult: 1e12 },
  { name: "Rainbow", mult: 1e14 },
  { name: "Sketched", mult: 1e16 },
];

export function computeRarityVariants(baseDenominator) {
  if (!baseDenominator || baseDenominator <= 0) return [];
  return RARITY_VARIANTS.map((v) => ({
    name: v.name,
    denominator: baseDenominator * v.mult,
  }));
}
