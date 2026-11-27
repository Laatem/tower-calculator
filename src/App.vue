<script setup>
import { ref } from "vue";
import { useTowerTier } from "./composables/useTowerTier";
import { useSpeedTower } from "./composables/useSpeedTower";
import { useTheme } from "./composables/useTheme";
import { useLocale } from "./composables/useLocale";
import Sidebar from "./components/Sidebar.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import StageStats from "./components/StageStats.vue";
import TierTable from "./components/TierTable.vue";
import WipPanel from "./components/WipPanel.vue";
import CardEstimateTool from "./components/CardEstimateTool.vue";
import RarityCalculatorTool from "./components/RarityCalculatorTool.vue";

const {
  tierId,
  tier,
  availableTiers,
  climbersCharm,
  maskedManCharm,
  swarmMutation,
  vanguardMutation,
  workshopLevel,
  workshopLevelMin,
  workshopLevelMax,
  cardsBonusPercent,
  hp,
  atkFromHp,
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
const settingsOpen = ref(false);
</script>

<template>
  <div class="page">
    <div class="wrap">
      <div class="shell">
        <header class="topbar">
          <div class="brand">
            <span>{{ t("brandLine1") }}</span>
            <span>{{ t("brandLine2") }}</span>
          </div>
          <nav class="tabs" role="tablist">
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
            <button
              type="button"
              role="tab"
              class="tab-btn"
              :class="{ active: activeTab === 'rarity' }"
              :aria-selected="activeTab === 'rarity'"
              @click="activeTab = 'rarity'"
            >{{ t("tabRarity") }}</button>
          </nav>
          <div class="gear-wrap">
            <button
              type="button"
              class="gear-btn"
              :class="{ active: settingsOpen }"
              :aria-expanded="settingsOpen"
              :aria-label="t('settingsTitle')"
              @click="settingsOpen = !settingsOpen"
            >⚙</button>
            <div v-if="settingsOpen" class="settings-overlay">
              <SettingsPanel
                :theme="theme"
                :palette="palette"
                :palettes="palettes"
                @toggle-theme="toggleTheme"
                @select-palette="setPalette"
                @reset="resetAll"
              />
            </div>
          </div>
        </header>
        <div v-if="settingsOpen" class="settings-backdrop" @click="settingsOpen = false"></div>

        <div class="body" :class="{ full: activeTab === 'rarity' }">
          <Sidebar
            v-if="activeTab !== 'rarity'"
            :visible="activeTab === 'calculator'"
            v-model:tierId="tierId"
            :available-tiers="availableTiers"
            v-model:climbers-charm="climbersCharm"
            v-model:masked-man-charm="maskedManCharm"
            v-model:swarm-mutation="swarmMutation"
            v-model:vanguard-mutation="vanguardMutation"
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
            <div class="panels">
              <div class="panel" :class="{ hidden: activeTab !== 'calculator' }">
                <WipPanel v-if="tier.wip" :tier-label="tier.label" />
                <template v-else>
                  <StageStats
                    :hp="hp"
                    :atk-from-hp="atkFromHp"
                    :cards="cards"
                    :has-cards="!!tier.cards"
                    :tier-label="tier.label"
                    :effective-speed="effectiveSpeed"
                    :hp-calibration="tier.hpCalibration"
                    :cards-calibration="tier.cardsCalibration"
                  />
                  <TierTable :hp="hp" :atk-from-hp="atkFromHp" :cards="cards" :tier-label="tier.label" />
                </template>
              </div>
              <div class="panel" :class="{ hidden: activeTab !== 'estimate' }">
                <CardEstimateTool v-model:swarm-mutation="swarmMutation" v-model:vanguard-mutation="vanguardMutation" />
              </div>
              <div class="panel" :class="{ hidden: activeTab !== 'rarity' }">
                <RarityCalculatorTool />
              </div>
            </div>
          </main>
        </div>
      </div>
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
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Le header (logo + onglets + réglages) est toujours pleine largeur et stable : passer en
   plein largeur sur Raretés (sidebar retirée) ne le déplace jamais. */
.topbar {
  display: grid;
  grid-template-columns: 320px 1fr auto;
  align-items: stretch;
  border-bottom: 2px solid var(--color-text);
}
.brand {
  display: flex; flex-direction: column;
  font-family: var(--font-heading); font-weight: 800; font-size: 24px; line-height: 1.05;
  letter-spacing: -0.02em;
  padding: 20px 24px;
  border-right: 2px solid var(--color-text);
  justify-content: center;
}

.tabs { display: flex; align-items: stretch; }
.tab-btn {
  padding: 16px 24px; font: 700 14px var(--font-heading); letter-spacing: 0.02em;
  color: var(--color-neutral-700); background: transparent; border: 0;
  border-bottom: 3px solid transparent; margin-bottom: -2px; cursor: pointer;
}
.tab-btn:hover { color: var(--color-text); }
.tab-btn.active { color: var(--color-accent-700); border-bottom-color: var(--color-accent); }

.gear-wrap { position: relative; border-left: 2px solid var(--color-text); }
.gear-btn {
  width: 100%; height: 100%; min-width: 56px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: var(--color-neutral-700); background: transparent; border: 0; cursor: pointer;
}
.gear-btn:hover, .gear-btn.active { color: var(--color-accent-700); }
.settings-overlay { position: absolute; top: 100%; right: 0; z-index: 20; }
.settings-backdrop { position: fixed; inset: 0; z-index: 10; }

.body { display: grid; grid-template-columns: 320px 1fr; }
.body.full { grid-template-columns: 1fr; }

main { display: flex; flex-direction: column; min-width: 0; }

/* Les 3 panneaux restent montés, superposés dans la même cellule de grille : la hauteur
   de main suit toujours le plus grand des trois (en général le Calculateur), même quand
   un panneau plus court est affiché, pour éviter que la page se tasse en changeant d'onglet. */
.panels { display: grid; flex: 1; }
.panel {
  grid-row: 1; grid-column: 1;
  display: flex; flex-direction: column; min-width: 0;
}
.panel.hidden { visibility: hidden; pointer-events: none; }

@media (max-width: 860px) {
  .tab-btn { padding: 14px 20px; }
}

/* Palier tablette : sidebar resserrée mais toujours à côté du contenu. */
@media (max-width: 1024px) {
  .topbar { grid-template-columns: 260px 1fr auto; }
  .body { grid-template-columns: 260px 1fr; }
}

@media (max-width: 860px) {
  .page { padding: 0; }
  .shell { box-shadow: none; }
  .topbar { grid-template-columns: 1fr auto; }
  .brand { display: none; }
  .body, .body.full { grid-template-columns: 1fr; }
  .settings-overlay { position: fixed; top: auto; right: 8px; left: 8px; bottom: 8px; }
}
</style>
