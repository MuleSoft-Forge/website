<template>
  <div :class="['hint', `hint-${type}`]" role="note" :aria-label="`${type} message`">
    <span class="hint-icon" aria-hidden="true">{{ icon }}</span>
    <div class="hint-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => {
      const validTypes = ['success', 'info', 'warning', 'danger']
      if (!validTypes.includes(value)) {
        console.warn(`[Hint] Invalid type "${value}". Must be one of: ${validTypes.join(', ')}`)
        return false
      }
      return true
    }
  }
})

// Icon mapping for each hint type
const icon = computed(() => {
  const icons = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    danger: '✕'
  }
  return icons[props.type] || icons.info
})
</script>

<style scoped>
.hint {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin: 16px 0;
  border-radius: 6px;
  border-left: 4px solid;
  font-size: 14px;
  line-height: 1.6;
}

.hint-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 18px;
  font-weight: bold;
}

.hint-content {
  flex: 1;
  min-width: 0;
}

/* Success variant - green */
.hint-success {
  background-color: #e8f5e9;
  border-left-color: #4caf50;
  color: #1b5e20;
}

.hint-success .hint-icon {
  color: #4caf50;
}

/* Info variant - blue */
.hint-info {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
  color: #0d47a1;
}

.hint-info .hint-icon {
  color: #2196f3;
}

/* Warning variant - orange */
.hint-warning {
  background-color: #fff3e0;
  border-left-color: #ff9800;
  color: #e65100;
}

.hint-warning .hint-icon {
  color: #ff9800;
}

/* Danger variant - red */
.hint-danger {
  background-color: #ffebee;
  border-left-color: #f44336;
  color: #b71c1c;
}

.hint-danger .hint-icon {
  color: #f44336;
}

/* Dark mode support */
.dark .hint-success {
  background-color: rgba(76, 175, 80, 0.15);
  color: #a5d6a7;
}

.dark .hint-info {
  background-color: rgba(33, 150, 243, 0.15);
  color: #90caf9;
}

.dark .hint-warning {
  background-color: rgba(255, 152, 0, 0.15);
  color: #ffb74d;
}

.dark .hint-danger {
  background-color: rgba(244, 67, 54, 0.15);
  color: #ef5350;
}

/* Ensure nested elements inherit proper styling */
.hint-content :deep(p) {
  margin: 0;
}

.hint-content :deep(p + p) {
  margin-top: 8px;
}

.hint-content :deep(code) {
  background-color: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.dark .hint-content :deep(code) {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
