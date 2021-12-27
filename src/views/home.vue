<template>
  <div class="test" @click="clickon">1232</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
export default defineComponent({
  name: 'HomePage',
  setup(props, ctx) {
    const { global } = useGlobalProperties()
    const clickon = () => {
      console.log(global)

      global.ipcRenderer.send('open')
    }
    onMounted(() => {})
    return {
      clickon,
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
