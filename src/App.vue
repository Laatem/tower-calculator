<script setup>
import { ref } from "vue";
import { useTowerTier } from "./composables/useTowerTier";
import { useSpeedTower } from "./composables/useSpeedTower";
import { useTheme } from "./composables/useTheme";
import { useLocale } from "./composables/useLocale";
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";
import StageStats from "./components/StageStats.vue";
import TierTable from "./components/TierTable.vue";
import WipPanel from "./components/WipPanel.vue";
import CardEstimateTool from "./components/CardEstimateTool.vue";

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
  cards,
  resetSettings,
} = useTowerTier();

const {
  workshopSpeedLevel,
  workshopSpeedLevelMin,
  workshopSpeedLevelMax,
  potionV,
  baseSpeedInput,
  speedBonusPercent,
  effectiveSpeed,
  effectiveSpeedLabel,
  resetSpeedSettings,
} = useSpeedTower(climbersCharm, maskedManCharm);

const { theme, toggleTheme, palette, setPalette, palettes, resetTheme } = useTheme();
const { resetLocale, t } = useLocale();

function resetAll() {
  resetSettings();
  resetSpeedSettings();
  resetTheme();
  resetLocale();
}

const activeTab = ref("calculator");
</script>

<template>
  <div class="page">
    <div class="wrap">
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
          v-model:workshop-speed-level="workshopSpeedLevel"
          :workshop-speed-level-min="workshopSpeedLevelMin"
          :workshop-speed-level-max="workshopSpeedLevelMax"
          v-model:potion-v="potionV"
          v-model:base-speed-input="baseSpeedInput"
          :speed-bonus-percent="speedBonusPercent"
          :effective-speed-label="effectiveSpeedLabel"
        />

        <main>
          <div class="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              class="tab-btn"
              :class="{ active: activeTab === 'calculator' }"
              :aria-selected="activeTab === 'calculator'"
              @click="activeTab = 'calculator'"
            >{{ t("tabCalculator") }}</button>
            <button
              type="button"
              role="tab"
              class="tab-btn"
              :class="{ active: activeTab === 'estimate' }"
              :aria-selected="activeTab === 'estimate'"
              @click="activeTab = 'estimate'"
            >{{ t("tabEstimate") }}</button>
          </div>

          <template v-if="activeTab === 'calculator'">
            <WipPanel v-if="tier.wip" :tier-label="tier.label" />
            <template v-else>
              <StageStats
                :hp="hp"
                :atk="atk"
                :cards="cards"
                :has-cards="!!tier.cards"
                :tier-label="tier.label"
                :effective-speed="effectiveSpeed"
              />
              <TierTable :hp="hp" :atk="atk" :cards="cards" :tier-label="tier.label" />
            </template>
          </template>
          <CardEstimateTool v-else />
        </main>
      </div>

      <Footer
        :theme="theme"
        :palette="palette"
        :palettes="palettes"
        @toggle-theme="toggleTheme"
        @select-palette="setPalette"
        @reset="resetAll"
      />
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

.wrap {
  width: 100%;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
}

.shell {
  background: var(--color-bg);
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-columns: 320px 1fr;
}

main { display: flex; flex-direction: column; min-width: 0; }

.tabs { display: flex; border-bottom: 2px solid var(--color-text); }
.tab-btn {
  padding: 16px 24px; font: 700 14px var(--font-heading); letter-spacing: 0.02em;
  color: var(--color-neutral-700); background: transparent; border: 0;
  border-bottom: 3px solid transparent; margin-bottom: -2px; cursor: pointer;
}
.tab-btn:hover { color: var(--color-text); }
.tab-btn.active { color: var(--color-accent-700); border-bottom-color: var(--color-accent); }

@media (max-width: 860px) {
  .tab-btn { padding: 14px 20px; }
}

/* Palier tablette : sidebar resserrée mais toujours à côté du contenu. */
@media (max-width: 1024px) {
  .shell { grid-template-columns: 260px 1fr; }
}

@media (max-width: 860px) {
  .page { padding: 0; }
  .shell { grid-template-columns: 1fr; box-shadow: none; }
}
</style>
