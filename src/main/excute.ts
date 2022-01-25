/*
 * @Author: 谢树宏
 * @Date: 2022-01-11 09:13:42
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 17:38:53
 * @FilePath: /electron-mp-ci/src/main/excute.ts
 */
import { ipcMain, dialog } from 'electron'

import excuteMiniProgram from './business/miniProgram.js'
import excuteGit from './business/git.js'
import excuteSelect from './business/select.js'
import excuteCommon from './business/common.js'
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

export default excute
