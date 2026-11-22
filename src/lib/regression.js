import { parseShorthand } from "./format";

// Accepte un couple "stage valeur" par ligne (séparés par espace/virgule/tabulation),
// valeur en notation abrégée façon jeu ("82.66b") ou en nombre brut.
export function parsePairs(text) {
  const lines = String(text || "").split(/\r?\n/);
  const points = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/[\s,;\t]+/).filter(Boolean);
    if (parts.length < 2) continue;
    const x = parseFloat(parts[0].replace(",", "."));
    const y = parseShorthand(parts[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) points.push([x, y]);
  }
  return points;
}

function linearRegression(pairs) {
  const n = pairs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of pairs) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

function det3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

function solve3x3(A, B) {
  const D = det3(A);
  if (Math.abs(D) < 1e-12) return null;
  const withCol = (col, vec) => A.map((row, i) => row.map((v, j) => (j === col ? vec[i] : v)));
  return [det3(withCol(0, B)) / D, det3(withCol(1, B)) / D, det3(withCol(2, B)) / D];
}

function quadraticRegression(points) {
  if (points.length < 3) return null;
  let Sx1 = 0, Sx2 = 0, Sx3 = 0, Sx4 = 0, Sy0 = 0, Sxy = 0, Sx2y = 0;
  const n = points.length;
  for (const [x, y] of points) {
    const x2 = x * x, x3 = x2 * x, x4 = x3 * x;
    Sx1 += x; Sx2 += x2; Sx3 += x3; Sx4 += x4;
    Sy0 += y; Sxy += x * y; Sx2y += x2 * y;
  }
  const A = [
    [Sx4, Sx3, Sx2],
    [Sx3, Sx2, Sx1],
    [Sx2, Sx1, n],
  ];
  const sol = solve3x3(A, [Sx2y, Sxy, Sy0]);
  if (!sol) return null;
  const [a, b, c] = sol;
  return { a, b, c };
}

// Garde jusqu'à `sig` chiffres significatifs, sans notation scientifique, pour un coefficient
// directement collable dans tiers.js.
function fmtCoef(n, sig = 6) {
  if (!Number.isFinite(n) || n === 0) return "0";
  const abs = Math.abs(n);
  const digitsBeforeDecimal = Math.max(1, Math.floor(Math.log10(abs)) + 1);
  const decimals = Math.max(0, sig - digitsBeforeDecimal);
  const factor = 10 ** decimals;
  return (Math.round(n * factor) / factor).toString();
}

function buildResult(name, formula, predict, points) {
  let sumPct = 0, maxPct = 0;
  for (const [x, y] of points) {
    const p = predict(x);
    const pct = y !== 0 ? (Math.abs(p - y) / Math.abs(y)) * 100 : p === 0 ? 0 : 100;
    sumPct += pct;
    if (pct > maxPct) maxPct = pct;
  }
  return { name, formula, avgErrorPercent: sumPct / points.length, maxErrorPercent: maxPct };
}

function fitLinear(points) {
  const lr = linearRegression(points);
  if (!lr) return null;
  const { slope: a, intercept: b } = lr;
  const predict = (x) => a * x + b;
  return buildResult("Linéaire", `(s) => ${fmtCoef(a)} * s + ${fmtCoef(b)}`, predict, points);
}

function fitQuadratic(points) {
  const q = quadraticRegression(points);
  if (!q) return null;
  const { a, b, c } = q;
  const predict = (x) => a * x * x + b * x + c;
  return buildResult("Quadratique", `(s) => ${fmtCoef(a)} * s * s + ${fmtCoef(b)} * s + ${fmtCoef(c)}`, predict, points);
}

function fitExponential(points) {
  if (points.some(([, y]) => y <= 0)) return null;
  const lr = linearRegression(points.map(([x, y]) => [x, Math.log(y)]));
  if (!lr) return null;
  const k = lr.slope;
  const A = Math.exp(lr.intercept);
  const predict = (x) => A * Math.exp(k * x);
  return buildResult("Exponentielle", `(s) => ${fmtCoef(A)} * Math.exp(${fmtCoef(k, 6)} * s)`, predict, points);
}

function fitPower(points) {
  if (points.some(([x, y]) => x <= 0 || y <= 0)) return null;
  const lr = linearRegression(points.map(([x, y]) => [Math.log(x), Math.log(y)]));
  if (!lr) return null;
  const B = lr.slope;
  const A = Math.exp(lr.intercept);
  const predict = (x) => A * Math.pow(x, B);
  return buildResult("Puissance", `(s) => ${fmtCoef(A)} * Math.pow(s, ${fmtCoef(B, 4)})`, predict, points);
}

// Essaie plusieurs formes de courbe sur les mêmes points et les classe par erreur moyenne
// croissante, pour repérer rapidement la forme la plus adaptée (comme on l'a fait à la main
// pour recaler les formules de tiers.js au fil des points mesurés en jeu).
export function computeRegressions(points) {
  if (!Array.isArray(points) || points.length < 2) return [];
  const fits = [fitLinear(points), fitExponential(points), fitPower(points)];
  if (points.length >= 3) fits.push(fitQuadratic(points));
  return fits.filter(Boolean).sort((a, b) => a.avgErrorPercent - b.avgErrorPercent);
}
