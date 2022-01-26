/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:06:18
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-26 10:42:09
 * @FilePath: /electron-mp-ci/script/dev/rollup.js
 */

const loadConfigFile = require('rollup/dist/loadConfigFile')
const path = require('path')
const rollup = require('rollup')
const chalk = require('chalk')
loadConfigFile(path.resolve(__dirname, 'rollup.dev.config.js'), { format: 'cjs' }).then(
  async ({ options, warnings }) => {
    console.log(`start watch`, warnings)

    // This prints all deferred warnings
    warnings.flush()

    for (const optionsObj of options) {
      console.log(optionsObj)
      const bundle = await rollup.rollup(optionsObj)
      await Promise.all(optionsObj.output.map(bundle.write))
    }

    const watcher = rollup.watch(options)
    watcher.on('event', ({ result, code, input = '', output = '' }) => {
      if (code === 'BUNDLE_START') {
        console.log(chalk.cyan(`开始编译文件：${input}`))
      }
      if (code === 'BUNDLE_END') {
        console.log(chalk.green(`编译文件完成, 输出到：${output}`))
      }
      if (result) {
        result.close()
      }
    })
  }
)