<template>
  <el-dialog v-model="visible" width="50%" custom-class="switch-git">
    <template #title>
      <span class="switch-git__title">请选择要切换的分支</span>
    </template>
    <div class="switch-git__content">
      <div
        class="git"
        v-for="(item, index) in branches"
        :key="index"
        :label="item"
        :value="item"
        @click="select(index)"
      >
        <span class="git-name">{{ item }}</span>
        <mp-icon
          v-if="selectIndex === index"
          icon="select-bold"
          :color="data.currentBranch === item ? 'gray' : '#FF8C00'"
          :size="24"
        ></mp-icon>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button type="primary" @click="confirm" size="small">确认切换</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { List } from '@/entity/Db'
import { defineComponent, computed, PropType, ref } from 'vue'
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
    const branches = computed(
      () => props.data.branches?.filter((branch) => branch !== props.data.currentBranch) || []
    )
    // 选择分支
    const select = (index: number) => (selectIndex.value = index)
    // 关闭
    const close = () => (visible.value = false)
    // 打开
    const open = () => (visible.value = true)
    // 确认切换
    const confirm = () => {
      emit('confirm', branches.value[selectIndex.value])
      close()
    }
    return {
      visible,
      open,
      close,
      selectIndex,
      select,
      confirm,
      branches
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/constarnt.scss';
.switch-git {
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
