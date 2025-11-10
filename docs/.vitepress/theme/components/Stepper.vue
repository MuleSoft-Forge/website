<template>
  <div class="stepper">
    <slot />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

// Step counter starting at 1
const stepCount = ref(0)

// Registration function that returns the next step number
const registerStep = () => {
  stepCount.value += 1
  return stepCount.value
}

// Provide the registration function to child Step components
provide('registerStep', registerStep)
</script>

<style scoped>
.stepper {
  margin: 24px 0;
}
</style>
