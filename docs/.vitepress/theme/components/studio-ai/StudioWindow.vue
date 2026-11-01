<script setup>
defineProps({ title: { type: String, default: 'Anypoint Studio' } })
</script>

<template>
  <div class="win">
    <div class="win-bar">
      <span class="dot red" /><span class="dot amber" /><span class="dot green" />
      <span class="win-title">{{ title }}</span>
    </div>
    <div class="win-body"><slot /></div>
  </div>
</template>

<style scoped>
.win {
  border-radius: 12px;
  overflow: hidden;
  background: #0f1420;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 30px 80px -20px rgba(0, 20, 60, 0.55),
    0 0 0 1px rgba(0, 163, 224, 0.08);
}

.win-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  background: #171d2b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.red { background: #ff5f57; }
.amber { background: #febc2e; }
.green { background: #28c840; }

.win-title {
  flex: 1;
  margin-right: 40px;
  text-align: center;
  font-size: 12px;
  color: #8b95a8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
