<template>
  <div class="home">
    <div class="home-list">
      <project
        @upload="upload"
        @edit="edit(index)"
        :data="item"
        v-for="(item, index) in list"
        :key="item.id"
      ></project>
      <project @add="upload" :data="undefined"></project>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { IpcMainEvent } from 'electron'
import project from './modules/project.vue'
// import { listBranches } from 'isomorphic-git'
// import FS from '@isomorphic-git/lightning-fs'
// const fs = new FS('fs')
import { List } from '@/entity/Db'

export default defineComponent({
  name: 'HomePage',
  components: {
    project
  },
  setup(props, ctx) {
    const { global, router } = useGlobalProperties()
    const list = ref<List[]>([])
    // ipc通信打开文件夹
    const upload = () => global.ipcRenderer.send('openFolder')
    const edit = (index: number) => {
      router.push({
        path: '/edit',
        query: {
          index
        }
      })
    }
    onMounted(() => {
      list.value = global.db.read().get('list').value()
      global.ipcRenderer.on('openFolderReply', async (event: IpcMainEvent, dir: string) => {
        if (dir) {
          // console.log(fs, dir)
          // let branches = await listBranches({ fs, dir, gitdir: path.join(dir, '.git') })
          // console.log(branches)
        }
      })
    })
    return {
      upload,
      list,
      edit
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  &-list {
    display: flex;
  }
}
</style>
