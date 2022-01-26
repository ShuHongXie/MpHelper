<!--
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-24 15:12:12
 * @FilePath: /electron-mp-ci/src/App.vue
-->
<template>
  <common-header></common-header>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import CommonHeader from '@/components/common/commonHeader.vue'
export default defineComponent({
  components: {
    CommonHeader
  },
  setup(props, ctx) {
    onMounted(() => {})
    return {}
  }
})
</script>

<style lang="scss" scoped>
body {
  background-color: none;
}
</style>
