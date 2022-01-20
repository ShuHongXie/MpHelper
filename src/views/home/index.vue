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
      @confirm="confirmSwitchRequest"
      :data="currentSelectProject"
    />
    <upload-input-dialog ref="uploadInputDialog" @confirm="confirmUploadMp" />
    <preview-desc-dialog ref="previewDescDialog" @confirm="confirmPreview" />
    <git-operate-dialog
      ref="gitOperateDialog"
      :data="fileStatus"
      @change="changeGitFile"
      @commit-switch="commitSwitch"
      @switch="confirmSwitch(currentBranch)"
    />
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
    const currentBranch = ref('')
    const fileStatus = ref<FileStatusObject>({})
    const currentSelectIndex = ref(0)
    const switchGitDialog = ref()
    const uploadInputDialog = ref()
    const previewDescDialog = ref()
    const gitOperateDialog = ref()
    // 配置完成校验
    const filterDone = (index: number, excuteFunc: any) => {
      if (!list.value[index].done) {
        global.$message.error('请先完成项目配置.')
        return
      }
      excuteFunc()
    }
    // ipc通信打开文件夹
    const upload = () => {
      global.ipcRenderer.send('select', {
        type: 'export',
        params: {
          title: '选择文件夹',
          properties: ['openDirectory']
        }
      })
      // if (status === SUCCESS) {
      //   global.$message({
      //     type: 'success',
      //     message: data.message
      //   })
      // }
    }
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
      currentSelectProject.value = list.value[index]
      currentSelectIndex.value = index
      previewDescDialog.value.open()
    }
    // 备注后预览
    const confirmPreview = debounce((desc: string) => {
      filterDone(currentSelectIndex.value, async () =>
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
    // 打开上传选项弹框
    const uploadMp = debounce((index: number) => {
      currentSelectProject.value = list.value[index]
      currentSelectIndex.value = index
      uploadInputDialog.value.open()
    }, 300)
    // 上传小程序
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
    const refresh = async (index: number) => {
      const data = await global.ipcRenderer.invoke('commonOperate', {
        type: 'refresh',
        params: cloneDeep(list.value[index])
      })
      if (data.status === SUCCESS) {
        global.$message({
          type: 'success',
          message: data.data.message
        })
      }
    }
    // 分支切换
    const switchBranch = async (index: number) => {
      // 分支切换前要查询一次 确保用户在离开窗口期间对git做了什么
      await global.ipcRenderer.invoke('commonOperate', {
        type: 'refresh',
        params: cloneDeep(list.value[index])
      })
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
    }
    // 确认切换git
    const confirmSwitch = async (branch: string) => {
      const { status, data } = await global.ipcRenderer.invoke('gitOperate', {
        type: 'checkout',
        params: {
          ...cloneDeep(currentSelectProject.value),
          currentBranch: branch
        }
      })
      global.$message({
        showClose: status !== SUCCESS,
        duration: status === SUCCESS ? 3000 : 0,
        type: status === SUCCESS ? 'success' : 'error',
        message: data.message
      })
      // 成功时就关闭弹窗, 更新数据库数据
      if (status === SUCCESS) {
        gitOperateDialog.value.close()
        global.db
          .read()
          .get('list')
          .find({ id: currentSelectProject.value.id })
          .assign({
            currentBranch: branch
          })
          .write()
      }
    }
    // 切换git弹框选择
    // 切换之前要看看工作区是否存在未暂存的东西 存在未暂存的东西就提示
    const confirmSwitchRequest = async (branch: string) => {
      const branchStatus = await global.ipcRenderer.invoke('gitOperate', {
        type: 'status',
        params: {
          ...cloneDeep(currentSelectProject.value)
        }
      })
      // 有未暂存的要让用户选择
      if (branchStatus.data.unstagedData.length) {
        let isSuccess = false
        global.$messageBox
          .confirm(`当前分支下存在未提交的内容，进行提交操作?`, 'Warning', {
            confirmButtonText: '去提交',
            cancelButtonText: '直接切换',
            type: 'warning'
          })
          .then((bool: any) => {
            fileStatus.value = branchStatus.data
            currentBranch.value = branch
            gitOperateDialog.value.open()
            isSuccess = true
          })
          .catch(async (bool: any) => {
            console.log('取消', bool)
            confirmSwitch(branch)
          })
        return
      }
      confirmSwitch(branch)
    }
    const confirmInput = () => {}
    // 文件状态弹框状态修改
    const changeGitFile = async ({ value, index, type }: GitFileChangeObject) => {
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
      const response = await global.ipcRenderer.invoke('gitOperate', {
        type: type === 'staged' ? 'reset' : 'add',
        params: {
          list,
          project: cloneDeep(currentSelectProject.value)
        }
      })
      if (response.status === SUCCESS) {
        fileStatus.value = response.data
      }
    }
    // 提交到版本库并且切换分支
    const commitSwitch = async (desc: string) => {
      const { status, data } = await global.ipcRenderer.invoke('gitOperate', {
        type: 'commit',
        params: {
          desc,
          project: cloneDeep(currentSelectProject.value)
        }
      })
      global.$message({
        showClose: status !== SUCCESS,
        duration: status === SUCCESS ? 3000 : 0,
        type: status === SUCCESS ? 'success' : 'error',
        message: data.message
      })
      if (status === SUCCESS) {
        confirmSwitch(currentBranch.value)
      }
    }
    // 挂载
    onMounted(async () => {
      let loadingInstance: { close: () => void } | null = null
      // 从数据库中拿取状态
      const listArray = cloneDeep(global.db.read().get('list').value())
      console.log('---')
      list.value = listArray
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
            message: response.data.message,
            duration: 0,
            showClose: true
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
            message: response.data.message,
            duration: 0,
            showClose: true
          })
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
      remove,
      switchBranch,
      currentSelectProject,
      switchGitDialog,
      uploadInputDialog,
      previewDescDialog,
      confirmSwitch,
      confirmSwitchRequest,
      uploadMp,
      confirmUploadMp,
      confirmInput,
      previewDesc,
      confirmPreview,
      fileStatus,
      changeGitFile,
      commitSwitch,
      gitOperateDialog,
      currentBranch
    }
  }
})
</script>

<style>
.el-message__content {
  word-break: break-all;
}
</style>
<style lang="scss" scoped>
.home {
  &-list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
