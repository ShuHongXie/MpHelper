/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-21 17:53:37
 * @FilePath: /electron-mp-ci/test.js
 */
const fs = require('fs')
const path = require('path')
const isWindowPlatform = process.platform === 'win32'
const isMacOsPlatform = process.platform === 'darwin'

/**
 * 获取所有文件
 * @param {*} dirPath 文件简介路径
 * @param {string} [ignoreDir=['node_modules', '.git']] 忽略的文件夹
 * @return {*}
 */
function findAllFile(dirPath, ignoreDir = ['node_modules', '.git', 'dist']) {
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
  // console.log(JSON.stringify(files))
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

console.log(existFile(path.normalize('D:\\workspace\\uni_ugc'), 'pages.json'))
