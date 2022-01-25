/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 17:18:04
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 15:58:23
 * @FilePath: /electron-mp-ci/script/dev/index.js
 */
const { exec } = require('shelljs')

const dev = {
  startDev() {
    // const devProcess = exec('concurrently -k "node script/dev/rollup.js" ', {
    const devProcess = exec('concurrently -k "vite" "node script/dev/rollup.js" ', {
      async: true
    })
    devProcess.stdout.on('close', function (data) {
      console.log('开发进程关闭了', data)
      process.exit()
    })
  },
  start() {
    this.startDev()
  }
}

dev.start()
