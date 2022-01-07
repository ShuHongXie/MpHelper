const path = require('path')
const fs = require('fs')
const ci = require('miniprogram-ci')
const git = require('isomorphic-git')
const Response = require('../utils/response')
const { SUCCESS, FAIL } = require('../constrant.js')

function executeSelectFile(event, arg, fileObject) {
  switch (arg.type) {
    // 选择key文件 插入数据
    case 'privatePath':
      db.get('list').find({ id: arg.id }).assign({ privatePath: fileObject.filePaths[0] }).write()
      event.reply('selectFileReply', new Response(SUCCESS, { message: '添加成功' }))
      break
  }
}

module.exports = executeSelectFile
