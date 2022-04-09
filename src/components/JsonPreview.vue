<script setup  lang="ts">
import { ref, watch } from 'vue';
import JsonNode from './JsonNode.vue';

const props = defineProps({
  json: {
    type: String,
    default: '',
  },
});

const jsonObject = ref(undefined);

const jsonError = ref(null as Error | null);

watch(props, (newValue) => {
  try {
    const obj = JSON.parse(newValue.json);
    jsonObject.value = undefined;
    jsonObject.value = obj;
    jsonError.value = null;
  } catch (error) {
    jsonObject.value = undefined;
    jsonError.value = error as Error;
  }
});

</script>
<template>
  <div class="preview-container">
    <JsonNode
      v-if="jsonObject !== undefined"
      :json-value="jsonObject"
    />
    <div v-if="jsonError">
      {{ jsonError }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.preview-container {
    text-align: left;
    line-height: 2rem;
    overflow-y: auto;
    word-wrap: break-word;
}
</style>
