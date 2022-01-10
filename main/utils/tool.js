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
