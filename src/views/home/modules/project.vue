<template>
  <div class="project">
    <div class="project-top">
      <!-- <mp-image style="height: 100%" :src="url"></mp-image> -->
      <div class="project-top__add">
        <mp-icon icon="add" color="#4965d2" :size="40" />
      </div>
    </div>
    <div class="project-bottom">
      <el-button type="primary" size="small" @click="$emit('upload')">上传/预览</el-button>
      <el-button type="success" size="small">修改</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  setup(props, ctx) {
    const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
    onMounted(() => {})
    return {
      url
    }
  }
})
</script>

<style lang="scss" scoped>
.project {
  width: 200px;
  height: 246px;
  // border: 1px solid red;
  background: #ffffff;
  box-shadow: 2px 0px 10px 0px rgba(96, 125, 238, 0.35);
  border-radius: 6px;
  overflow: hidden;
  margin: 10px;
  display: flex;
  flex-direction: column;
  &-top {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    &__add {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
  }
  &-bottom {
    padding: 0 10px;
    display: flex;
    align-items: center;
    flex: 1;
    .el-button {
      flex: 1;
    }
  }
}
</style>
