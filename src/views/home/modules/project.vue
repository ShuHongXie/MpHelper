<template>
  <div class="project">
    <div class="project-top">
      <!-- <mp-image style="height: 100%" :src="url"></mp-image> -->
      <div class="project-top__add">
        <mp-icon icon="add" color="#4965d2" :size="40" />
      </div>
    </div>
    <div class="project-bottom">
      <el-row class="project-bottom__wrapper">
        <el-col>
          <el-button type="primary" size="small" @click="$emit('upload')">上传/预览</el-button>
          <el-button type="success" size="small">修改</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-select v-model="value" placeholder="请选择当前分支" size="small">
            <el-option
              v-for="(item, index) in data.branches"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { List } from '@/entity/Db'
import { defineComponent, onMounted, ref, PropType } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Array as PropType<List>,
      default: () => []
    }
  },
  setup(props, ctx) {
    const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
    const value = ref('')

    const options = [
      {
        value: 'Option1',
        label: 'Option1'
      },
      {
        value: 'Option2',
        label: 'Option2'
      },
      {
        value: 'Option3',
        label: 'Option3'
      },
      {
        value: 'Option4',
        label: 'Option4'
      },
      {
        value: 'Option5',
        label: 'Option5'
      }
    ]
    onMounted(() => {})
    return {
      url,
      value,
      options
    }
  }
})
</script>

<style lang="scss" scoped>
.project {
  width: 200px;
  height: 286px;
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
    // display: flex;
    // align-items: center;
    flex: 1;
    .el-col {
      display: flex;
    }
    .el-button {
      flex: 1;
    }
    &__wrapper {
      padding: 6px 0;
    }
  }
}
</style>
