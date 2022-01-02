const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { join, dirname } = require('path')
const { chain } = require('lodash')
console.log(join(__dirname, 'db.json'))

const adapter = new FileSync(join(__dirname, 'db.json'))
const db = low(adapter)

module.exports = db
