/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:35:28
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-26 09:32:35
 * @FilePath: /electron-mp-ci/src/main/db.ts
 */
// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
const { app } = require('electron')
import Low from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
console.log(process.type)

// @ts-ignore
const LodashId = require('lodash-id')
// 获取db.json兼容
const adapter = new FileSync(
  path.resolve(
    process.type === 'renderer'
      ? require('@electron/remote').app.getPath('userData')
      : app.getPath('userData'),
    'db.json'
  )
)
const db = Low(adapter)
// @ts-ignore
db._.mixin(LodashId)
// @ts-ignore
if (!db.has('list').value()) {
  // @ts-ignore
  db.set('list', []).write()
}
// 设置默认值
export default db
