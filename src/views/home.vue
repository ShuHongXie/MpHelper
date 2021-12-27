<template>
  <div class="home">1232</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
export default defineComponent({
  name: 'HomePage',
  setup(props, ctx) {
    function padLeft(padding: number | string, input: string) {
      if (typeof padding === 'number') {
        return ' '.repeat(padding) + input
      }
      return padding + input
    }

    const upload = (e: Event) => {
      console.log(e)
    }

    onMounted(() => {
      padLeft('xxx', 'xxx')
    })
    return {
      upload,
    }
  },
})
</script>

<style scoped="scss">
.test {
  display: block;
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
