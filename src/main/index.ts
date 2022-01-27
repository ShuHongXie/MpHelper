/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 11:33:12
 * @FilePath: /electron-mp-ci/src/main/index.ts
 */
// 控制应用生命周期和创建原生浏览器窗口的模组
import { app, BrowserWindow, Tray, Menu, nativeImage, dialog } from 'electron'
import electronRemote from '@electron/remote/main'
import { PKG } from './constrant'
electronRemote.initialize()
import excute from './excute'
import path from 'path'
excute()

try {
  require('electron-reloader')(module, {
    ignore: require('path').resolve(__dirname, '../db/db.json')
  })
} catch (_) {
  console.log(_)
}
let tray: Tray
function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1392,
    height: 800,
    resizable: false,
    skipTaskbar: false,
    frame: false,
    thickFrame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    maximizable: false,
    transparent: true,
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

  return mainWindow
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  const window = createWindow()
  // 增加顶部应用图标
  const icon = nativeImage.createFromPath(
    path.join(
      process.cwd(),
      process.platform === 'win32' ? '/resource/tray_win@3x.png' : '/resource/tray_mac@3x.png'
    )
  )
  tray = new Tray(icon)
  if (process.platform === 'darwin' || process.platform === 'win32') {
    tray.on('right-click', () => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: '关于',
          click() {
            dialog.showMessageBox({
              title: 'MpHelper',
              message: '微信小程序辅助工具',
              detail: `Version: ${PKG.version}\nAuthor: ShuHongXie\nGithub: https://github.com/ShuHongXie`
            })
          }
        },
        {
          label: '退出',
          click: (menuItem, browserWindow, event) => {
            app.quit()
          }
        }
      ])
      tray!.popUpContextMenu(contextMenu)
      tray!.on('click', () => {
        console.log('点击了')

        window.show()
      })
    })
  }

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
// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
