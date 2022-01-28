/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 15:18:44
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-28 14:06:04
 * @FilePath: /electron-mp-ci/src/main/constrant.ts
 */
// 控制应用生命周期和创建原生浏览器窗口的模组
import { app } from 'electron'
const pkg = require(app.isPackaged ? './package.json' : '../../package.json')

// 成功标识
export const SUCCESS = 'success'
// 失败标识
export const FAIL = 'fail'

export const PKG = pkg
