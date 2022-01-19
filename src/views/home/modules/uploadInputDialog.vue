<template>
  <el-dialog v-model="visible" width="50%" custom-class="upload-mp">
    <template #title>
      <p class="upload-mp__title">
        <span>请填写上传的必要信息</span>&nbsp;
        <span class="upload-mp__title--notice">注: 本次上传将会覆盖体验版</span>
      </p>
    </template>
    <div class="upload-mp__content">
      <el-form ref="formRef" :rules="rules" size="small" :model="form" label-width="80px">
        <el-form-item label="版本号:" prop="version">
          <el-input v-model="form.version"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="form.desc" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button type="primary" @click="save(formRef)" size="small">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { List } from '@/entity/Db'
import { Form } from '@/entity/Params'
import { defineComponent, PropType, ref, reactive } from 'vue'
import type { ElForm } from 'element-plus'
export default defineComponent({
  props: {
    data: {
      type: (Object as PropType<List>) || [],
      default: () => []
    }
  },

  setup(props, { emit }) {
    const visible = ref(false)
    const form = ref<Form>({ version: '', desc: '' })
    const formRef = ref<InstanceType<typeof ElForm>>()
    const validateVersion = (rule: any, value: number, callback: any) => {
      console.log(typeof value, value)
      if (/[0-9]+?\.[0-9]+?\.[0-9]+/g.test(value.toString())) {
        callback()
      } else {
        callback(new Error('版本号格式不正确, 例：1.0.1'))
      }
    }
    const rules = reactive({
      version: [
        {
          required: true,
          message: '请输入您本次上传的版本号',
          trigger: 'blur'
        },
        {
          trigger: 'blur',
          validator: validateVersion,
          required: true
        }
      ]
    })
    // 关闭
    const close = () => (visible.value = false)
    // 打开
    const open = () => (visible.value = true)
    // 保存设置 直接上传
    const save = (formEl: InstanceType<typeof ElForm> | undefined) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          // back()
          emit('confirm', form.value)
          close()
        } else {
          return false
        }
      })
    }
    return {
      visible,
      open,
      close,
      confirm,
      form,
      rules,
      save,
      formRef
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
    &--notice {
      color: red;
      font-size: 12px;
    }
  }
  &__content {
    font-size: 18px;
    max-height: 200px;
    overflow: auto;
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
      padding: 10px 20px 0;
    }
  }
}
</style>
