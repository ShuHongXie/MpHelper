/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-21 11:58:07
 * @FilePath: /electron-mp-ci/main/business/select.js
 */
const path = require('path')
const fs = require('fs')
const git = require('isomorphic-git')
const db = require('../../db/db-cjs.js')
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
        let data
        if (existGitDir) {
          // 获取当前项目下的所有分支
          const branches = await git.listBranches({ fs, dir: filePaths[0] })
          // 获取当前项目下的当前分支
          const currentBranch = await git.currentBranch({
            fs,
            dir: filePaths[0],
            fullname: false
          })
          data = {
            projectName,
            name: projectName,
            path: filePaths[0],
            branches,
            currentBranch,
            appid: '',
            outputPath: '',
            privatePath: '',
            robot: 1,
            qrcodePath: '',
            done: false,
            expireTime: '',
            pagePath: '',
            searchQuery: '',
            scene: '',
            threads: 4,
            setting: {},
            desc: '',
            version: ''
          }
          // 判断当前配置是什么类型的项目
          // 有pages.json 就说明是uni-app项目
          if (fs.existsSync(path.join(gitDirPath, 'pages.json'))) {
            // 有manifest.json说明是hbuilder生成的 没有则说明是uni-cli生成的
            if (fs.existsSync(path.join(gitDirPath, 'manifest.json'))) {
            } else {
            }
            // 有app.json说明是小程序项目
          } else if (fs.existsSync(path.join(gitDirPath, 'app.json'))) {
          }

          // 插入数据
          db.read().get('list').insert(data).write()
        }
        event.reply('selectFolderReply', new Response(SUCCESS, { message: '添加成功', data }))
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
