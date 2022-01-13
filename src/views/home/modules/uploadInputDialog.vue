<template>
  <el-dialog v-model="visible" width="50%" custom-class="upload-mp">
    <template #title>
      <span class="upload-mp__title">请填写上传的必要信息</span>
    </template>
    <div class="upload-mp__content">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="版本号:">
          <el-input v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.desc" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" size="mini">取消</el-button>
        <el-button type="primary" @click="confirm" size="mini">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { List } from '@/entity/Db'
import { defineComponent, PropType, ref, reactive } from 'vue'
import type { ElForm } from 'element-plus'
type Form = {
  version: string
  desc?: string
}
export default defineComponent({
  props: {
    data: {
      type: (Object as PropType<List>) || [],
      default: () => []
    }
  },

  setup(props, { emit }) {
    const visible = ref(false)
    const selectIndex = ref(0)
    const form = ref<Form>({ version: '', desc: '' })
    const formRef = ref<InstanceType<typeof ElForm>>()
    const validateVersion = (rule: any, value: number, callback: any) => {
      console.log(typeof value, value)
      if (value >= 0 && value <= 30) {
        callback()
      } else {
        callback(new Error('机器人编号必须在1-30之间'))
      }
    }
    const rules = reactive({
      version: [
        {
          required: true,
          message: '请输入您的版本号',
          trigger: 'blur'
        },
        {
          trigger: 'blur',
          validator: validateVersion,
          required: true
        }
      ]
    })
    // 选择分支
    const select = (index: number) => (selectIndex.value = index)
    // 关闭
    const close = () => (visible.value = false)
    // 打开
    const open = () => (visible.value = true)
    // 确认切换
    const confirm = () => {
      emit('confirm', props.data.branches?.[selectIndex.value])
      close()
    }
    // 保存当前项目配置
    const save = (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          // back()
        } else {
          return false
        }
      })
    }
    return {
      visible,
      open,
      close,
      selectIndex,
      select,
      confirm,
      form,
      rules
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/constarnt.scss';
.upload-mp {
  border-radius: 6px;
  overflow: hidden;
  &__title {
    margin-top: 8px;
  }
  &__content {
    font-size: 18px;
    max-height: 200px;
    overflow: auto;
    padding: 0 10px 0 4px;
    .git {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      cursor: pointer;

      color: #333;
      &:hover {
        background-color: #f6f6f6;
      }
    }
  }
  .el-dialog {
    &__header {
      padding: 14px 20px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: $primary;
    }
    &__footer {
      padding: 10px;
    }
    &__body {
      padding: 10px 20px 12px;
    }
  }
}
</style>
