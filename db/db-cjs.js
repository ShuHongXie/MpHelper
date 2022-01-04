'use strict';

var Low = require('lowdb');
var LodashId = require('lodash-id');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Low__default = /*#__PURE__*/_interopDefaultLegacy(Low);
var LodashId__default = /*#__PURE__*/_interopDefaultLegacy(LodashId);

const FileSync = require('lowdb/adapters/FileSync');
require('path');

const adapter = new FileSync('./db.json');
const db = Low__default["default"](adapter);
db._.mixin(LodashId__default["default"]);

if (!db.has('list').value()) {
  db.set('list', []).write();
}

module.exports = db;
