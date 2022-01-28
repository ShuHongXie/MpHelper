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

const buildMain = function () {
  loadConfigFile(path.resolve(__dirname, 'rollup.release.config.js'), { format: 'cjs' }).then(
    async ({ options, warnings }) => {
      console.log(`start watch`)
      warnings.flush()

      for (const optionsObj of options) {
        const bundle = await rollup.rollup(optionsObj)
        await Promise.all(optionsObj.output.map(bundle.write))
      }
    }
  )
}

module.exports = buildMain
