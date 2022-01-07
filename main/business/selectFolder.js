const path = require('path')
const fs = require('fs')
const ci = require('miniprogram-ci')
const git = require('isomorphic-git')
const Response = require('../utils/response')
const { SUCCESS, FAIL } = require('../constrant.js')

async function executeSelectFoler(event, arg, fileObject) {
  const { filePaths: pathList, canceled } = fileObject
  switch (arg.type) {
    // 主页导入项目 git分支查找
    case 'export':
      if (pathList.length) {
        const gitDirPath = path.join(pathList[0], '/.git/HEAD')
        const existGitDir = fs.existsSync(gitDirPath)
        const projectName = path.basename(pathList[0])
        if (existGitDir) {
          // 获取当前项目下的所有分支
          const branches = await git.listBranches({ fs, dir: pathList[0] })
          // 获取当前项目下的当前分支
          const currentBranch = await git.currentBranch({
            fs,
            dir: pathList[0],
            fullname: false
          })
          // 插入数据
          db.get('list')
            .insert({
              name: projectName,
              path: pathList[0],
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
        event.reply('openFolderReply', new Response(SUCCESS, { message: '添加成功' }))
      }
      break
    // 导入项目配置路径
    case 'outputPath':
      db.get('list').find({ id: arg.id }).assign({ privatePath: fileObject.filePaths[0] }).write()
  }
}

module.exports = executeSelectFoler
