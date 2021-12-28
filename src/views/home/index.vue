<template>
  <div class="home">
    <div class="home-list">
      <project></project>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { IpcMainEvent } from 'electron'
import project from './modules/project.vue'
export default defineComponent({
  name: 'HomePage',
  components: {
    project
  },
  setup(props, ctx) {
    const { global } = useGlobalProperties()

    const clickon = () => {
      console.log('点击了')
      global.ipcRenderer.send('openFolder')
    }
    onMounted(() => {
      global.ipcRenderer.on('openFolderReply', (event: IpcMainEvent, arg: any) => {
        console.log(event, arg)
      })
    })
    return {
      clickon
    }
  }
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
