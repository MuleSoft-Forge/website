<template>
  <div class="step">
    <div class="step-header">
      <div class="step-indicator">
        <div class="step-number">{{ stepNumber }}</div>
      </div>
      <div class="step-title-wrapper">
        <h3 class="step-title">{{ title }}</h3>
      </div>
    </div>
    <div class="step-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// Inject the registration function from parent Stepper
const registerStep = inject('registerStep', null)

// Register step immediately during setup (works with SSR)
// This runs during both server-side rendering and client-side initialization
const stepNumber = ref(registerStep ? registerStep() : '?')

// Warn if Step is used outside of Stepper (only in development)
if (!registerStep && import.meta.env.DEV) {
  console.warn('[Step] Step component must be used within a Stepper component')
}
</script>

<style scoped>
.step {
  position: relative;
  margin-bottom: 32px;
}

.step:last-child {
  margin-bottom: 0;
}

.step-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.step-indicator {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--vp-c-brand-1, #3451b2);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 16px;
  z-index: 1;
  position: relative;
}

/* Connector line using ::after pseudo-element on .step */
/* This spans the full height from badge to next step */
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 16px; /* Center of the 32px badge */
  top: 32px; /* Start below the badge */
  bottom: -32px; /* Extend into margin to reach next step */
  width: 2px;
  background-color: var(--vp-c-divider, #e2e8f0);
  z-index: 0;
}

.step-title-wrapper {
  flex: 1;
  padding-top: 4px;
}

.step-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.step-content {
  margin-left: 48px;
  padding-left: 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

/* Responsive adjustments for mobile */
@media (max-width: 640px) {
  .step-number {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .step-header {
    gap: 12px;
  }

  .step-title {
    font-size: 16px;
  }

  .step-content {
    margin-left: 40px;
  }

  /* Adjust connector for smaller badge on mobile */
  .step:not(:last-child)::after {
    left: 14px; /* Center of the 28px badge */
    top: 28px; /* Start below smaller badge */
  }
}

/* Nested content styling */
.step-content :deep(p) {
  margin: 12px 0;
}

.step-content :deep(p:first-child) {
  margin-top: 0;
}

.step-content :deep(p:last-child) {
  margin-bottom: 0;
}

.step-content :deep(ul),
.step-content :deep(ol) {
  margin: 12px 0;
  padding-left: 20px;
}

.step-content :deep(li) {
  margin: 6px 0;
}

.step-content :deep(code) {
  font-size: 0.9em;
}

.step-content :deep(pre) {
  margin: 16px 0;
}

/* Support nested Hint components */
.step-content :deep(.hint) {
  margin: 16px 0;
}

/* Dark mode adjustments */
.dark .step-number {
  background-color: var(--vp-c-brand-1, #4a9eff);
}

.dark .step:not(:last-child)::after {
  background-color: var(--vp-c-divider, #2e2e32);
}
</style>
