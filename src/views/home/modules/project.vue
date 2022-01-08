<template>
  <div class="project">
    <div class="project-name" v-if="data">
      {{ data.projectName }}
      <!-- <mp-icon custom-class="delete" icon="round_close_light" color="red" :size="16"></mp-icon> -->
      <el-checkbox class="delete" />
    </div>
    <div class="project-qrcode">
      <!-- <mp-image style="height: 100%" :src="url"></mp-image> -->
      <div class="project-qrcode__add" @click.stop="$emit('add')">
        <mp-icon icon="add" color="#6489ff" :size="40" />
      </div>
    </div>
    <div class="project-operation" v-if="data">
      <el-row class="project-operation__wrapper">
        <el-col>
          <el-button type="primary" plain size="small" @click.stop="$emit('preview')"
            >上传/预览</el-button
          >
          <el-button type="success" size="small" @click.stop="$emit('edit')"
            ><mp-icon icon="setting"></mp-icon> 修改</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-select v-model="data.currentBranch" placeholder="请选择当前分支" size="small">
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
      type: (Array as PropType<List>) || undefined,
      default: () => undefined
    }
  },
  setup(props, ctx) {
    const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
    const value = ref('')

    onMounted(() => {})
    return {
      url,
      value
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/constarnt.scss';
.project {
  width: 200px;
  height: 322px;
  // border: 1px solid red;
  background: #ffffff;
  box-shadow: 2px 0px 10px 0px rgba(96, 125, 238, 0.35);
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0 10px 10px;
  display: flex;
  flex-direction: column;
  &-name {
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: $primary;
    box-sizing: border-box;
    padding: 0 30px;
    position: relative;
    .delete {
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
    // background-color: $primary;
    // border-bottom: 1px solid $primary;
  }
  &-qrcode {
    width: 200px;
    border-radius: 8px;
    flex: 1;
    &__add {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
  }
  &-operation {
    padding: 6px 10px;
    .el-col {
      display: flex;
    }
    .el-button {
      flex: 1;
      // :deep(span) {
      //   display: flex;
      //   align-items: center;
      //   justify-content: space-around;
      // }
    }
    &__wrapper {
      margin-bottom: 6px;
    }
  }
}
</style>
