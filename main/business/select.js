const path = require('path')
const fs = require('fs')
const git = require('isomorphic-git')
const Response = require('../utils/response')
const { SUCCESS } = require('../constrant.js')

// 执行选择文件逻辑
async function executeSelectFile(event, arg, fileObject) {
  const { canceled, filePaths } = fileObject
  switch (arg.type) {
    // 选择key文件 插入数据
    case 'privatePath':
      event.reply('selectFileReply', new Response(SUCCESS, { type: arg.type, path: filePaths[0] }))
      break
    // 主页导入项目 git分支查找
    case 'export':
      if (filePaths.length) {
        const gitDirPath = path.join(filePaths[0], '/.git/HEAD')
        const existGitDir = fs.existsSync(gitDirPath)
        const projectName = path.basename(filePaths[0])
        if (existGitDir) {
          // 获取当前项目下的所有分支
          const branches = await git.listBranches({ fs, dir: filePaths[0] })
          // 获取当前项目下的当前分支
          const currentBranch = await git.currentBranch({
            fs,
            dir: filePaths[0],
            fullname: false
          })
          // 插入数据
          db.get('list')
            .insert({
              projectName: projectName,
              name: projectName,
              path: filePaths[0],
              branches,
              currentBranch,
              appid: '',
              outputPath: '',
              privatePath: '',
              robot: 1,
              done: false
            })
            .write()
        }
        event.reply('selectFolderReply', new Response(SUCCESS, { message: '添加成功' }))
      }
      break
    // 导入项目配置路径
    case 'outputPath':
      event.reply(
        'selectFolderReply',
        new Response(SUCCESS, { type: arg.type, path: filePaths[0] })
      )
  }
}

module.exports = executeSelectFile
