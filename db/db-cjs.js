'use strict';

var Low = require('lowdb');
var LodashId = require('lodash-id');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Low__default = /*#__PURE__*/_interopDefaultLegacy(Low);
var LodashId__default = /*#__PURE__*/_interopDefaultLegacy(LodashId);

/*
 * @Author: 谢树宏
 * @Date: 2022-01-05 14:49:05
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:57:37
 * @FilePath: /electron-mp-ci/db/db.js
 */
// 兼容lowdb在不同环境下的用法  @electron/remote必须在主进程先初始化
const electron = require('electron');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
console.log(123);
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
console.log(db);

if (!db.has('list').value()) {
  db.set('list', []).write();
}

module.exports = db;
