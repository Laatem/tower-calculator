// Cherche le plus grand stage s tel que hpFn(s) <= targetHp (hpFn supposée croissante).
export function maxStageForHp(hpFn, targetHp) {
  if (!hpFn || !(targetHp > 0)) return null;
  if (hpFn(1) > targetHp) return 0;

  let lo = 1, hi = 2;
  while (hpFn(hi) <= targetHp) {
    lo = hi;
    hi *= 2;
  }
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (hpFn(mid) <= targetHp) lo = mid;
    else hi = mid;
  }
  return lo;
}

