// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
const electron = require('electron')
import Low from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
import LodashId from 'lodash-id'
// 获取db.json兼容
const adapter = new FileSync(
  path.resolve(
    process.type === 'renderer'
      ? require('@electron/remote').app.getAppPath()
      : electron.app.getAppPath(),
    '../db/db.json'
  )
)
const db = Low(adapter)
db._.mixin(LodashId)

if (!db.has('list').value()) {
  db.set('list', []).write()
}
// 设置默认值
export default db
