/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-26 15:55:35
 * @FilePath: /electron-mp-ci/src/main/utils/tool.ts
 */
import path from 'path'
import fs from 'fs'
const isWindowPlatform = process.platform === 'win32'
const isMacOsPlatform = process.platform === 'darwin'
/**
 * 过期时间计算
 * @param {*} intervalTime 间隔时间 分钟
 * @return {*}
 */
function getExpireTime(intervalTime: number) {
  intervalTime = intervalTime * 60 * 1000
  const timestamp = new Date().getTime() + intervalTime
  const expireTime = new Date(timestamp)
  const year = expireTime.getFullYear()
  console.log(expireTime.getMonth())
  const month =
    expireTime.getMonth() + 1 < 10 ? `0${expireTime.getMonth() + 1}` : expireTime.getMonth() + 1
  const date = expireTime.getDate()
  const hours = expireTime.getHours() < 10 ? `0${expireTime.getHours()}` : expireTime.getHours()
  const minutes =
    expireTime.getMinutes() < 10 ? `0${expireTime.getMinutes()}` : expireTime.getMinutes()
  return `${year}-${month}-${date} ${hours}:${minutes}`
}

/**
 *
 * 获取所有文件
 * @param {string} dirPath 文件简介路径
 * @param {boolean} [deep=false] 是否进行深度遍历
 * @param {string[]} [ignoreDir=['node_modules', '.git', 'dist']] 忽略的文件夹
 * @return {*}
 */
function findAllFile(
  dirPath: string,
  deep: boolean = true,
  ignoreDir: string[] = ['node_modules', '.git', 'dist']
) {
  const files = fs.readdirSync(dirPath)
  const filtedFiles: string[] = []
  files.forEach((file) => {
    if (!ignoreDir.includes(file)) {
      const stat = fs.statSync(path.join(dirPath, file))
      if (deep) {
        if (stat.isDirectory()) {
          filtedFiles.push(...findAllFile(path.join(dirPath, file), true, ignoreDir))
        } else {
          filtedFiles.push(path.join(dirPath, file))
        }
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
function existFile(dirPath: string, file: string | RegExp, deep: boolean = false) {
  const files = findAllFile(dirPath, deep)
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

export { getExpireTime, findAllFile, existFile }
