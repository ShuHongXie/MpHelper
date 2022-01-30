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
    oneClick: false,
    perMachine: true,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    include: path.join(process.cwd(), 'script/common/installer.nsh'),
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    differentialPackage: false,
    shortcutName: 'MpHelper',
    installerIcon: '../resource/icon.ico',
    uninstallerIcon: '../resource/icon.ico',
    installerHeader: '../resource/icon.ico',
    installerHeaderIcon: '../resource/icon.ico'
  }
