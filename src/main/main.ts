// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const ci = require('miniprogram-ci')
const git = require('isomorphic-git')
import db from '../db/db'

// 打开文件夹
ipcMain.on('openFolder', (event, arg) => {
  // console.log(event, arg, '1')
  dialog
    .showOpenDialog({
      title: '选择文件夹',
      properties: ['openDirectory']
    })
    .then(async (fileObject) => {
      const pathList = fileObject.filePaths
      if (pathList.length) {
        const gitDirPath = path.join(pathList[0], '/.git/HEAD')
        const existGitDir = fs.existsSync(gitDirPath)
        let branches = await git.listBranches({ fs, dir: pathList[0] })
        console.log(branches)

        // event.reply('openFolderReply', existGitDir ? pathList[0] : '')
      }
    })
})

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      // /nodeIntegration: true,
      nodeIntegration: true,
      contextIsolation: false //  把这一项加上错误就会消失
    }
  })

  const loadURL =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3000` // 开发模式的话走webpack-dev-server的url
      : `file://${__dirname}/index.html`

  // 加载 index.html
  // mainWindow.loadFile('index.html') // 此处跟electron官网路径不同，需要注意
  mainWindow.loadURL(loadURL)

  // 打开开发工具
  mainWindow.webContents.openDevTools()
  console.log('窗口开启')
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
