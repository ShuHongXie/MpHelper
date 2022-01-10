const path = require('path')
const { v4: uuidv4 } = require('uuid')
const git = require('isomorphic-git')
const db = require('../../db/db-cjs')
const Response = require('../utils/response')
const { SUCCESS, FAIL } = require('../constrant.js')

// 执行选择文件逻辑
async function executeGit(event, arg) {
  switch (arg.type) {
    case 'checkout':
      break
  }
}

module.exports = executeGit
