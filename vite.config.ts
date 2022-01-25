/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-24 15:18:22
 * @FilePath: /electron-mp-ci/vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 不限制监听数量
process.setMaxListeners(0)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/scss/element.scss" as *; @use "@/assets/scss/mixin.scss" as *; @use "@/assets/scss/constarnt.scss" as *;`
      }
    }
  },
  // base: path.resolve(__dirname, './dist/'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/render'),
      '~': path.resolve(__dirname, 'src/main')
    }
  }
})
