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
import { SUCCESS, FAIL } from '@/const'

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
    // 配置完成校验
    const filterDone = (index: number, excuteFunc: any) => {
      if (!list.value[index].done) {
        global.$message.error('请先完成项目配置.')
        return
      }
      excuteFunc()
    }
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
      filterDone(index, () =>
        global.ipcRenderer.send('previewQrCode', cloneDeep({ ...list.value[index], index }))
      )
    }
    // 删除项目
    const remove = (index: number) => {
      global.$messageBox
        .confirm(`确认删除${list.value[index].projectName}?`, 'Warning', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'error'
        })
        .then(() => {
          global.db.read().get('list').remove({ id: list.value[index].id }).write()
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
      for (const item of list.value) {
        Object.assign(item, {}, { loadingText: '', loading: false })
      }
      global.ipcRenderer.on('selectFolderReply', async (event: IpcMainEvent, dir: string) => {
        if (dir) {
          // console.log(fs, dir)
          // let branches = await listBranches({ fs, dir, gitdir: path.join(dir, '.git') })
          // console.log(branches)
        }
      })
      // 预览回复
      global.ipcRenderer.on('previewReply', async (event: IpcMainEvent, response: any) => {
        const currentPreview = list.value[response.data.index]
        if (response.status === SUCCESS) {
          currentPreview.loading = !response.data.done
          currentPreview.loadingText = response.data.message
          if (response.data.done) {
            currentPreview.qrcodePath = response.data.path
            currentPreview.fullQrcodePath = response.data.fullPath
          }
        } else {
          global.$message({
            type: 'error',
            message: response.data.message
          })
          console.log(currentPreview)

          currentPreview.loading = false
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
