'use strict';

var electron = require('electron');
var electronRemote = require('@electron/remote/main');
var path = require('path');
var fs = require('fs');
var git = require('isomorphic-git');
var Low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var electronRemote__default = /*#__PURE__*/_interopDefaultLegacy(electronRemote);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var git__default = /*#__PURE__*/_interopDefaultLegacy(git);
var Low__default = /*#__PURE__*/_interopDefaultLegacy(Low);
var FileSync__default = /*#__PURE__*/_interopDefaultLegacy(FileSync);

/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:35:28
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:46:11
 * @FilePath: /electron-mp-ci/src/main/db.ts
 */
// @ts-ignore
const LodashId = require('lodash-id');
// 获取db.json兼容
const adapter = new FileSync__default["default"](path__default["default"].resolve(process.type === 'renderer'
    ? require('@electron/remote').app.getPath('userData')
    : electron.app.getPath('userData'), 'db.json'));
const db = Low__default["default"](adapter);
db._.mixin(LodashId);
if (!db.has('list').value()) {
    db.set('list', []).write();
}

/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 15:18:45
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:50:08
 * @FilePath: /electron-mp-ci/src/main/utils/response.ts
 */
/**
 *
 * 统一返回结果集
 * @export
 * @class Reply
 */
class Reply {
    status;
    data;
    constructor(status, data = null) {
        this.status = status;
        this.data = data;
    }
    get setData() {
        return this.data;
    }
    set getData(value) {
        this.data = value;
    }
    get getStatus() {
        return this.status;
    }
    set setStatus(value) {
        this.status = value;
    }
}

/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 15:18:44
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:53:07
 * @FilePath: /electron-mp-ci/src/main/constrant.ts
 */
// 成功标识
const SUCCESS = 'success';

async function excuteCommon(event, arg) {
    const { type, params = {} } = arg;
    switch (type) {
        // 项目信息刷新 更新当前git的HEAD分支和分支列表
        case 'refresh':
            console.log('进行刷洗操作');
            const gitDirPath = path__default["default"].join(params.path, '/.git/HEAD');
            const existGitDir = fs__default["default"].existsSync(gitDirPath);
            if (existGitDir) {
                // 获取当前项目下的所有分支
                const branches = await git__default["default"].listBranches({ fs: fs__default["default"], dir: params.path });
                // 获取当前项目下的当前分支
                const currentBranch = await git__default["default"].currentBranch({
                    fs: fs__default["default"],
                    dir: params.path,
                    fullname: false
                });
                // 插入数据
                db.read()
                    .get('list')
                    .find({ id: params.id })
                    .assign({
                    branches,
                    currentBranch
                })
                    .write();
            }
            else {
                // 插入数据
                db.read()
                    .get('list')
                    .find({ id: params.id })
                    .assign({
                    branches: '',
                    currentBranch: []
                })
                    .write();
            }
            return new Reply(SUCCESS, {
                // 返回值往往带有其他信息 这里用正则去掉
                message: '刷新成功'
            });
    }
}

/*
 * @Author: 谢树宏
 * @Date: 2022-01-11 09:13:42
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:04:03
 * @FilePath: /electron-mp-ci/src/main/excute.ts
 */
// 逻辑处理层
function excute() {
    // 打开文件/文件夹
    // ipcMain.on('select', (event, arg) => {
    //   console.log(event, arg)
    //   dialog
    //     .showOpenDialog({
    //       title: '选择文件',
    //       buttonLabel: '选择',
    //       properties: ['openFile'],
    //       ...arg.params
    //     })
    //     .then(async (fileObject) => excuteSelect(event, arg, fileObject))
    // })
    // // 微信小程序CI操作
    // ipcMain.on('miniProgram', (event, arg) => excuteMiniProgram(event, arg))
    // // git 操作
    // ipcMain.handle('gitOperate', (event, arg) => excuteGit(event, arg))
    // 公共操作
    electron.ipcMain.handle('commonOperate', (event, arg) => excuteCommon(event, arg));
}

/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:43:41
 * @FilePath: /electron-mp-ci/src/main/index.ts
 */
electronRemote__default["default"].initialize();
excute();
console.log('1');
try {
    require('electron-reloader')(module, {
        ignore: require('path').resolve(__dirname, '../db/db.json')
    });
}
catch (_) {
    console.log(_);
}
function createWindow() {
    // 创建浏览器窗口
    const mainWindow = new electron.BrowserWindow({
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
    });
    const loadURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:3000` // 开发模式的话走webpack-dev-server的url
        : `file://${__dirname}/index.html`;
    // 加载 index.html
    // mainWindow.loadFile('index.html') // 此处跟electron官网路径不同，需要注意
    mainWindow.loadURL(loadURL);
    // 打开开发工具
    mainWindow.webContents.openDevTools();
    // remote组件初始化
    electronRemote__default["default"].enable(mainWindow.webContents);
    // 聚焦
    mainWindow.on('focus', () => {
        console.log('聚焦');
    });
    // 窗口关闭
    console.log('窗口开启');
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
electron.app.whenReady().then(() => {
    createWindow();
    electron.app.on('activate', function () {
        // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
        // 打开的窗口，那么程序会重新创建一个窗口。
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron.app.quit();
    }
});
