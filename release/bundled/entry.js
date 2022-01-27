'use strict';

var electron = require('electron');
var electronRemote = require('@electron/remote/main');
var fs = require('fs');
var ci = require('miniprogram-ci');
var path$1 = require('path');
var uuid = require('uuid');
var Low = require('lowdb');
var git = require('isomorphic-git');
var shelljs = require('shelljs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var electronRemote__default = /*#__PURE__*/_interopDefaultLegacy(electronRemote);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var ci__default = /*#__PURE__*/_interopDefaultLegacy(ci);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
var Low__default = /*#__PURE__*/_interopDefaultLegacy(Low);
var git__default = /*#__PURE__*/_interopDefaultLegacy(git);

/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:35:28
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-26 11:47:51
 * @FilePath: /electron-mp-ci/src/main/db.ts
 */
// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
const { app } = require('electron');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
console.log(process.type === 'renderer'
    ? require('@electron/remote').app.getPath('userData')
    : app.getPath('userData'));
// @ts-ignore
const LodashId = require('lodash-id');
// 获取db.json兼容
const adapter = new FileSync(path.resolve(process.type === 'renderer'
    ? require('@electron/remote').app.getPath('userData')
    : app.getPath('userData'), 'db.json'));
// @ts-ignore
const db = Low__default["default"](adapter);
db._.mixin(LodashId);
if (!db.has('list').value()) {
    db.set('list', []).write();
}

/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 15:18:45
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 16:03:24
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
    constructor(status, data = {}) {
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

// const pkg = require(path.join(process.cwd(), 'package.json'))
// console.log(pkg)
// 成功标识
const SUCCESS = 'success';
// 失败标识
const FAIL = 'fail';
// export const PKG = pkg

/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:44:21
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 11:32:03
 * @FilePath: /electron-mp-ci/src/main/utils/tool.ts
 */
const isWindowPlatform = process.platform === 'win32';
const isMacOsPlatform = process.platform === 'darwin';
/**
 * 过期时间计算
 * @param {*} intervalTime 间隔时间 分钟
 * @return {*}
 */
function getExpireTime(intervalTime) {
    intervalTime = intervalTime * 60 * 1000;
    const timestamp = new Date().getTime() + intervalTime;
    const expireTime = new Date(timestamp);
    const year = expireTime.getFullYear();
    console.log(expireTime.getMonth());
    const month = expireTime.getMonth() + 1 < 10 ? `0${expireTime.getMonth() + 1}` : expireTime.getMonth() + 1;
    const date = expireTime.getDate();
    const hours = expireTime.getHours() < 10 ? `0${expireTime.getHours()}` : expireTime.getHours();
    const minutes = expireTime.getMinutes() < 10 ? `0${expireTime.getMinutes()}` : expireTime.getMinutes();
    return `${year}-${month}-${date} ${hours}:${minutes}`;
}
/**
 *
 * 获取所有文件
 * @param {string} dirPath 文件简介路径
 * @param {boolean} [deep=false] 是否进行深度遍历
 * @param {string[]} [ignoreDir=['node_modules', '.git', 'dist']] 忽略的文件夹
 * @return {*}
 */
function findAllFile(dirPath, deep = true, ignoreDir = ['node_modules', '.git', 'dist']) {
    const files = fs__default["default"].readdirSync(dirPath);
    const filtedFiles = [];
    files.forEach((file) => {
        if (!ignoreDir.includes(file)) {
            const stat = fs__default["default"].statSync(path__default["default"].join(dirPath, file));
            if (deep) {
                if (stat.isDirectory()) {
                    filtedFiles.push(...findAllFile(path__default["default"].join(dirPath, file), true, ignoreDir));
                }
                else {
                    filtedFiles.push(path__default["default"].join(dirPath, file));
                }
            }
            else {
                filtedFiles.push(path__default["default"].join(dirPath, file));
            }
        }
    });
    return filtedFiles;
}
/**
 *
 * 判断当前文件夹下是否存在某个文件
 * @param {*} dirPath 文件路径
 * @param {*} file 文件名称/文件正则表达式
 * @return {*}
 */
function existFile(dirPath, file, deep = true) {
    const files = findAllFile(dirPath, deep);
    console.log(files);
    let i = 0;
    while (i <= files.length) {
        // 正则模式处理
        if (file instanceof RegExp && file.test(files[i])) {
            return files[i];
        }
        // 字符串模式处理
        if (typeof file === 'string' &&
            files[i] &&
            files[i].slice(files[i].lastIndexOf(isWindowPlatform ? '\\' : isMacOsPlatform ? '/' : '') + 1) === file) {
            return files[i];
        }
        i++;
    }
    return false;
}

let showIndex, ciInstance;
// CI实例创建
function createMiniProgramCI(event, arg) {
    showIndex = 0;
    const { type, params = {} } = arg;
    ciInstance = new ci__default["default"].Project({
        appid: params.appid,
        type: 'miniProgram',
        projectPath: params.outputPath,
        privateKeyPath: params.privatePath,
        ignores: ['node_modules/**/*']
    });
    switch (type) {
        case 'preview':
            preview(event, params);
            break;
        case 'upload':
            upload(event, params);
            break;
    }
}
// 上传
async function upload(event, params) {
    console.log('start upload...');
    try {
        const uploadResult = await ci__default["default"].upload({
            project: ciInstance,
            version: params.version,
            desc: params.desc,
            setting: {
                es6: true,
                es7: true,
                autoPrefixWXSS: true,
                minifyWXML: true,
                minifyWXSS: true,
                minifyJS: true,
                minify: true
            },
            onProgressUpdate: (res) => {
                if (res._msg !== 'upload') {
                    // 使用showIndex值来防止主进程和渲染进程频繁进行无意义的通信
                    !showIndex &&
                        event.reply('uploadReply', new Reply(SUCCESS, { message: `正在上传中`, index: params.index, done: false }));
                    showIndex++;
                }
                else if (res._msg === 'upload' && res._status === 'done') {
                    showIndex = 0;
                    event.reply('uploadReply', new Reply(SUCCESS, {
                        message: '',
                        done: true
                    }));
                }
            }
        });
        console.log(uploadResult);
    }
    catch (e) {
        showIndex = 0;
        // 格式化错误捕获信息
        if (e.message.includes('Error')) {
            const error = JSON.parse(e.message.substring(e.message.indexOf('{'), e.message.lastIndexOf('}') + 1));
            event.reply('uploadReply', new Reply(FAIL, {
                // 返回值往往带有其他信息 这里用正则去掉
                message: error.errMsg.replace(/(\,\sreference).*/, ''),
                index: params.index
            }));
        }
    }
}
// 预览
async function preview(event, params) {
    const uuid$1 = uuid.v4();
    // 没有文件夹时就新增文件夹
    if (!existFile(electron.app.getPath('documents'), 'mp-image', false)) {
        fs__default["default"].mkdirSync(path__default["default"].join(electron.app.getPath('documents'), 'mp-image'));
    }
    const qrcodeOutputDest = path__default["default"].join(electron.app.getPath('documents'), `/mp-image/${uuid$1}.png`);
    try {
        const previewResult = await ci__default["default"].preview({
            project: ciInstance,
            desc: params.desc,
            setting: {
                es6: true,
                es7: true,
                autoPrefixWXSS: true,
                minifyWXML: true,
                minifyWXSS: true,
                minifyJS: true,
                minify: true
            },
            robot: params.robot,
            qrcodeFormat: 'image',
            qrcodeOutputDest,
            pagePath: params.pagePath,
            searchQuery: params.searchQuery,
            scene: params.scene,
            version: '',
            onProgressUpdate: (res) => {
                // console.log(res)
                if (res._msg !== 'upload') {
                    event.reply('previewReply', new Reply(SUCCESS, { message: `正在编译中`, index: params.index, done: false }));
                }
                else if (res._msg === 'upload' && res._status === 'done') {
                    const expireTime = getExpireTime(25);
                    event.reply('previewReply', new Reply(SUCCESS, {
                        message: '',
                        index: params.index,
                        done: true,
                        path: `/image/${uuid$1}.png`,
                        fullPath: qrcodeOutputDest,
                        expireTime
                    }));
                    // @ts-ignore
                    db.read()
                        .get('list')
                        // @ts-ignore
                        .find({ id: params.id })
                        .assign({
                        qrcodePath: `/image/${uuid$1}.png`,
                        fullQrcodePath: qrcodeOutputDest,
                        expireTime
                    })
                        .write();
                }
            }
        });
        console.log(previewResult);
    }
    catch (e) {
        // 格式化错误捕获信息
        console.log(e.message); // "Hello"
        console.log(e.name); // "EvalError"
        console.log(e.stack); // "@Scratchpad/2:2:9\n"
        if (e.message.includes('Error')) {
            let errorMsg = '';
            if (!e.message.includes('{')) {
                errorMsg = e.message.slice(e.message.indexOf('Error: '));
            }
            else {
                errorMsg = JSON.parse(e.message.substring(e.message.indexOf('{'), e.message.lastIndexOf('}') + 1)).errMsg.replace(/(\,\sreference).*/, '');
            }
            event.reply('previewReply', new Reply(FAIL, {
                // 返回值往往带有其他信息 这里用正则去掉
                message: errorMsg,
                index: params.index
            }));
        }
    }
}

// 执行Git相关操作
async function executeGit(event, { type = '', params = {} }) {
    switch (type) {
        // 分支切换
        case 'checkout':
            try {
                await git__default["default"].checkout({
                    fs: fs__default["default"],
                    dir: params.path,
                    ref: params.currentBranch
                });
                return new Reply(SUCCESS, {
                    message: '切换成功'
                });
            }
            catch (e) {
                return new Reply(FAIL, {
                    message: e
                });
            }
            break;
        // Git状态
        case 'status':
            console.log(params);
            let matrixData = await git__default["default"].statusMatrix({
                fs: fs__default["default"],
                dir: params.path
            });
            console.log(matrixData);
            // 获取所有改动过的 或者未追踪的文件
            const normalData = matrixData.filter((item) => item[1] !== 1 || item[2] !== 1 || item[3] !== 1);
            console.log(normalData);
            // example StatusMatrix
            /**
                [
                  ["a.txt", 0, 2, 0], // new, untracked
                  ["b.txt", 0, 2, 2], // added, staged
                  ["c.txt", 0, 2, 3], // added, staged, with unstaged changes
                  ["d.txt", 1, 1, 1], // unmodified
                  ["e.txt", 1, 2, 1], // modified, unstaged
                  ["f.txt", 1, 2, 2], // modified, staged
                  ["g.txt", 1, 2, 3], // modified, staged, with unstaged changes
                  ["h.txt", 1, 0, 1], // deleted, unstaged
                  ["i.txt", 1, 0, 0], // deleted, staged
                ]
               */
            // 筛选在暂存区的 和没有在暂存区的数据
            // 数据格式 { path: 文件路径, status: example StatusMatrix中的状态用横杠连接 }
            const unstagedData = [];
            const stagedData = [];
            normalData.forEach((item) => {
                const path = item[0];
                const statusStr = item.slice(1, 4).join('');
                switch (statusStr) {
                    case '020':
                        unstagedData.push({
                            path,
                            status: 'new-untracked',
                            checked: false
                        });
                        break;
                    case '022':
                        stagedData.push({
                            path,
                            status: 'added-staged',
                            checked: true
                        });
                        break;
                    case '023':
                        unstagedData.push({
                            path,
                            status: 'modified-unstaged',
                            checked: false
                        });
                        stagedData.push({
                            path,
                            status: 'new-untracked',
                            checked: true
                        });
                        break;
                    case '121':
                        unstagedData.push({
                            path,
                            status: 'modified-unstaged',
                            checked: false
                        });
                        break;
                    case '122':
                        stagedData.push({
                            path,
                            status: 'modified-staged',
                            checked: true
                        });
                        break;
                    case '123':
                        unstagedData.push({
                            path,
                            status: 'modified-unstaged',
                            checked: false
                        });
                        stagedData.push({
                            path,
                            status: 'modified-staged',
                            checked: true
                        });
                        break;
                    case '101':
                        unstagedData.push({
                            path,
                            status: 'deleted-unstaged',
                            checked: false
                        });
                        break;
                    case '100':
                        stagedData.push({
                            path,
                            status: 'deleted-staged',
                            checked: true
                        });
                        break;
                    case '003':
                        stagedData.push({
                            path,
                            status: 'added-staged',
                            checked: true
                        });
                        unstagedData.push({
                            path,
                            status: 'deleted',
                            checked: false
                        });
                        break;
                }
            });
            console.log(stagedData, unstagedData);
            return new Reply(SUCCESS, {
                stagedData,
                unstagedData
            });
        // 从暂存区撤销回工作区
        case 'reset':
            console.log(params);
            try {
                for (const item of Array.isArray(params?.list) ? params?.list : [params?.list]) {
                    await git__default["default"].resetIndex({ fs: fs__default["default"], dir: params.project.path, filepath: item.path });
                }
                return executeGit(event, {
                    type: 'status',
                    params: params.project
                });
            }
            catch (e) {
                console.log(e);
            }
            break;
        // 从工作区加入暂存区
        case 'add':
            console.log(params);
            try {
                for (const item of Array.isArray(params?.list) ? params?.list : [params?.list]) {
                    if (item.status.includes('delete')) {
                        await git__default["default"].remove({ fs: fs__default["default"], dir: params.project.path, filepath: item.path });
                    }
                    else {
                        await git__default["default"].add({ fs: fs__default["default"], dir: params.project.path, filepath: item.path });
                    }
                }
                return executeGit(event, {
                    type: 'status',
                    params: params.project
                });
            }
            catch (e) {
                console.log(e);
            }
            break;
        // 从暂存区加入版本库
        case 'commit':
            let userName, userEmail, uerNameRequest, uerEmailRequest, promiseArray = [];
            const configName = await git__default["default"].getConfigAll({
                fs: fs__default["default"],
                dir: params.project.path,
                path: 'user.name'
            });
            console.log(configName);
            userName = configName.length ? configName[0] : '';
            const configEmail = await git__default["default"].getConfigAll({
                fs: fs__default["default"],
                dir: params.project.path,
                path: 'user.email'
            });
            userName = configEmail.length ? configName[0] : '';
            // 由于isomorphic-git只能访问当前.git文件夹下的配置
            // 没办法只能通过自己执行shell捕获
            if (!userName) {
                uerNameRequest = new Promise((resolve, reject) => {
                    const process = shelljs.exec('git config user.name', { async: true });
                    if (process) {
                        // @ts-ignore
                        process.stdout.on('data', function (data) {
                            data = data.replace(/\n/g, '');
                            resolve(data);
                        });
                        // @ts-ignore
                        process.stderr.on('data', (data) => {
                            reject(data);
                        });
                    }
                });
                promiseArray.push(uerNameRequest);
            }
            else {
                promiseArray.push(undefined);
            }
            if (!userEmail) {
                uerEmailRequest = new Promise((resolve, reject) => {
                    const process = shelljs.exec('git config user.email', { async: true });
                    // @ts-ignore
                    process.stdout.on('data', function (data) {
                        data = data.replace(/\n/g, '');
                        resolve(data);
                    });
                    // @ts-ignore
                    process.stderr.on('data', (data) => {
                        reject('error');
                    });
                });
                promiseArray.push(uerEmailRequest);
            }
            else {
                promiseArray.push(undefined);
            }
            // 如果有用户名 就可以直接提交
            if (promiseArray[0]) {
                try {
                    const data = await Promise.all(promiseArray);
                    userName = data[0];
                    userEmail = data[1] || '';
                    await git__default["default"].commit({
                        fs: fs__default["default"],
                        dir: params.project.path,
                        message: params.desc,
                        author: {
                            name: userName,
                            email: userEmail
                        }
                    });
                    executeGit(event, {
                        type: 'status',
                        params: params.project
                    });
                    return new Reply(SUCCESS, {
                        message: '提交成功'
                    });
                }
                catch (e) {
                    return new Reply(FAIL, {
                        message: e
                    });
                }
            }
            else {
                return new Reply(FAIL, {
                    message: '请配置您的git用户名和邮箱地址，可以通过全局配置或项目配置'
                });
            }
            break;
    }
}

// 执行选择文件逻辑
async function executeSelectFile(event, arg, fileObject) {
    const { canceled, filePaths } = fileObject;
    switch (arg.type) {
        // 选择key文件 插入数据
        case 'privatePath':
            event.reply('selectFileReply', new Reply(SUCCESS, { type: arg.type, path: filePaths[0] }));
            break;
        // 主页导入项目 git分支查找
        case 'export':
            if (filePaths.length) {
                const projectList = db
                    .read()
                    .get('list')
                    .value()
                    .map((item) => item.path);
                // 判断当前路径是否已接入
                if (!projectList.includes(filePaths[0])) {
                    const selectPath = filePaths[0];
                    const gitDirPath = path__default["default"].join(selectPath, '/.git/HEAD');
                    const existGitDir = fs__default["default"].existsSync(gitDirPath);
                    const projectName = path__default["default"].basename(selectPath);
                    let data, filterObject = [], branches = [], currentBranch = '';
                    if (existGitDir) {
                        // 获取当前项目下的所有分支
                        branches = await git__default["default"].listBranches({ fs: fs__default["default"], dir: selectPath });
                        // 获取当前项目下的当前分支
                        currentBranch = await git__default["default"].currentBranch({
                            fs: fs__default["default"],
                            dir: selectPath,
                            fullname: false
                        });
                    }
                    // 判断当前是否存在.key文件
                    const file = existFile(filePaths[0], /(\.key)$/);
                    data = {
                        projectName,
                        name: projectName,
                        path: filePaths[0],
                        branches,
                        currentBranch,
                        appid: '',
                        outputPath: '',
                        privatePath: file ? file : '',
                        robot: 1,
                        qrcodePath: '',
                        done: false,
                        expireTime: '',
                        pagePath: '',
                        searchQuery: '',
                        scene: '',
                        threads: 4,
                        setting: {},
                        desc: '',
                        version: ''
                    };
                    // 判断当前的项目是什么类型的项目 uni-app/原生/taro
                    // 有pages.json 就说明是uni-app项目
                    if (existFile(selectPath, 'pages.json')) {
                        const includesArray = [undefined, undefined];
                        filterObject = [];
                        const existManifest = fs__default["default"].existsSync(path__default["default"].join(selectPath, 'manifest.json'));
                        // 有manifest.json说明是hbuilder生成的 没有则说明是uni-cli生成的
                        // 这两种情况下打包出来的文件夹略有不同
                        includesArray.forEach((item, index) => {
                            filterObject.push({
                                ...data,
                                outputPath: path__default["default"].join(selectPath, `${existManifest ? '/unpackage' : ''}/dist/${index === 0 ? 'dev' : 'build'}/mp-weixin`),
                                projectName: `${index === 0 ? 'dev' : 'prod'}: ${data.projectName}`
                            });
                        });
                        // 有app.json说明是原生小程序项目
                    }
                    else if (fs__default["default"].existsSync(path__default["default"].join(selectPath, 'app.json'))) {
                        data.outputPath = filePaths[0];
                        filterObject = data;
                    }
                    console.log(filterObject);
                    // 插入数据
                    if (Array.isArray(filterObject)) {
                        for (const project of filterObject) {
                            // @ts-ignore
                            db.read().get('list').insert(project).write();
                        }
                    }
                    else {
                        // @ts-ignore
                        db.read().get('list').insert(filterObject).write();
                    }
                    event.reply('selectFolderReply', new Reply(SUCCESS, { message: '添加成功', data: filterObject }));
                }
                else {
                    event.reply('selectFolderReply', new Reply(FAIL, { message: '当前项目已存在' }));
                }
            }
            break;
        // 导入项目配置路径
        case 'outputPath':
            event.reply('selectFolderReply', new Reply(SUCCESS, { type: arg.type, path: filePaths[0] }));
    }
}

async function excuteCommon(event, arg) {
    const { type, params = {} } = arg;
    switch (type) {
        // 项目信息刷新 更新当前git的HEAD分支和分支列表
        case 'refresh':
            console.log('进行刷新操作');
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
                    // @ts-ignore
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
                    // @ts-ignore
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
 * @LastEditTime: 2022-01-25 17:38:53
 * @FilePath: /electron-mp-ci/src/main/excute.ts
 */
// 逻辑处理层
function excute() {
    // 打开文件/文件夹
    electron.ipcMain.on('select', (event, arg) => {
        console.log(event, arg);
        electron.dialog
            .showOpenDialog({
            title: '选择文件',
            buttonLabel: '选择',
            properties: ['openFile'],
            ...arg.params
        })
            .then(async (fileObject) => executeSelectFile(event, arg, fileObject));
    });
    // 微信小程序CI操作
    electron.ipcMain.on('miniProgram', (event, arg) => createMiniProgramCI(event, arg));
    // git 操作
    electron.ipcMain.handle('gitOperate', (event, arg) => executeGit(event, arg));
    // 公共操作
    electron.ipcMain.handle('commonOperate', (event, arg) => excuteCommon(event, arg));
}

/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 17:18:19
 * @FilePath: /electron-mp-ci/src/main/index.ts
 */
// import { PKG } from './constrant'
electronRemote__default["default"].initialize();
excute();
electron.protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {
            standard: true,
            supportFetchAPI: true,
            secure: true,
            corsEnabled: true
        }
    }
]);
if (!electron.app.isPackaged) {
    try {
        require('electron-reloader')(module, {
            ignore: require('path').resolve(__dirname, '../db/db.json')
        });
    }
    catch (_) {
        console.log(_);
    }
}
let tray;
function createWindow() {
    electron.protocol.registerBufferProtocol('app', (request, response) => {
        let pathName = new URL(request.url).pathname;
        let extension = path__default["default"].extname(pathName).toLowerCase();
        if (!extension)
            return;
        pathName = decodeURI(pathName);
        let filePath = path__default["default"].join(__dirname, pathName);
        fs__default["default"].readFile(filePath, (error, data) => {
            if (error)
                return;
            let mimeType = '';
            if (extension === '.js') {
                mimeType = 'text/javascript';
            }
            else if (extension === '.html') {
                mimeType = 'text/html';
            }
            else if (extension === '.css') {
                mimeType = 'text/css';
            }
            else if (extension === '.svg') {
                mimeType = 'image/svg+xml';
            }
            else if (extension === '.json') {
                mimeType = 'application/json';
            }
            response({ mimeType, data });
        });
    });
    // 创建浏览器窗口
    const mainWindow = new electron.BrowserWindow({
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
    });
    // const loadURL =
    //   process.env.NODE_ENV === 'development'
    //     ? `http://localhost:3000` // 开发模式的话走webpack-dev-server的url
    //     : `file://${__dirname}/index.html`
    if (electron.app.isPackaged) {
        mainWindow.loadURL(`app://./index.html`);
    }
    else {
        mainWindow.loadURL(`http://localhost:3000/`);
    }
    // 加载 index.html
    // mainWindow.loadFile('index.html') // 此处跟electron官网路径不同，需要注意
    // mainWindow.loadURL(loadURL)
    // 打开开发工具
    mainWindow.webContents.openDevTools();
    // remote组件初始化
    electronRemote__default["default"].enable(mainWindow.webContents);
    // 聚焦
    mainWindow.on('focus', () => {
        console.log('聚焦');
    });
    return mainWindow;
}
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
electron.app.whenReady().then(() => {
    const window = createWindow();
    // 增加顶部应用图标
    const icon = electron.nativeImage.createFromPath(path__default["default"].join(process.cwd(), process.platform === 'win32' ? '/resource/tray_win@3x.png' : '/resource/tray_mac@3x.png'));
    tray = new electron.Tray(icon);
    if (process.platform === 'darwin' || process.platform === 'win32') {
        tray.on('right-click', () => {
            const contextMenu = electron.Menu.buildFromTemplate([
                {
                    label: '关于',
                    click() {
                        electron.dialog.showMessageBox({
                            title: 'MpHelper',
                            message: '微信小程序辅助工具',
                            detail: `Version: 1.0.0\nAuthor: ShuHongXie\nGithub: https://github.com/ShuHongXie`
                        });
                    }
                },
                {
                    label: '退出',
                    click: (menuItem, browserWindow, event) => {
                        electron.app.quit();
                    }
                }
            ]);
            tray.popUpContextMenu(contextMenu);
            tray.on('click', () => {
                console.log('点击了');
                window.show();
            });
        });
    }
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
// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
//# sourceMappingURL=entry.js.map
