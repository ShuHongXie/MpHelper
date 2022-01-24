<template>
  <el-dialog v-model="visible" width="50%" custom-class="preview-desc">
    <template #title>
      <p class="preview-desc__title">
        <span>请填写您的预览备注</span>
      </p>
    </template>
    <div class="preview-desc__content">
      <el-form>
        <el-form-item label="备注:">
          <el-input v-model="desc" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button type="primary" @click="confirm" size="small">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { List } from '@/entity/Db'
import { defineComponent, PropType, ref, reactive } from 'vue'
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
    const desc = ref('')
    // 关闭
    const close = () => (visible.value = false)
    // 打开
    const open = () => (visible.value = true)
    // 确认预览
    const confirm = () => {
      emit('confirm', desc.value)
      close()
    }
    return {
      visible,
      open,
      close,
      selectIndex,
      confirm,
      desc
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/constarnt.scss';
.preview-desc {
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
