<template>
  <div class="edit">
    <el-form
      ref="ruleFormRef"
      size="small"
      :model="formData"
      :rules="rules"
      label-width="120px"
      label-position="right"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="formData.projectName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件夹名称:" prop="name">
            <el-input v-model="formData.name" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="appid:" prop="appid">
            <el-input v-model="formData.appid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机器人编号:" prop="robot">
            <el-input v-model.number="formData.robot"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目配置路径:" prop="outputPath">
            <el-input v-model="formData.outputPath" disabled></el-input>
            <div class="upload" @click="selectPath('outputPath')">
              {{ formData.outputPath ? '重新上传' : '上传' }}
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="私钥路径:" prop="privatePath">
            <el-input v-model="formData.privatePath" disabled></el-input>
            <div class="upload" @click="selectPath('privatePath')">
              {{ formData.privatePath ? '重新上传' : '上传' }}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="启动页面:" prop="pagePath">
            <el-input v-model="formData.pagePath"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启动参数:" prop="searchQuery">
            <el-input v-model="formData.searchQuery"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="scene场景值:" prop="pagePath">
            <el-select
              v-model.number="formData.scene"
              clearable
              placeholder="请输入或选择场景值"
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="item in scene"
                :key="item.value"
                :label="item.key"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="编译选项:" prop="pagePath">
            <el-select v-model="currentCompileSettings" multiple placeholder="请选择编译选项">
              <el-option
                v-for="(item, index) in compileSettings"
                :key="index"
                :label="item.key"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" @click="save(ruleFormRef)">保存</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="success" @click="back">返回</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { List, complieSetting } from '@/entity/Db'
import type { ElForm } from 'element-plus'
import { IpcMainEvent } from 'electron'
import { SCENE as scene, COMPILE_SETTINGS as compileSettings } from '@/const'
export default defineComponent({
  setup(props, ctx) {
    const { global, route, router } = useGlobalProperties()
    const formData = ref<List>({})
    const index = ref<number>(-1)
    const currentCompileSettings = ref<string[]>([])
    // 机器人编号校验
    const validateRobot = (rule: any, value: number, callback: any) => {
      console.log(typeof value, value)
      if (value >= 0 && value <= 30) {
        callback()
      } else {
        callback(new Error('机器人编号必须在1-30之间'))
      }
    }
    const rules = reactive({
      projectName: [
        {
          required: true,
          message: '请输入您的项目名称',
          trigger: 'blur'
        }
      ],
      appid: [
        {
          required: true,
          message: '请输入appid',
          trigger: 'blur'
        }
      ],
      outputPath: [
        {
          required: true,
          message: '请选择项目配置路径',
          trigger: 'blur'
        }
      ],
      privatePath: [
        {
          required: true,
          message: '请选择私钥地址',
          trigger: 'blur'
        }
      ],
      robot: [
        {
          trigger: 'blur',
          validator: validateRobot,
          required: true
        }
      ]
    })
    const ruleFormRef = ref<InstanceType<typeof ElForm>>()
    // 保存当前项目配置
    const save = (formEl: InstanceType<typeof ElForm> | undefined) => {
      console.log(formData.value)

      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          const setting: complieSetting = {}
          if (currentCompileSettings.value?.length) {
            for (const key of currentCompileSettings.value) {
              setting[key] = true
            }
          }

          global.db
            .get('list')
            .find({ id: formData.value.id })
            .assign({ ...formData.value, done: true, setting })
            .write()
          global.$message({
            message: '保存成功',
            type: 'success'
          })
          back()
        } else {
          return false
        }
      })
    }
    // 返回
    const back = () => router.back()
    // 路径选择
    const selectPath = (key: string) => {
      global.ipcRenderer.send('select', {
        id: formData.value.id,
        params:
          key === 'privatePath'
            ? {
                title: '选择文件',
                filters: [
                  {
                    name: '*.key',
                    extensions: ['key']
                  }
                ]
              }
            : {
                title: '选择文件夹',
                properties: ['openDirectory']
              },
        type: key
      })
    }
    onMounted(() => {
      index.value = parseInt(route.query.index as string)
      formData.value = global.db.read().get('list').value()[index.value]
      // 初始化编译条件
      for (const key in formData.value.setting) {
        currentCompileSettings.value.push(key)
      }
      // 文件选择回复
      global.ipcRenderer.on('selectFolderReply', async (event: IpcMainEvent, response: any) => {
        const { status, data } = response
        if (status === 'success') {
          formData.value[data.type as keyof List] = data.path
          global.$message({
            showClose: true,
            message: '添加成功',
            type: 'success',
            duration: 1000
          })
        }
      })
      // 文件夹选择回复
      global.ipcRenderer.on('selectFileReply', async (event: IpcMainEvent, response: any) => {
        const { status, data } = response
        if (status === 'success') {
          formData.value[data.type as keyof List] = data.path
          global.$message({
            message: '添加成功',
            type: 'success'
          })
        }
      })
    })
    return {
      formData,
      rules,
      save,
      ruleFormRef,
      back,
      selectPath,
      scene,
      compileSettings,
      currentCompileSettings
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/constarnt.scss';
.edit {
  padding: 10px;
  :deep(.el-form-item__label) {
    font-weight: bold;
  }
  :deep(.el-form-item__content) {
    display: flex;
    .upload {
      min-width: 60px;
      text-align: center;
      color: $primary;
      font-weight: bold;
    }
  }
  .el-select {
    flex: 1;
  }
}
</style>
