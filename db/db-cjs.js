'use strict'

var Low = require('lowdb')
var LodashId = require('lodash-id')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var Low__default = /*#__PURE__*/ _interopDefaultLegacy(Low)
var LodashId__default = /*#__PURE__*/ _interopDefaultLegacy(LodashId)

const electron = require('electron')
// const remote = require('@electron/remote/main').enable(electron.webContents)
const electronRemote = process.type === 'renderer' ? require('@electron/remote') : electron
// const electronRemote = require('@electron/remote')
console.log(electronRemote, process.type)
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
// 获取db.json兼容
const adapter = new FileSync(
  path.resolve(
    process.type === 'renderer' ? electronRemote.app.getAppPath() : electron.app.getAppPath(),
    '../db/db.json'
  )
)
const db = Low__default['default'](adapter)
db._.mixin(LodashId__default['default'])

if (!db.has('list').value()) {
  db.set('list', []).write()
}
// export default function ss() {}

module.exports = db
