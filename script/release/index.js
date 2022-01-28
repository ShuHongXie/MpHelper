/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 17:18:04
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-28 15:54:08
 * @FilePath: /electron-mp-ci/script/release/index.js
 */
const { exec } = require('shelljs')
const execBuildMain = require('./rollup')
const path = require('path')
const fs = require('fs')

const dev = {
  async buildRender() {
    // const devProcess = exec('concurrently -k "node script/dev/rollup.js" ', {
    await exec('vue-tsc --noEmit && vite build', {
      async: true
    })
  },
  async buildMain() {
    await execBuildMain()
  },
  async buildModule() {
    let pkgJsonPath = path.join(process.cwd(), 'package.json')
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    let electronConfig = localPkgJson.devDependencies.electron.replace('^', '')
    delete localPkgJson.scripts
    delete localPkgJson.devDependencies
    localPkgJson.main = 'entry.js'
    localPkgJson.devDependencies = { electron: electronConfig }
    fs.writeFileSync(
      path.join(process.cwd(), 'release/bundled/package.json'),
      JSON.stringify(localPkgJson)
    )
    fs.mkdirSync(path.join(process.cwd(), 'release/bundled/node_modules'))
  },
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), 'release'),
          app: path.join(process.cwd(), 'release/bundled')
        },
        files: ['**'],
        extends: null,
        productName: 'MpHelper',
        appId: 'com.ShuHongXie.MpHelper',
        asar: false,
        extraResources: require('../common/extraResources.js'),
        win: require('../common/winConfig.js'),
        mac: require('../common/macConfig.js'),
        nsis: require('../common/nsisConfig.js'),
        publish: [{ provider: 'generic', url: '' }]
      },
      project: process.cwd()
    }
    let builder = require('electron-builder')
    return builder.build(options)
  },
  async start() {
    await this.buildRender()
    // await this.buildMain()
    // await this.buildModule()
    // this.buildInstaller()
  }
}

dev.start()
