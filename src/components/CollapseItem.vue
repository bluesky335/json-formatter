<template>
  <div
    ref="box"
    class="box"
  >
    <transition
      :css="false"
      @enter="enter"
      @leave="leave"
      @after-enter="afterEnter"
    >
      <slot ref="slotItem" />
    </transition>
  </div>
</template>
<script lang="ts" setup>import { onMounted, ref } from 'vue';

interface Props {
  duration:number
}
const props = withDefaults(defineProps<Props>(), { duration: 0.3 });
const box = ref<HTMLElement | null>(null);
const slotItem = ref<HTMLElement | null>(null);
onMounted(() => {
  if (box.value && slotItem.value) {
    if (slotItem.value) {
      if (box.value.scrollHeight !== slotItem.value.scrollHeight) {
        box.value.style.height = `${slotItem.value.scrollHeight}px`;
      }
    } else {
      box.value.style.height = '';
    }
  }
});

function enter(el:HTMLElement, doen:()=>void) {
  if (box.value) {
    box.value.style.height = '0';
    box.value.style.overflow = 'hidden';
  }
  doen();
}
function leave(el:HTMLElement, doen:()=>void) {
  const { height } = window.getComputedStyle(el);
  el.setAttribute('style', `transition:all ${props.duration}s ease-in-out; height:${height} !important;overflow: hidden;`);
  setTimeout(() => {
    el.setAttribute('style', `transition:all ${props.duration}s ease-in-out; height:0px !important;overflow: hidden;`);
  }, 5);
  setTimeout(() => {
    el.setAttribute('style', 'display:none;');
    doen();
  }, props.duration * 1000 + 10);
}
function afterEnter(el:HTMLElement) {
  if (!box.value) {
    return;
  }
  box.value.style.transition = `all ${props.duration}s ease-in-out`;
  setTimeout(() => {
    if (!box.value) {
      return;
    }
    const { height } = window.getComputedStyle(el);
    console.log(height, el.scrollHeight, el.offsetHeight);
    box.value.style.height = height;
    setTimeout(() => {
      if (box.value) {
        box.value.setAttribute('style', '');
      }
    }, props.duration * 1000 + 20);
  }, 10);
}
</script>
<style lang="scss" scoped>

</style>
