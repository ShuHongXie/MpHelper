const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { join, dirname } = require('path')
const { chain } = require('lodash')
const LodashId = require('lodash-id')
console.log(join(__dirname, 'db.json'))

const adapter = new FileSync(join(__dirname, 'db.json'))
const db = low(adapter)
console.log(db._)
db._.mixin(LodashId)

if (!db.has('list').value()) {
  db.set('list', []).write()
}
// 设置默认值
module.exports = db
