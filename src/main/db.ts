/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:35:28
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-26 11:47:51
 * @FilePath: /electron-mp-ci/src/main/db.ts
 */
// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
const { app } = require('electron')
import Low from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
console.log(
  process.type === 'renderer'
    ? require('@electron/remote').app.getPath('userData')
    : app.getPath('userData')
)

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
// @ts-ignore
const db: Low.LowdbSync<Low.AdapterSync> = Low(adapter)
db._.mixin(LodashId)
if (!db.has('list').value()) {
  db.set('list', []).write()
}
// 设置默认值
export default db
