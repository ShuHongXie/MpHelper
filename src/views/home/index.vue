<template>
  <div class="home">
    <div class="home-list">
      <project
        @add="upload"
        @preview="preview(index)"
        @edit="edit(index)"
        @remove="remove(index)"
        @refresh="refresh"
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
import { cloneDeep } from 'lodash'

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
    const upload = () =>
      global.ipcRenderer.send('select', {
        type: 'export',
        params: {
          title: '选择文件夹',
          properties: ['openDirectory']
        }
      })
    // 编辑
    const edit = (index: number) => {
      router.push({
        path: '/edit',
        query: {
          index
        }
      })
    }
    // 图片预览
    const preview = (index: number) => {
      global.ipcRenderer.send('previewQrCode', cloneDeep(list.value[index]))
    }
    // 删除项目
    const remove = (index: number) => {
      console.log('ccc', index)

      global.$messageBox
        .confirm(`确认删除${list.value[index].projectName}?`, 'Warning', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          list.value.splice(index, 1)
          global.$message({
            type: 'success',
            message: '删除成功'
          })
        })
    }
    // 更新项目
    const refresh = () => {}
    // 挂载
    onMounted(() => {
      list.value = global.db.read().get('list').value()
      global.ipcRenderer.on('selectFolderReply', async (event: IpcMainEvent, dir: string) => {
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
      edit,
      preview,
      refresh,
      remove
    }
  }
})
</script>

<style lang="scss" scoped>
.home {
  &-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
