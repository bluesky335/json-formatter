<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
// 折叠资源引入:开始
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/foldgutter.js';
// 启用placeholder
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/addon/selection/active-line.js';

import {
  onBeforeUnmount, onMounted, ref,
} from 'vue';

const codeEditorNode = ref(null);

let editor:any | null = null;
interface Props {
    modelValue:string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
});

const emits = defineEmits<{(e:'update:modelValue', value:string):void}>();

onMounted(() => {
  editor = CodeMirror.fromTextArea(codeEditorNode.value, {
    value: props.modelValue,
    mode: 'javascript',
    // indentWithTabs: false, // 在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
    smartIndent: true, // 自动缩进，设置是否根据上下文自动缩进（和上一行相同的缩进量）。默认为true
    lineNumbers: true, // 是否在编辑器左侧显示行号
    matchBrackets: true, // 括号匹配
    // 启用代码折叠相关功能:开始
    foldGutter: true,
    lineWrapping: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    // 启用代码折叠相关功能:结束
    styleActiveLine: true, // 光标行高亮
  });
  editor.on('change', () => {
    // 触发v-model的双向绑定
    emits('update:modelValue', editor?.getValue());
  });
});
onBeforeUnmount(() => {
  if (editor !== null) {
    editor.toTextArea();
    editor = null;
  }
});

function setValue(text:string) {
  editor.setValue(text);
}

defineExpose({
  setValue,
});

</script>
<template>
  <textarea
    ref="codeEditorNode"
  />
</template>
<style>
.CodeMirror {
    height: 100%;
        line-height: 1.5rem;
        font-size: 1rem;
        /* border: none;
        outline: none; */
        background: none;
}
</style>
