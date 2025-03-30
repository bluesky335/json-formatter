<template>
  <div class="drag-edge" :class="classes" @mousedown="handleDragStart"></div>
</template>
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  vertical?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  vertical: true,
});
const emits = defineEmits(["drag", "dragStart", "dragEnd"]);
const classes = computed(() => {
  return {
    "drag-edge-vertical": props.vertical,
    "drag-edge-horizontal": !props.vertical,
  };
});

let starPosition: { clientX: number; clientY: number } | null = null;

const handleDrag = (e: MouseEvent) => {
  if (!starPosition) return;
  let offset = {
    x: e.clientX - starPosition.clientX,
    y: e.clientY - starPosition.clientY,
  };
  emits("drag", offset);
};

const handleDragStart = (e: MouseEvent) => {
  if (!starPosition) {
    starPosition = {
      clientX: e.clientX,
      clientY: e.clientY,
    };
    emits("dragStart");
  }
  e.preventDefault();
};

const handleDragEnd = (e: MouseEvent) => {
  if (starPosition) {
    starPosition = null;
    emits("dragEnd");
  }
};

document.addEventListener("mouseup", handleDragEnd);
document.addEventListener("mousemove", handleDrag);
</script>
<style scoped lang="scss">
$size: 5px;

.drag-edge {
  background-color: transparent;
  transition: background-color 0.2s;
  &:hover {
    background-color: #ccc;
  }
}
.drag-edge-vertical {
  width: $size;
  height: 100%;
  cursor: ew-resize;
}
.drag-edge-horizontal {
  width: 100%;
  height: $size;
  cursor: ns-resize;
}
</style>
