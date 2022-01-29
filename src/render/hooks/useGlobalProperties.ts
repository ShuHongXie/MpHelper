/*
 * @Author: 谢树宏
 * @Date: 2022-01-29 09:25:38
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-29 10:04:51
 * @FilePath: /electron-mp-ci/src/render/hooks/useGlobalProperties.ts
 */
import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 全局函数hook
export default () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  const globalProperties = appContext.config.globalProperties

  return {
    global: globalProperties,
    router: useRouter(),
    route: useRoute()
  }
}
