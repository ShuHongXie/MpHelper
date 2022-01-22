/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-21 17:54:27
 * @FilePath: /electron-mp-ci/main/utils/tool.js
 */
const fs = require('fs')
const path = require('path')
const isWindowPlatform = process.platform === 'win32'
const isMacOsPlatform = process.platform === 'darwin'
/**
 * 过期时间计算
 * @param {*} intervalTime 间隔时间
 * @return {*}
 */
function getExpireTime(intervalTime) {
  // 间隔时间设置为
  intervalTime = intervalTime * 60 * 1000
  const timestamp = new Date().getTime() + intervalTime
  const expireTime = new Date(timestamp)
  return `${expireTime.getFullYear()}-${
    expireTime.getMonth() + 1
  }-${expireTime.getDate()} ${expireTime.getHours()}:${expireTime.getMinutes()}`
}

/**
 * 获取所有文件
 * @param {*} dirPath 文件简介路径
 * @param {string} [ignoreDir=['node_modules', '.git']] 忽略的文件夹
 * @return {*}
 */
function findAllFile(dirPath, ignoreDir = ['node_modules', '.git']) {
  const files = fs.readdirSync(dirPath)
  const filtedFiles = []
  files.forEach((file) => {
    if (!ignoreDir.includes(file)) {
      const stat = fs.statSync(path.join(dirPath, file))
      if (stat.isDirectory()) {
        filtedFiles.push(...findAllFile(path.join(dirPath, file), ignoreDir))
      } else {
        filtedFiles.push(path.join(dirPath, file))
      }
    }
  })
  return filtedFiles
}

/**
 *
 * 判断当前文件夹下是否存在某个文件
 * @param {*} dirPath 文件路径
 * @param {*} file 文件名称/文件正则表达式
 * @return {*}
 */
function existFile(dirPath, file) {
  const files = findAllFile(dirPath)
  let i = 0
  while (i <= files.length) {
    // 正则模式处理
    if (file instanceof RegExp && file.test(files[i])) {
      return files[i]
    }
    // 字符串模式处理
    if (
      typeof file === 'string' &&
      files[i] &&
      files[i].slice(
        files[i].lastIndexOf(isWindowPlatform ? '\\' : isMacOsPlatform ? '/' : '') + 1
      ) === file
    ) {
      return files[i]
    }
    i++
  }
  return false
}

module.exports = {
  getExpireTime,
  findAllFile,
  existFile
}
