<script setup>
import { useTowerTier } from "./composables/useTowerTier";
import { useTheme } from "./composables/useTheme";
import { useLocale } from "./composables/useLocale";
import Sidebar from "./components/Sidebar.vue";
import StageStats from "./components/StageStats.vue";
import TierTable from "./components/TierTable.vue";
import WipPanel from "./components/WipPanel.vue";

const {
  tierId,
  tier,
  availableTiers,
  climbersCharm,
  maskedManCharm,
  workshopLevel,
  workshopLevelMin,
  workshopLevelMax,
  cardsBonusPercent,
  hp,
  atk,
  spAtk,
  spHp,
  cards,
  resetSettings,
} = useTowerTier();

const { theme, toggleTheme, resetTheme } = useTheme();
const { tierSure, resetLocale } = useLocale();

function resetAll() {
  resetSettings();
  resetTheme();
  resetLocale();
}
</script>

<template>
  <div class="page">
    <div class="shell">
      <Sidebar
        v-model:tierId="tierId"
        :available-tiers="availableTiers"
        v-model:climbers-charm="climbersCharm"
        v-model:masked-man-charm="maskedManCharm"
        v-model:workshop-level="workshopLevel"
        :workshop-level-min="workshopLevelMin"
        :workshop-level-max="workshopLevelMax"
        :cards-bonus-percent="cardsBonusPercent"
        :theme="theme"
        @toggle-theme="toggleTheme"
        @reset="resetAll"
      />

      <main>
        <WipPanel v-if="tier.wip" :tier-label="tier.label" />
        <template v-else>
          <StageStats :hp="hp" :atk="atk" :cards="cards" :has-cards="!!tier.cards" :tier-label="tier.label" />
          <TierTable :hp="hp" :atk="atk" :sp-atk="spAtk" :sp-hp="spHp" :cards="cards" :sure="tierSure(tierId)" :tier-label="tier.label" />
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28px 16px 48px;
  display: flex;
  justify-content: center;
}

.shell {
  width: 100%;
  max-width: 1280px;
  background: var(--color-bg);
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-columns: 320px 1fr;
}

main { display: flex; flex-direction: column; min-width: 0; }

/* Palier tablette : sidebar resserrée mais toujours à côté du contenu. */
@media (max-width: 1024px) {
  .shell { grid-template-columns: 260px 1fr; }
}

@media (max-width: 860px) {
  .page { padding: 0; }
  .shell { grid-template-columns: 1fr; box-shadow: none; }
}
</style>
