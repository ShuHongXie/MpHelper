<!--
 * @Author: 谢树宏
 * @Date: 2022-01-14 16:59:09
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-19 17:13:46
 * @FilePath: /electron-mp-ci/src/views/home/modules/gitCommitDialog.vue
-->
<template>
  <el-dialog v-model="visible" width="90%" custom-class="git-commit">
    <div class="git-commit__content">
      <div class="staged-area">
        <div class="staged-area__header">
          <el-checkbox
            @change="(value) => $emit('change', { value, index: -1, type: 'staged' })"
            v-model="stagedChecked"
            label="已暂存文件"
            size="large"
          ></el-checkbox>
        </div>
        <div class="staged-area__content">
          <div class="list-item" v-for="(item, index) in data?.stagedData" :key="item.path">
            <el-checkbox
              @change="(value) => $emit('change', { value, index, type: 'staged' })"
              v-model="item.checked"
              size="large"
            >
              <div class="list-item__content">
                <mp-icon
                  :icon="filterIcon(item.status)"
                  :color="filterColor(item.status)"
                  size="16"
                ></mp-icon
                ><span class="list-item__path">{{ item.path }}</span>
              </div>
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="work-area">
        <div class="work-area__header">
          <el-checkbox
            @change="(value) => $emit('change', { value, index: -1, type: 'unstaged' })"
            v-model="unstagedChecked"
            label="未暂存文件"
            size="large"
          ></el-checkbox>
        </div>
        <div class="work-area__content">
          <div class="list-item" v-for="(item, index) in data?.unstagedData" :key="item.path">
            <el-checkbox
              @change="(value) => $emit('change', { value, index, type: 'unstaged' })"
              v-model="item.checked"
              size="large"
            >
              <div class="list-item__content">
                <mp-icon
                  :icon="filterIcon(item.status)"
                  :color="filterColor(item.status)"
                  size="16"
                ></mp-icon
                ><span class="list-item__path">{{ item.path }}</span>
              </div>
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="commit-area">
        <el-input v-model="desc" type="textarea" placeholder="请输入您的提交信息"></el-input>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" size="small">取消</el-button>
        <el-button @click="$emit('switch')" size="small">直接切换</el-button>
        <el-button
          @click="$emit('commitSwitch', desc)"
          :disabled="!data?.stagedData?.length"
          type="primary"
          size="small"
          >提交并切换</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { FileStatusObject } from '@/entity/Common'
import { defineComponent, watch, PropType, ref, onMounted } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: (Object as PropType<FileStatusObject>) || {},
      default: () => {}
    }
  },

  setup(props, { emit }) {
    const stagedChecked = ref(true)
    const unstagedChecked = ref(false)
    const visible = ref(false)
    const desc = ref('')
    // 选中/反选
    const change = (value: boolean, index: number, type: string) => {
      console.log(value, index, type)
    }
    // 关闭
    const close = () => (visible.value = false)
    // 打开
    const open = () => (visible.value = true)
    // 确认切换
    const confirm = () => {
      close()
    }
    watch(props.data, (newValue) => {
      console.log('data变化')

      stagedChecked.value = true
      unstagedChecked.value = false
    })
    // 颜色筛选展示
    const filterColor = (status: string | undefined) => {
      if (status === 'added-staged') {
        return '#00BB00'
      } else if (status === 'modified-staged' || status === 'modified-unstaged') {
        return '#FFD306'
      } else if (status === 'deleted-unstaged' || status === 'deleted') {
        return '#666'
      } else if (status === 'new-untracked') {
        return '#B766AD'
      } else if (status === 'deleted-staged') {
        return '#842B00'
      }
    }
    // 图标筛选展示
    const filterIcon = (status: string | undefined) => {
      if (status === 'added-staged') {
        return 'add-circle'
      } else if (status === 'modified-staged' || status === 'modified-unstaged') {
        return 'more'
      } else if (
        status === 'deleted-staged' ||
        status === 'deleted-unstaged' ||
        status === 'deleted'
      ) {
        return 'minus-circle'
      } else if (status === 'new-untracked') {
        return 'smile'
      }
    }
    onMounted(() => {})
    return {
      visible,
      open,
      close,
      confirm,
      stagedChecked,
      unstagedChecked,
      filterColor,
      filterIcon,
      change,
      desc
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/scss/constarnt.scss';
.git-commit {
  border-radius: 6px;
  overflow: hidden;
  margin-top: 48px;
  .staged-area {
    height: 246px;
    border: 1px solid $primary;
    border-radius: 6px 6px 0 0;
    .el-checkbox {
      height: 30px;
    }
    &__header {
      height: 30px;
      border-bottom: 1px solid $primary;
      display: flex;
      align-items: center;
      padding-left: 12px;
    }
    &__content {
      overflow: auto;
      height: 214px;
      .list-item {
        // display: flex;
        // align-items: center;
        // height: 26px;
        padding-left: 34px;
        &__content {
          display: flex;
          align-items: center;
          color: #333;
        }
        &__path {
          padding-left: 4px;
        }
      }
    }
  }
  .work-area {
    @extend .staged-area;
    border-radius: 0 0 6px 6px;
    border-top: none;
    &__header {
      @extend .staged-area__header;
    }
    &__content {
      @extend .staged-area__content;
    }
  }
  .commit-area {
    margin-top: 10px;
  }
  &__content {
    font-size: 18px;
    overflow: auto;
    // padding: 0 10px 0 4px;
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
  .el-textarea__inner {
    border-color: $primary;
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
      padding: 10px 20px;
    }
    &__body {
      padding: 20px 20px 12px;
    }
  }
}
</style>
