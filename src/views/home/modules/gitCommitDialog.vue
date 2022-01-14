<!--
 * @Author: 谢树宏
 * @Date: 2022-01-14 16:59:09
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-14 17:33:08
 * @FilePath: /electron-mp-ci/src/views/home/modules/gitCommitDialog.vue
-->
<template>
  <el-dialog v-model="visible" width="90%" custom-class="git-commit">
    <div class="git-commit__content">
      <div class="staged-area"></div>
      <div class="work-area"></div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" size="mini">取消</el-button>
        <el-button @click="visible = false" size="mini">直接切换</el-button>
        <el-button type="primary" size="mini">确认切换</el-button>
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
    const visible = ref(true)
    // 关闭
    const close = () => (visible.value = false)
    // 打开
    const open = () => (visible.value = true)
    // 确认切换
    const confirm = () => {
      close()
    }
    return {
      visible,
      open,
      close,
      confirm
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/constarnt.scss';
.git-commit {
  border-radius: 6px;
  overflow: hidden;
  .staged-area {
    height: 250px;
    border: 1px solid $primary;
    border-radius: 8px 8px 0 0;
  }
  .work-area {
    @extend .staged-area;
    border-radius: 0 0 8px 8px;
    border-top: none;
  }
  &__content {
    font-size: 18px;
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
      padding: 20px 20px 12px;
    }
  }
}
</style>
