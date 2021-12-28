<template>
  <el-image
    :src="src"
    :fit="fit"
    :style="style"
    :hide-on-click-modal="hideOnClickModal"
    :preview-src-list="previewSrcList"
  >
  </el-image>
</template>

<script lang="ts">
import { PropType, defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  props: {
    src: {
      type: String,
      default: ''
    },
    fit: {
      type: String as any,
      default: ''
    },
    style: {
      type: Object,
      default: () => {}
    },
    lazy: {
      type: Boolean,
      default: true
    },
    hideOnClickModal: {
      type: Boolean,
      default: true
    },
    previewSrcList: {
      type: Array as PropType<Array<string>>,
      default: () => {}
    }
  },
  setup(props, ctx) {
    onMounted(() => {})
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
