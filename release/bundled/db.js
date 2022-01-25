'use strict';

var electron = require('electron');
var Low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Low__default = /*#__PURE__*/_interopDefaultLegacy(Low);
var FileSync__default = /*#__PURE__*/_interopDefaultLegacy(FileSync);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 10:35:28
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 11:46:11
 * @FilePath: /electron-mp-ci/src/main/db.ts
 */
// @ts-ignore
const LodashId = require('lodash-id');
// 获取db.json兼容
const adapter = new FileSync__default["default"](path__default["default"].resolve(process.type === 'renderer'
    ? require('@electron/remote').app.getPath('userData')
    : electron.app.getPath('userData'), 'db.json'));
const db = Low__default["default"](adapter);
db._.mixin(LodashId);
if (!db.has('list').value()) {
    db.set('list', []).write();
}

module.exports = db;
