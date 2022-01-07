<template>
  <div class="edit">
    <el-form ref="form" size="small" :model="formData" label-width="110px" label-position="right">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称:" prop="name">
            <el-input v-model="formData.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="appid:" prop="appid">
            <el-input v-model="formData.appid"></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item label="机器人编号:" prop="robot">
            <el-input v-model="formData.robot"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
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
import { List } from '@/entity/Db'
import type { ElForm } from 'element-plus'
export default defineComponent({
  setup(props, ctx) {
    const { global, route, router } = useGlobalProperties()
    const formData = ref<List>({})
    const index = ref<number>(-1)
    const rules = reactive({
      // name: [
      //   {
      //     required: true,
      //     message: 'Please input Activity name',
      //     trigger: 'blur'
      //   }
      // ]
    })
    const ruleFormRef = ref<InstanceType<typeof ElForm>>()
    const save = (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
    // 返回
    const back = () => router.back()
    // 路径选择
    const selectPath = (key: string) => {
      if (key === 'privatePath') {
        global.ipcRenderer.send('selectFile', {
          id: formData.value.id,
          params: {
            filters: [
              {
                name: '*.key',
                extensions: ['key']
              }
            ]
          },
          type: key
        })
        return
      }
      global.ipcRenderer.send('selectFolder', {
        id: formData.value.id,
        type: key
      })
    }
    onMounted(() => {
      index.value = parseInt(route.query.index as string)
      formData.value = global.db.read().get('list').value()[index.value]
    })
    return {
      formData,
      rules,
      save,
      ruleFormRef,
      back,
      selectPath
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
}
</style>
