import Low from 'lowdb'
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
import LodashId from 'lodash-id'

const adapter = new FileSync('./db.json')
const db = Low(adapter)
db._.mixin(LodashId)

if (!db.has('list').value()) {
  db.set('list', []).write()
}
// 设置默认值
export default db
