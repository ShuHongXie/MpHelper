/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:06:18
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-26 14:10:11
 * @FilePath: /electron-mp-ci/script/dev/rollup.js
 */

const loadConfigFile = require('rollup/dist/loadConfigFile')
const path = require('path')
const rollup = require('rollup')
const chalk = require('chalk')
loadConfigFile(path.resolve(__dirname, 'rollup.dev.config.js'), { format: 'cjs' }).then(
  async ({ options, warnings }) => {
    console.log(`start watch`)

    // This prints all deferred warnings
    warnings.flush()

    for (const optionsObj of options) {
      const bundle = await rollup.rollup(optionsObj)
      await Promise.all(optionsObj.output.map(bundle.write))
    }

    const watcher = rollup.watch(options)
    watcher.on('event', ({ result, code, input = '', output = '' }) => {
      switch (code) {
        case 'BUNDLE_START':
          console.log(chalk.cyan(`开始编译文件：${input}`))
          break
        case 'BUNDLE_END':
          console.log(chalk.green(`编译文件完成, 输出到：${output}`))
          break
        case 'ERROR':
          console.log(chalk.red(`编译失败`))
          break
      }
    })
  }
)
