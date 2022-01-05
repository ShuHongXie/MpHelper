'use strict';

var Low = require('lowdb');
var LodashId = require('lodash-id');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Low__default = /*#__PURE__*/_interopDefaultLegacy(Low);
var LodashId__default = /*#__PURE__*/_interopDefaultLegacy(LodashId);

// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
const electron = require('electron');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
// 获取db.json兼容
const adapter = new FileSync(
  path.resolve(
    process.type === 'renderer'
      ? require('@electron/remote').app.getAppPath()
      : electron.app.getAppPath(),
    '../db/db.json'
  )
);
const db = Low__default["default"](adapter);
db._.mixin(LodashId__default["default"]);

if (!db.has('list').value()) {
  db.set('list', []).write();
}

module.exports = db;
