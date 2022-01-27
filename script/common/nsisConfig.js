/*
 * @Author: 谢树宏
 * @Date: 2022-01-27 15:32:44
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 15:47:55
 * @FilePath: /electron-mp-ci/script/dev/common/nsisConfig.js
 */
let path = require('path')
if (process.platform === 'darwin') module.exports = {}
else
  module.exports = {
    perMachine: true,
    allowElevation: true,
    allowToChangeInstallationDirectory: false,
    include: path.join(process.cwd(), 'script/common/installer.nsh'),
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'youAppName',
    installerIcon: '../resource/unrelease/icon.ico',
    uninstallerIcon: '../resource/unrelease/icon.ico',
    installerHeader: '../resource/unrelease/icon.ico',
    installerHeaderIcon: '../resource/unrelease/icon.ico'
  }
