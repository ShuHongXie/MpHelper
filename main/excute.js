const { ipcMain, dialog } = require('electron')
const excuteSelect = require('./business/select.js')
const excuteMiniProgram = require('./business/miniProgram.js')
const excuteGit = require('./business/git.js')
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
  // 微信小程序二维码预览
  ipcMain.on('previewQrCode', (event, arg) => excuteMiniProgram(event, arg))
  // git 操作
  ipcMain.on('gitOperate', (event, arg) => excuteGit(event, arg))
}

module.exports = excute()
