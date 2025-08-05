<script lang="ts" setup>
import { ref, computed } from "vue";
import JsonPreview from "../components/JsonPreview.vue";
import CodeMirrorVue from "../components/CodeMirror.vue";
import DragEdge from "../components/DragEdge.vue";

const text = ref("");
const isOpen = ref(true);
const editorWidth = ref(50);
const isInTransition = ref(false);
const strings = ref({
  en: {
    title: "SON Format",
    copy: "Copy",
    minimize: "Minimize",
    escape: "Escape",
    unEscape: "UnEscape",
    format: "Format",
  },
  cn: {
    title: "SON 格式化",
    copy: "复制",
    minimize: "压缩",
    escape: "转义",
    unEscape: "取消转义",
    format: "格式化",
  },
});

const local = computed(() => {
  if (navigator.language.startsWith("zh")) {
    return strings.value.cn;
  }
  return strings.value.en;
});

const codeMirror = ref<InstanceType<typeof CodeMirrorVue> | null>(null);

function minJson() {
  const obj = JSON.parse(text.value);
  if (obj !== undefined) {
    codeMirror.value?.setValue(JSON.stringify(obj));
  }
}

function formatJson() {
  const obj = JSON.parse(text.value);
  if (obj !== undefined) {
    codeMirror.value?.setValue(JSON.stringify(obj, null, "  "));
  }
}

function copyJson() {
  navigator.clipboard.writeText(text.value);
}

function escapeJson() {
  const obj = JSON.stringify(text.value);
  codeMirror.value?.setValue(obj);
}

function unEscapeJson() {
  try {
    let str = text.value;
    if (str && (/^ ?`.*?` ?$/.test(str) || /^ ?'.*?' ?$/.test(str))) {
      str = eval(`let x = ${str}\nx`);
      codeMirror.value?.setValue(JSON.stringify(JSON.parse(str)));
      return;
    }
    const obj = JSON.parse(str);
    if (typeof obj === "string") {
      codeMirror.value?.setValue(obj);
    }
  } catch (err) {
    console.log(err);
  }
}

let currentWidth: number | null = null;

function onDragEdgeStart() {
  currentWidth = editorWidth.value;
}

function onDragEdgeChange(offset: { x: number; y: number }) {
  if (currentWidth === null) {
    return;
  }
  let percent = (offset.x / window.innerWidth) * 100;
  let v = currentWidth + percent;
  if (v < 0) {
    v = 0;
  } else if (v > 100) {
    v = 100;
  }
  editorWidth.value = v;
}

function onDragEdgeEnd() {
  currentWidth = null;
}

function togleFullView() {
  isInTransition.value = true;
  setTimeout(() => {
    isInTransition.value = false;
  }, 500);
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    editorWidth.value = 50;
  } else {
    editorWidth.value = 0;
  }
}
</script>
<template>
  <div class="json-formatter">
    <div class="title">
      <div>
        <span style="color: #41b883; font-size: 3.5rem">J</span
        >{{ local.title }}
      </div>
      <div class="github">
        <a href="https://github.com/bluesky335/json-formatter">
          <img src="/src/assets/github.svg" alt="github" />
        </a>
      </div>
    </div>
    <div class="main" :class="isOpen ? 'main-open' : 'main-close'">
      <div
        class="code-editor-wrap"
        :class="{ 'code-editor-wrap-transition': isInTransition }"
        :style="{ width: `${editorWidth}%` }"
      >
        <div class="tool-bar">
          <button @click="minJson" class="action-button">
            {{ local.minimize }}
          </button>
          <button @click="formatJson" class="action-button">
            {{ local.format }}
          </button>
          <button @click="escapeJson" class="action-button">
            {{ local.escape }}
          </button>
          <button @click="unEscapeJson" class="action-button">
            {{ local.unEscape }}
          </button>
          <button @click="copyJson" class="action-button">
            {{ local.copy }}
          </button>
        </div>
        <CodeMirrorVue ref="codeMirror" v-model="text" class="code-editor" />
      </div>
      <div
        class="json-preview-wrap"
        :style="{ width: `${100 - editorWidth}%` }"
      >
        <DragEdge
          vertical
          @dragStart="onDragEdgeStart"
          @drag="onDragEdgeChange"
          @dragEnd="onDragEdgeEnd"
        />
        <div class="togle-button" @click="togleFullView">
          <img
            v-if="isOpen"
            src="/src/assets/fill-width.svg"
            draggable="false"
          />
          <img v-else src="/src/assets/small-width.svg" draggable="false" />
        </div>
        <JsonPreview :json="text" class="json-preview" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use "./home-page.scss" as *;
</style>
