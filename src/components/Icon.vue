<template>
  <i :class="[`iconfont mp-${icon}`, customClass]" :style="styles" @click="$emit('click')"></i>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
export default defineComponent({
  props: {
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: '12px'
    },
    color: {
      type: String,
      default: ''
    },
    customStyle: {
      type: Object,
      default: () => {}
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const styles = computed(() => {
      return {
        color: props.color,
        fontSize: /[a-z]+/.test(props.size.toString()) ? props.size : `${props.size}px`,
        ...props.customStyle
      }
    })
    return {
      styles
    }
  }
})
</script>

<style lang="scss" scoped></style>
