<template>
  <div class="project">
    <div class="project-name" v-if="data">
      <span>{{ data.projectName }}</span>
      <mp-icon
        :size="14"
        custom-class="delete"
        icon="round_close_light"
        color="red"
        @click.stop="$emit('remove')"
      ></mp-icon>
      <mp-icon
        :custom-class="`refresh ${clickRefresh ? 'active' : ''}`"
        icon="refresh"
        :size="16"
        @click.stop="refresh"
      ></mp-icon>
      <!-- <el-progress :percentage="50" /> -->
      <!-- <el-checkbox class="delete" /> -->
    </div>
    <div class="project-qrcode" v-loading="data?.loading" :element-loading-text="data?.loadingText">
      <mp-image
        v-if="data?.qrcodePath"
        :src="qrCode"
        :preview-src-list="[data.qrcodePath]"
      ></mp-image>
      <div v-if="!data" class="project-qrcode__add" @click.stop="$emit('add')">
        <mp-icon icon="add" color="#6489ff" :size="40" />
      </div>
      <div v-if="!data?.qrcodePath" class="project-tip">点击下方按钮进行预览</div>
    </div>
    <div v-if="data?.expireTime" class="project-qrcode__tip" @click="copyImage">
      {{ `将于${data.expireTime}后失效` }}
    </div>
    <div class="project-operation" v-if="data">
      <el-row class="project-operation__wrapper">
        <el-col>
          <el-popconfirm
            confirm-button-text="直接预览"
            cancel-button-text="添加备注"
            cancel-button-type="warning"
            icon-color="red"
            title="需要添加备注吗?"
            @confirm="$emit('preview')"
            @cancel="$emit('previewDesc')"
          >
            <template #reference>
              <el-button type="primary" plain size="small" :disabled="data?.loading"
                >预览</el-button
              >
            </template>
          </el-popconfirm>
          <el-button
            type="primary"
            color="#FFA500"
            size="small"
            :disabled="data?.loading"
            @click.stop="$emit('upload')"
            >上传</el-button
          >
        </el-col>
      </el-row>
      <el-row class="project-operation__wrapper">
        <el-col :span="24">
          <el-button
            type="success"
            size="small"
            @click.stop="$emit('edit')"
            :disabled="data?.loading"
            ><mp-icon icon="setting"></mp-icon> 配置</el-button
          >
          <el-button
            type="primary"
            color="#9370DB"
            size="small"
            @click.stop="$emit('switch')"
            :disabled="data?.loading"
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
import { defineComponent, onMounted, ref, PropType, reactive, computed } from 'vue'
import useGlobalProperties from '@/hooks/useGlobalProperties'
export default defineComponent({
  props: {
    data: {
      type: (Array as PropType<List>) || undefined,
      default: () => undefined
    }
  },
  setup(props, { emit }) {
    const { global } = useGlobalProperties()
    let timer = ref<any>(null)
    let clickRefresh = ref(false)
    const qrCode = computed(() => {
      console.log(global.nativeImage.createFromPath(props?.data?.fullQrcodePath).toDataURL())
      return global.nativeImage.createFromPath(props?.data?.fullQrcodePath).toDataURL()
    })
    // 刷新
    const refresh = () => {
      clickRefresh.value = true
      clearTimeout(timer.value)
      emit('refresh')
      timer.value = setTimeout(() => {
        clickRefresh.value = false
      }, 1000)
    }
    // 图片复制
    const copyImage = () => {
      let qrcode = global.nativeImage.createFromPath(props?.data?.fullQrcodePath)
      console.log(qrcode, global.clipboard.writeImage)
      global.clipboard.writeImage(qrcode)
      global.$message({
        message: '已复制到剪贴板.',
        type: 'success'
      })
    }
    onMounted(() => {})
    return {
      clickRefresh,
      refresh,
      copyImage,
      qrCode
    }
  }
})
</script>

<style lang="scss" scoped>
.project {
  width: 220px;
  height: 370px;
  background: #ffffff;
  box-shadow: 2px 0px 10px 0px rgba(96, 125, 238, 0.35);
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0 10px 10px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  // &:hover {
  //   transform: translate3d(2px, 2px, 2px);
  // }
  &-tip {
    height: 100%;
    line-height: 246px;
    text-align: center;
    color: rgb(172, 172, 172, 0.6);
  }
  &-name {
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: $primary;
    box-sizing: border-box;
    padding: 0 30px;
    position: relative;
    @include line-single;
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
