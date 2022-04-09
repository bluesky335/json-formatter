<script lang="ts" setup>

import { ref, computed } from 'vue';
import JsonPreview from '../components/JsonPreview.vue';

const text = ref('');

const strings = ref({
  en: {
    title: 'Json Format',
    copy: 'Copy',
    reduce: 'Reduce',
    format: 'Format',
  },
  cn: {
    title: 'Json 格式化',
    copy: '复制',
    reduce: '压缩',
    format: '格式化',
  },
});

const local = computed(() => {
  if (navigator.language.startsWith('zh')) {
    return strings.value.cn;
  }
  return strings.value.en;
});

function minJson() {
  const obj = JSON.parse(text.value);
  if (obj !== undefined) {
    text.value = JSON.stringify(obj);
  }
}

function formatJson() {
  const obj = JSON.parse(text.value);
  if (obj !== undefined) {
    text.value = JSON.stringify(obj, null, '  ');
  }
}

function copyJson() {
  navigator.clipboard.writeText(text.value);
}

</script>
<template>
  <div class="editor">
    <div class="title">
      {{ local.title }}
    </div>
    <div class="main">
      <div
        class="json-editor"
      >
        <div class="tool-bar">
          <button @click="minJson">
            {{ local.reduce }}
          </button>
          <button @click="formatJson">
            {{ local.format }}
          </button>
          <button @click="copyJson">
            {{ local.copy }}
          </button>
        </div>
        <textarea
          v-model="text"
        />
      </div>
      <div>
        <JsonPreview
          :json="text"
          class="json-preview"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import './home-page.scss'
</style>
