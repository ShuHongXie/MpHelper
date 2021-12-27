import { getCurrentInstance, ComponentInternalInstance } from 'vue'

// 全局函数hook
export default () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  const globalProperties = appContext.config.globalProperties
  return {
    global: globalProperties,
  }
}
