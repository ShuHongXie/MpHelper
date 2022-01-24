<!--
 * @Author: 谢树宏
 * @Date: 2022-01-24 10:00:54
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-24 14:57:26
 * @FilePath: /electron-mp-ci/src/components/common/commonHeader.vue
-->
<template>
  <div class="header" :style="{ height: process.platform === 'win32' ? '36px' : '28px' }">
    <div class="header-operate" v-if="process.platform === 'win32'">
      <mp-icon :size="24" icon="minus-circle" color="#888888" @click="minimizeWindow"></mp-icon>
      <mp-icon
        :size="24"
        icon="add-circle"
        color="#888888"
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
      const window = global.BrowserWindow.getFocusedWindow()
      window.minimize()
    }
    const closeWindow = () => {
      const window = global.BrowserWindow.getFocusedWindow()
      window.close()
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
  background: #ffffff;
  border-radius: 12px 12px 0px 0px;
  padding-right: 14px;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  left: 0;
  top: 0;
  -webkit-app-region: drag;
  cursor: pointer;
  &-operate {
    width: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
  }
}
</style>
