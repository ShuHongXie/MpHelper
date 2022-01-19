/*
 * @Author: 谢树宏
 * @Date: 2022-01-11 09:13:42
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-19 13:46:03
 * @FilePath: /electron-mp-ci/main/excute.js
 */
const { ipcMain, dialog } = require('electron')
const excuteSelect = require('./business/select.js')
const excuteMiniProgram = require('./business/miniProgram.js')
const excuteGit = require('./business/git.js')
const excuteCommon = require('./business/common.js')
// 逻辑处理层
function excute() {
  // 打开文件/文件夹
  ipcMain.on('select', (event, arg) => {
    console.log(event, arg)
    dialog
      .showOpenDialog({
        title: '选择文件',
        buttonLabel: '选择',
        properties: ['openFile'],
        ...arg.params
      })
      .then(async (fileObject) => excuteSelect(event, arg, fileObject))
  })
  // 微信小程序CI操作
  ipcMain.on('miniProgram', (event, arg) => excuteMiniProgram(event, arg))
  // git 操作
  ipcMain.handle('gitOperate', (event, arg) => excuteGit(event, arg))
  // 公共操作
  ipcMain.handle('commonOperate', (event, arg) => excuteCommon(event, arg))
}

module.exports = excute()
