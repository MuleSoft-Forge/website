<script setup lang="ts">
import { computed, ref } from 'vue'
import { data } from '../../forge/forge.data.js'
import { ASSET_TYPES, mavenUrl } from '../../forge/catalog.js'

const props = defineProps<{ id: string }>()

const asset = computed(() => data.assets.find((a) => a.id === props.id))

const dependency = computed(() => {
  const a = asset.value
  if (!a?.maven) return ''
  return `<dependency>
    <groupId>${a.maven.groupId}</groupId>
    <artifactId>${a.maven.artifactId}</artifactId>
    <version>${a.version}</version>
    <classifier>mule-plugin</classifier>
</dependency>`
})

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(dependency.value || asset.value?.install?.url || '')
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <aside v-if="asset" class="glance" aria-label="At a glance">
    <div class="glance-head">
      <span class="glance-title">At a glance</span>
      <span v-if="asset.isNew" class="glance-new">New</span>
      <span class="glance-type">{{ ASSET_TYPES[asset.type] }}</span>
    </div>

    <dl class="glance-facts">
      <div v-if="asset.version">
        <dt>Latest version</dt>
        <dd>
          <a v-if="asset.maven" :href="mavenUrl(asset.maven, asset.version)" target="_blank" rel="noopener">{{ asset.version }}</a>
          <span v-else>{{ asset.version }}</span>
        </dd>
      </div>
      <div v-if="asset.requires">
        <dt>Requires</dt>
        <dd>{{ asset.requires }}</dd>
      </div>
      <div v-if="asset.java">
        <dt>Java</dt>
        <dd>{{ asset.java }}</dd>
      </div>
      <div v-if="asset.license">
        <dt>License</dt>
        <dd>{{ asset.license }}</dd>
      </div>
      <div v-if="asset.maven">
        <dt>Published to</dt>
        <dd><a :href="mavenUrl(asset.maven)" target="_blank" rel="noopener">Maven Central</a></dd>
      </div>
      <div v-if="asset.repo">
        <dt>Source</dt>
        <dd>
          <a :href="asset.repo" target="_blank" rel="noopener">GitHub</a>
          ·
          <a :href="`${asset.repo}/issues`" target="_blank" rel="noopener">Issues</a>
        </dd>
      </div>
    </dl>

    <div v-if="dependency || asset.install?.url" class="glance-install">
      <div class="glance-install-head">
        <span>{{ dependency ? 'pom.xml' : 'Update site' }}</span>
        <button type="button" class="glance-copy" @click="copy">{{ copied ? 'Copied' : 'Copy' }}</button>
      </div>
      <pre><code>{{ dependency || asset.install.url }}</code></pre>
    </div>
  </aside>
</template>

<style scoped>
.glance {
  margin: 20px 0 28px;
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.glance-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.glance-title {
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-1);
  margin-right: auto;
}

.glance-new,
.glance-type {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.glance-new {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.glance-facts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px 20px;
  margin: 0;
}

.glance-facts dt {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.glance-facts dd {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.glance-install {
  margin-top: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-code-block-bg);
}

.glance-install-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}

.glance-copy {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 12px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.glance-copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.glance-install pre {
  margin: 0;
  padding: 12px 14px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
}

.glance-install code {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-code-block-color);
  background: none;
  padding: 0;
}
</style>
