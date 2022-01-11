<template>
  <div class="project">
    <div class="project-name" v-if="data">
      {{ data.projectName }}
      <mp-icon
        custom-class="delete"
        icon="round_close_light"
        color="red"
        :size="16"
        @click.stop="$emit('remove')"
      ></mp-icon>
      <mp-icon
        :custom-class="`refresh ${clickRefresh ? 'active' : ''}`"
        icon="refresh"
        :size="16"
        @click.stop="refresh"
      ></mp-icon>
      <!-- <el-checkbox class="delete" /> -->
    </div>
    <div class="project-qrcode" v-loading="data?.loading" :element-loading-text="data?.loadingText">
      <mp-image
        v-if="data?.qrcodePath"
        style="height: 200px"
        :src="data.qrcodePath"
        :preview-src-list="[data.qrcodePath]"
      ></mp-image>
      <div v-else class="project-qrcode__add" @click.stop="$emit('add')">
        <mp-icon icon="add" color="#6489ff" :size="40" />
      </div>
      <div v-if="data?.expireTime" class="project-qrcode__tip" @click="copyImage">
        {{ `将于${data.expireTime}后失效` }}
      </div>
    </div>
    <div class="project-operation" v-if="data">
      <el-row class="project-operation__wrapper">
        <el-col>
          <el-button
            type="primary"
            plain
            size="small"
            @click.stop="$emit('preview')"
            :disabled="data?.loading"
            >预览</el-button
          >
          <el-button type="primary" color="#FFA500" size="small" :disabled="data?.loading"
            >上传</el-button
          >
        </el-col>
      </el-row>
      <el-row class="project-operation__wrapper">
        <el-col :span="24">
          <el-button type="success" size="small" @click.stop="$emit('edit')"
            ><mp-icon icon="setting"></mp-icon> 配置</el-button
          >
          <el-button type="primary" color="#9370DB" size="small" @click.stop="$emit('switch')"
            >分支切换</el-button
          >
        </el-col>
      </el-row>
      <!-- <el-row>
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
      </el-row> -->
    </div>
  </div>
</template>

<script lang="ts">
import { List } from '@/entity/Db'
import { defineComponent, onMounted, ref, PropType, reactive } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
import { copy } from '@/utils/tool'
export default defineComponent({
  props: {
    data: {
      type: (Array as PropType<List>) || undefined,
      default: () => undefined
    }
  },
  setup(props, ctx) {
    const { global } = useGlobalProperties()
    const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
    let timer = ref<any>(null)
    let clickRefresh = ref(false)
    // 刷新
    const refresh = () => {
      clickRefresh.value = true
      clearTimeout(timer.value)
      timer.value = setTimeout(() => {
        clickRefresh.value = false
      }, 1000)
    }
    // 图片复制
    const copyImage = () => {
      console.log(props?.data?.fullQrcodePath)

      let qrcode = global.nativeImage.createFromPath(props?.data?.fullQrcodePath)
      console.log(qrcode, global.clipboard.writeImage)

      global.clipboard.writeImage(qrcode)
      // qrcode = null
      global.$message({
        message: '已复制到剪贴板.',
        type: 'success'
      })
    }
    onMounted(() => {})
    return {
      url,
      clickRefresh,
      refresh,
      copy,
      copyImage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/constarnt.scss';
.project {
  width: 200px;
  height: 350px;
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
      cursor: pointer;
    }
    .refresh {
      @extend .delete;
      right: auto;
      left: 10px;
      transition: all 0.3s ease;
      &.active {
        animation: live-rotate 1s;
        @keyframes live-rotate {
          from {
            transform: rotate(0);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
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
    &__tip {
      text-align: center;
      margin-bottom: 8px;
      color: $primary;
      font-size: 12px;
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
