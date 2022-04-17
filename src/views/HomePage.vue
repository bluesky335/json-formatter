<script lang="ts" setup>

import {
  ref, computed,
} from 'vue';
import JsonPreview from '../components/JsonPreview.vue';
import CodeMirrorVue from '../components/CodeMirror.vue';

const text = ref('');
const isOpen = ref(true);

const strings = ref({
  en: {
    title: 'SON Format',
    copy: 'Copy',
    reduce: 'Reduce',
    format: 'Format',
  },
  cn: {
    title: 'SON 格式化',
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

const codeMirror = ref<any|null>(null);

function minJson() {
  const obj = JSON.parse(text.value);
  if (obj !== undefined) {
    codeMirror.value.setValue(JSON.stringify(obj));
  }
}

function formatJson() {
  const obj = JSON.parse(text.value);
  if (obj !== undefined) {
    codeMirror.value.setValue(JSON.stringify(obj, null, '  '));
  }
}

function copyJson() {
  navigator.clipboard.writeText(text.value);
}

</script>
<template>
  <div class="editor">
    <div class="title">
      <div><span style=" color:#41B883;font-size: 3.5rem;">J</span>{{ local.title }}</div>
      <div>
        <a href="https://github.com/bluesky335/json-formatter">
          <img
            src="/src/assets/github.svg"
            alt="github"
          >
        </a>
      </div>
    </div>
    <div
      class="main"
      :class="isOpen ? 'main-open' : 'main-close'"
    >
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
        <CodeMirrorVue
          ref="codeMirror"
          v-model="text"
          class="code-editor"
        />
      </div>
      <JsonPreview
        :json="text"
        class="json-preview"
      />
      <div
        class="togle-button"
        @click="isOpen = !isOpen"
      >
        <img
          :src="isOpen ? '/src/assets/fill-width.svg' :'/src/assets/small-width.svg' "
          alt=""
        >
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import './home-page.scss'
</style>
