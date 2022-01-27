/*
 * @Author: 谢树宏
 * @Date: 2022-01-27 15:32:44
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 15:46:07
 * @FilePath: /electron-mp-ci/script/release/common/macConfig.js
 */
if (process.platform != 'darwin') module.exports = {}
else
  module.exports = {
    icon: 'resource/icon.icns',
    type: 'distribution',
    identity: 'Apple Distribution: Hangzhou ****** System Technology Co., Ltd. (******BACWL)'
  }
