<script setup>
import { computed } from "vue";
import { abbr, fmtExact } from "../lib/format";
import { useLocale } from "../composables/useLocale";

const { localeTag, t } = useLocale();

const props = defineProps({
  hp: { type: Function, required: true },
  atk: { type: Function, required: true },
  spAtk: { type: Function, required: true },
  spHp: { type: Function, required: true },
  cards: { type: Function, required: true },
  tierLabel: { type: String, required: true },
});

const STAGES = [1, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

const rows = computed(() =>
  STAGES.map((s) => ({
    s,
    hp: abbr(props.hp(s)),
    atk: abbr(props.atk(s)),
    special: `${abbr(props.spAtk(s))} / ${abbr(props.spHp(s))}`,
    cards: props.cards(s) == null ? "–" : abbr(props.cards(s)),
  }))
);
</script>

<template>
  <section class="paliers" aria-labelledby="t3">
    <div class="paliers-head">
      <h2 id="t3">{{ t("milestones") }}</h2>
      <span class="sub">{{ t("milestonesSub", { tier: tierLabel }) }}</span>
    </div>
    <div class="tbl">
      <table>
        <thead>
          <tr>
            <th>{{ t("colStage") }}</th>
            <th>{{ t("colHp") }}</th>
            <th>{{ t("colAtk") }}</th>
            <th>{{ t("colSpecial") }}</th>
            <th>{{ t("colCards") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.s">
            <td class="stage">{{ fmtExact(row.s, localeTag) }}</td>
            <td>{{ row.hp }}</td>
            <td>{{ row.atk }}</td>
            <td class="muted">{{ row.special }}</td>
            <td class="cards">{{ row.cards }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.paliers { padding: 40px 40px 32px; display: flex; flex-direction: column; gap: 16px; }
.paliers-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.paliers-head h2 { font-size: 24px; }
.sub { font-size: 13px; color: var(--color-neutral-700); }

.tbl { overflow-x: auto; margin: 0 -40px; padding: 0 40px; }
table { width: 100%; min-width: 640px; border-collapse: collapse; font-variant-numeric: tabular-nums; font-size: 15px; }
th {
  text-align: right; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--color-neutral-700); padding: 10px 12px; border-bottom: 2px solid var(--color-divider);
}
td { text-align: right; padding: 10px 12px; border-bottom: 1px solid var(--color-divider-soft); }
th:first-child, td:first-child { text-align: left; }
td.stage { font-family: var(--font-heading); font-weight: 800; }
td.muted { color: var(--color-neutral-700); }
td.cards { font-weight: 600; color: var(--color-accent-700); }

@media (max-width: 860px) {
  .paliers { padding: 28px 20px 24px; }
  .tbl { margin: 0 -20px; padding: 0 20px; }
}
</style>
