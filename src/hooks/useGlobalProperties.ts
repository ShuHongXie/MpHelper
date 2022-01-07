import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 全局函数hook
export default () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  const globalProperties = appContext.config.globalProperties
  console.log(globalProperties)

  return {
    global: globalProperties,
    router: useRouter(),
    route: useRoute()
  }
}
