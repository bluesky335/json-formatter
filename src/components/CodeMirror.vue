<script lang="ts" setup>
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentOnInput } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

import { onMounted, ref } from "vue";

const codeEditorNode = ref(undefined);

let editor: EditorView | null = null;

interface Props {
  modelValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
});

const emits = defineEmits<{ (e: "update:modelValue", value: string): void }>();

let changeTimer = -1;

const onDocChange = () => {
  setTimeout(() => {
    const newDoc = editor?.state.doc.toString();
    if (newDoc) emits("update:modelValue", newDoc);
  }, 1000);
};

onMounted(() => {
  editor = new EditorView({
    doc: props.modelValue,
    parent: codeEditorNode.value,
    extensions: [
      basicSetup,
      keymap.of([indentWithTab]),
      javascript(),
      indentOnInput(),
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          clearTimeout(changeTimer);
          changeTimer = setTimeout(onDocChange, 100);
        }
      }),
    ],
  });
});

function setValue(text: string) {
  editor?.dispatch({
    changes: { from: 0, to: editor.state.doc.length, insert: text },
  });
}

defineExpose({
  setValue,
});
</script>
<template>
  <div class="code-editor" ref="codeEditorNode" />
</template>
<style>
.CodeMirror {
  height: 100%;
  line-height: 1.5rem;
  font-size: 1rem;
  background: none;
}
.cm-editor {
  height: 100%;
}
</style>
