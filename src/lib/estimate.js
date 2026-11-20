// Cherche le plus grand stage s tel que hpFn(s) <= targetHp (hpFn supposée croissante).
export function maxStageForHp(hpFn, targetHp) {
  if (!hpFn || !(targetHp > 0)) return null;
  if (hpFn(1) > targetHp) return 0;

  let lo = 1, hi = 1;
  while (hpFn(hi) <= targetHp) {
    lo = hi;
    hi *= 2;
    if (hi > 1e9) break;
  }

  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (hpFn(mid) <= targetHp) lo = mid;
    else hi = mid;
  }
  return lo;
}

// Combine HP et ATK de la carte en une seule "puissance de vie encaissable" :
// dégâts rendus sur la durée de survie (cardHp / enemyAtk, avec enemyAtk = enemyHp / 2).
// but = enemyHp telle que cardAtk * (2 * cardHp / enemyHp) >= enemyHp, soit enemyHp <= sqrt(2 * cardHp * cardAtk).
export function estimatedTargetHp(cardHp, cardAtk) {
  if (!(cardHp > 0) || !(cardAtk > 0)) return null;
  return Math.sqrt(2 * cardHp * cardAtk);
}
