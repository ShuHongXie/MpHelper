<template>
  <div class="home">
    <div class="home-list">
      <project @upload="upload"></project>
      <el-button type="primary">Primary</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { IpcMainEvent } from 'electron'
import project from './modules/project.vue'
import { listBranches } from 'isomorphic-git'
import FS from '@isomorphic-git/lightning-fs'
import path from 'path/posix'
const fs = new FS('fs')

export default defineComponent({
  name: 'HomePage',
  components: {
    project
  },
  setup(props, ctx) {
    const { global } = useGlobalProperties()

    const upload = () => {
      console.log('点击了')
      global.ipcRenderer.send('openFolder')
    }
    onMounted(() => {
      global.ipcRenderer.on('openFolderReply', async (event: IpcMainEvent, dir: string) => {
        if (dir) {
          // console.log(fs, dir)
          // let branches = await listBranches({ fs, dir, gitdir: path.join(dir, '.git') })
          // console.log(branches)
        }
      })
    })
    return {
      upload
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
