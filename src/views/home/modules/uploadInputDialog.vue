<template>
  <el-dialog v-model="visible" width="50%" custom-class="upload-mp">
    <template #title>
      <span class="upload-mp__title">请填写上传的必要信息</span>
    </template>
    <div class="upload-mp__content">21321</div>
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
import { defineComponent, onMounted, PropType, ref } from 'vue'
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
    return {
      visible,
      open,
      close,
      selectIndex,
      select,
      confirm
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
