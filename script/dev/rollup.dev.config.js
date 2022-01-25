/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:06:18
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 15:27:58
 * @FilePath: /electron-mp-ci/script/dev/rollup.dev.config.js
 */
const path = require('path')
const typescript = require('@rollup/plugin-typescript')

module.exports = [
  {
    input: path.join(process.cwd(), 'src/main/index.ts'),
    output: {
      file: path.join(process.cwd(), '/release/bundled/entry.js'),
      format: 'cjs'
    },
    plugins: [typescript()],
    external: ['electron', 'isomorphic-git', 'lowdb']
  }
]
