/*
 * @Author: 谢树宏
 * @Date: 2022-01-27 15:32:44
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 15:48:33
 * @FilePath: /electron-mp-ci/script/common/winConfig.js
 */
if (process.platform === 'darwin') module.exports = {}
else
  module.exports = {
    icon: '../../resource/unrelease/icon.ico',
    target: [
      {
        target: 'nsis',
        arch: ['ia32']
      }
    ],
    sign: async (config) => {
      //应用签名逻辑后文详细介绍
    }
  }
