<template>
  <div class="home">
    <div class="home-list">
      <project
        @add="upload"
        @preview="preview(index)"
        @previewDesc="previewDesc(index)"
        @edit="edit(index)"
        @remove="remove(index)"
        @refresh="refresh(index)"
        @switch="switchBranch(index)"
        @upload="uploadMp(index)"
        :data="item"
        v-for="(item, index) in list"
        :key="item.id"
      ></project>
      <project @add="upload" :data="undefined"></project>
    </div>
    <switch-git-dialog
      ref="switchGitDialog"
      @confirm="confirmSwitchGit"
      :data="currentSelectProject"
    />
    <upload-input-dialog ref="uploadInputDialog" @confirm="confirmUploadMp" />
    <preview-desc-dialog ref="previewDescDialog" @confirm="confirmPreview" />
    <git-operate-dialog ref="gitOperateDialog" :data="fileStatus" @change="changeGitFile" @commit-switch="commitSwitch" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { IpcMainEvent } from 'electron'
import { cloneDeep, debounce } from 'lodash'
import { SUCCESS, FAIL } from '@/const'
import { List } from '@/entity/Db'
import { Form, GitFileChangeObject } from '@/entity/Params'
import { FileStatusObject, FileStatus } from '@/entity/Common'
import project from './modules/project.vue'
import switchGitDialog from './modules/switchGitDialog.vue'
import uploadInputDialog from './modules/uploadInputDialog.vue'
import previewDescDialog from './modules/previewDescDialog.vue'
import gitOperateDialog from './modules/gitCommitDialog.vue'
export default defineComponent({
  name: 'HomePage',
  components: {
    project,
    switchGitDialog,
    uploadInputDialog,
    previewDescDialog,
    gitOperateDialog
  },
  setup(props, ctx) {
    const { global, router } = useGlobalProperties()
    const list = ref<List[]>([])
    const currentSelectProject = ref<List>({})
    const fileStatus = ref<FileStatusObject>({})
    const currentSelectIndex = ref(0)
    const switchGitDialog = ref()
    const uploadInputDialog = ref()
    const previewDescDialog = ref()
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
    // 图片直接预览
    const preview = debounce((index: number) => {
      filterDone(index, () =>
        global.ipcRenderer.send('miniProgram', {
          type: 'preview',
          params: cloneDeep({ ...list.value[index], index })
        })
      )
    }, 300)
    // 打开预览备注弹框
    const previewDesc = (index: number) => {
      console.log('--', previewDescDialog.value)

      currentSelectProject.value = list.value[index]
      currentSelectIndex.value = index
      previewDescDialog.value.open()
    }
    // 备注后预览
    const confirmPreview = debounce((desc: string) => {
      filterDone(currentSelectIndex.value, () =>
        global.ipcRenderer.send('miniProgram', {
          type: 'preview',
          params: cloneDeep({
            ...list.value[currentSelectIndex.value],
            index: currentSelectIndex.value,
            desc
          })
        })
      )
    })
    const uploadMp = debounce((index: number) => {
      currentSelectProject.value = list.value[index]
      currentSelectIndex.value = index
      uploadInputDialog.value.open()
    }, 300)
    const confirmUploadMp = debounce((data: Form) => {
      console.log(currentSelectIndex.value, { ...list.value[currentSelectIndex.value], ...data })
      filterDone(currentSelectIndex.value, () =>
        global.ipcRenderer.send('miniProgram', {
          type: 'upload',
          params: cloneDeep({ ...list.value[currentSelectIndex.value], ...data })
        })
      )
    }, 300)
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
    const refresh = (index: number) => {
      global.ipcRenderer.send('commonOperate', {
        type: 'refresh',
        params: cloneDeep(list.value[index])
      })
    }
    // 分支切换
    const switchBranch = (index: number) => {
      if (!list.value[index].branches?.length) {
        global.$message({
          type: 'success',
          message: '当前项目下没有分支'
        })
        return
      }
      currentSelectProject.value = list.value[index]
      currentSelectIndex.value = index
      switchGitDialog.value.open()
      console.log(switchGitDialog.value)
    }
    // 切换git
    const confirmSwitchGit = (branch: string) => {
      if (branch === currentSelectProject.value.currentBranch) {
        global.$message({
          type: 'warning',
          message: '所选分支已经是当前分支'
        })
        return
      }
      global.ipcRenderer.send('gitOperate', {
        type: 'checkout',
        params: {
          ...cloneDeep(currentSelectProject.value),
          currentBranch: branch
        }
      })
      // if(list.value)
    }
    const confirmInput = () => {}
    // 文件状态弹框状态修改
    const changeGitFile = ({ value, index, type }: GitFileChangeObject) => {
      console.log(fileStatus.value.stagedData)
      let list
      if (index === -1) {
        if (type === 'staged') {
          list = cloneDeep(fileStatus.value.stagedData)
          fileStatus.value.stagedData = []
        } else {
          list = cloneDeep(fileStatus.value.unstagedData)
          fileStatus.value.stagedData = []
        }
      } else {
        if (type === 'staged') {
          list = cloneDeep((fileStatus.value.stagedData as FileStatus[])[index])
          fileStatus.value.stagedData?.splice(index, 1)
        } else {
          list = cloneDeep((fileStatus.value.unstagedData as FileStatus[])[index])
          fileStatus.value.stagedData?.splice(index, 1)
        }
      }
      global.ipcRenderer.send('gitOperate', {
        type: type === 'staged' ? 'reset' : 'add',
        params: {
          list,
          project: cloneDeep(currentSelectProject.value)
        }
      })
    }
    // 提交到版本库并且切换分支
    const commitSwitch = (desc: string) => {
      console.log(desc);

    }
    // 挂载
    onMounted(() => {
      let loadingInstance: { close: () => void } | null = null
      // 从数据库中拿取状态
      list.value = global.db.read().get('list').value()
      currentSelectProject.value = list.value[1]
      // 增加loading状态的可以key
      for (const item of list.value) {
        Object.assign(item, {}, { loadingText: '', loading: false })
      }
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
          currentPreview.loading = false
        }
      })
      // 上传回复
      global.ipcRenderer.on('uploadReply', async (event: IpcMainEvent, response: any) => {
        const currentPreview = list.value[response.data.index]
        if (response.status === SUCCESS) {
          loadingInstance = global.$loading.service({
            body: true,
            lock: true,
            background: 'rgba(0, 0, 0, 0.7)',
            text: '正在上传中...'
          })
          if (response.data.done) {
            loadingInstance?.close()
            loadingInstance = null
            global.$message({
              type: 'success',
              message: '上传成功'
            })
          }
        } else {
          loadingInstance?.close()
          loadingInstance = null
          global.$message({
            type: 'error',
            message: response.data.message
          })
          currentPreview.loading = false
        }
      })
      // 刷新回复
      global.ipcRenderer.on('refreshReply', async (event: IpcMainEvent, response: any) => {
        if (response.status === SUCCESS) {
          global.$message({
            type: 'success',
            message: response.data.message
          })
        }
      })
      // 获取当前git状态
      global.ipcRenderer.send('gitOperate', {
        type: 'status',
        params: cloneDeep(list.value[1])
      })
      // git状态回复
      global.ipcRenderer.on('gitStatusReply', async (event: IpcMainEvent, response: any) => {
        if (response.status === SUCCESS) {
          fileStatus.value = response.data
          fileStatus
          console.log(fileStatus.value)
        }
      })
    })
    return {
      upload,
      list,
      edit,
      preview,
      refresh,
      remove,
      switchBranch,
      currentSelectProject,
      switchGitDialog,
      uploadInputDialog,
      previewDescDialog,
      confirmSwitchGit,
      uploadMp,
      confirmUploadMp,
      confirmInput,
      previewDesc,
      confirmPreview,
      fileStatus,
      changeGitFile,
      commitSwitch
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
