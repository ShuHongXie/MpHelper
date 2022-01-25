/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:35:28
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:46:11
 * @FilePath: /electron-mp-ci/src/main/db.ts
 */
// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
import { app } from 'electron'
import Low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
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
db._.mixin(LodashId)

if (!db.has('list').value()) {
  db.set('list', []).write()
}
// 设置默认值
export default db
