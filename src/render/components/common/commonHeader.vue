<!--
 * @Author: 谢树宏
 * @Date: 2022-01-24 10:00:54
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-28 16:20:11
 * @FilePath: /electron-mp-ci/src/render/components/common/commonHeader.vue
-->
<template>
  <div class="header" :style="{ height: process.platform === 'win32' ? '30px' : '28px' }">
    <div class="header-operate" v-if="process.platform === 'win32'">
      <mp-icon
        custom-class="minimize"
        :size="20"
        icon="minus-circle"
        color="#888888"
        @click="minimizeWindow"
      ></mp-icon>
      <mp-icon
        :size="20"
        icon="add-circle"
        color="#888888"
        custom-class="close"
        :custom-style="{ transform: 'rotate(45deg)' }"
        @click="closeWindow"
      ></mp-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
export default defineComponent({
  name: 'CommonHeader',
  setup(props, ctx) {
    const { global, router } = useGlobalProperties()
    console.log(process)

    const minimizeWindow = () => {
      console.log('缩小')
      const window = global.BrowserWindow.getFocusedWindow()
      window.minimize()
    }
    const closeWindow = () => {
      const window = global.BrowserWindow.getFocusedWindow()
      window.hide()
    }
    onMounted(() => {})
    return {
      process,
      minimizeWindow,
      closeWindow
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  padding-right: 14px;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  // left: 0;
  // top: 0;
  -webkit-app-region: drag;
  cursor: pointer;
  &-operate {
    -webkit-app-region: no-drag;
    width: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    .minimize {
      &:hover {
        color: green !important;
      }
    }
    .close {
      &:hover {
        color: red !important;
      }
    }
  }
}
</style>
