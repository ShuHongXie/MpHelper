/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-24 17:07:22
 * @FilePath: /electron-mp-ci/src/main/index.ts
 */
// 控制应用生命周期和创建原生浏览器窗口的模组
// const { app, BrowserWindow } = require('electron')
import { app, BrowserWindow } from 'electron'
import electronRemote from '@electron/remote/main'
electronRemote.initialize()
require('./excute.js')
try {
  require('electron-reloader')(module, {
    ignore: require('path').resolve(__dirname, '../db/db.json')
  })
} catch (_) {
  console.log(_)
}

console.log(app.getPath('userData'))

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    resizable: false,
    skipTaskbar: true,
    frame: false,
    thickFrame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
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
  // remote组件初始化
  electronRemote.enable(mainWindow.webContents)
  // 聚焦
  mainWindow.on('focus', () => {
    console.log('聚焦')
  })
  // 窗口关闭
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
