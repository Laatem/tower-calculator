<script setup>
import { useLocale } from "../composables/useLocale";

const props = defineProps({
  tierLabel: { type: String, required: true },
});

const { t } = useLocale();
</script>

<template>
  <section class="wip" aria-live="polite">
    <span class="tag tag-outline">WIP</span>
    <h2>{{ t("wipTitle", { tier: tierLabel }) }}</h2>
    <p>{{ t("wipBody") }}</p>
  </section>
</template>

<style scoped>
.wip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  padding: 64px 40px;
  min-height: 320px;
}
.wip h2 { font-size: 24px; }
.wip p { margin: 0; max-width: 42ch; color: var(--color-neutral-700); font-size: 15px; }

@media (max-width: 860px) {
  .wip { padding: 48px 20px; min-height: 240px; }
}
</style>
