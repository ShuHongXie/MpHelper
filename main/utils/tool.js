/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-21 10:28:33
 * @FilePath: /electron-mp-ci/main/utils/tool.js
 */
// 过期时间计算
function getExpireTime(intervalTime) {
  // 间隔时间设置为
  intervalTime = intervalTime * 60 * 1000
  const timestamp = new Date().getTime() + intervalTime
  const expireTime = new Date(timestamp)
  return `${expireTime.getFullYear()}-${
    expireTime.getMonth() + 1
  }-${expireTime.getDate()} ${expireTime.getHours()}:${expireTime.getMinutes()}`
}

module.exports = {
  getExpireTime
}
