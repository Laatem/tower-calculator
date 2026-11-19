export const SUF = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

// Abréviation façon jeu : 3 chiffres significatifs, tronqués (1588 -> 1.58k)
export function abbr(n) {
  if (n == null) return "?";
  if (n < 1000) return String(n);
  let i = 0, v = n;
  while (v >= 1000 && i < SUF.length - 1) { v /= 1000; i++; }
  const dec = v >= 100 ? 0 : v >= 10 ? 1 : 2;
  const p = Math.pow(10, dec);
  return (Math.floor(v * p + 1e-9) / p).toString() + SUF[i];
}

export function fmtExact(n, localeTag = "fr-FR") {
  return n.toLocaleString(localeTag);
}
