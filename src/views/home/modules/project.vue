<template>
  <div class="project">
    <div class="project-top">
      <!-- <mp-image style="height: 100%" :src="url"></mp-image> -->
      <div class="project-top__add">
        <mp-icon icon="add" color="#409EFC" :size="40" />
      </div>
    </div>
    <div class="project-bottom">
      <el-button type="primary">上传</el-button>
      <el-button type="success">编辑</el-button>
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
  height: 260px;
  // border: 1px solid red;
  border-radius: 8px;
  overflow: hidden;
  &-top {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    &__add {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px dashed red;
      box-sizing: border-box;
    }
  }
}
</style>
