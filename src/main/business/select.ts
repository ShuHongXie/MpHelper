/*
 * @Author: 谢树宏
 * @Date: 2022-01-10 09:32:59
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-27 11:27:56
 * @FilePath: /electron-mp-ci/src/main/business/select.ts
 */
import { IpcMainEvent } from 'electron'
import path from 'path'
import fs from 'fs'
import git from 'isomorphic-git'
import db from '../db'
import Response from '../utils/response'
import { SUCCESS, FAIL } from '../constrant'
import { existFile } from '../utils/tool'
import { Project } from '../entity/project'

// 执行选择文件逻辑
export default async function executeSelectFile(event: IpcMainEvent, arg: any, fileObject: any) {
  const { canceled, filePaths } = fileObject
  switch (arg.type) {
    // 选择key文件 插入数据
    case 'privatePath':
      event.reply('selectFileReply', new Response(SUCCESS, { type: arg.type, path: filePaths[0] }))
      break
    // 主页导入项目 git分支查找
    case 'export':
      if (filePaths.length) {
        const projectList = db
          .read()
          .get('list')
          .value()
          .map((item: Project) => item.path)
        // 判断当前路径是否已接入
        if (!projectList.includes(filePaths[0])) {
          const selectPath = filePaths[0]
          const gitDirPath = path.join(selectPath, '/.git/HEAD')
          const existGitDir = fs.existsSync(gitDirPath)
          const projectName = path.basename(selectPath)
          let data: Project,
            filterObject: Project[] | Project = [],
            branches = [],
            keyPath = '',
            currentBranch = ''
          if (existGitDir) {
            // 获取当前项目下的所有分支
            branches = await git.listBranches({ fs, dir: selectPath })
            // 获取当前项目下的当前分支
            currentBranch = await git.currentBranch({
              fs,
              dir: selectPath,
              fullname: false
            })
          }
          // 判断当前是否存在.key文件
          const file = existFile(filePaths[0], /(\.key)$/)
          data = {
            projectName,
            name: projectName,
            path: filePaths[0],
            branches,
            currentBranch,
            appid: '',
            outputPath: '',
            privatePath: file ? file : '',
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
          // 判断当前的项目是什么类型的项目 uni-app/原生/taro
          // 有pages.json 就说明是uni-app项目
          if (existFile(selectPath, 'pages.json')) {
            const includesArray = [undefined, undefined]
            filterObject = []
            const existManifest = fs.existsSync(path.join(selectPath, 'manifest.json'))
            // 有manifest.json说明是hbuilder生成的 没有则说明是uni-cli生成的
            // 这两种情况下打包出来的文件夹略有不同
            includesArray.forEach((item, index) => {
              ;(filterObject as Project[]).push({
                ...data,
                outputPath: path.join(
                  selectPath,
                  `${existManifest ? '/unpackage' : ''}/dist/${
                    index === 0 ? 'dev' : 'build'
                  }/mp-weixin`
                ),
                projectName: `${index === 0 ? 'dev' : 'prod'}: ${data.projectName}`
              })
            })
            // 有app.json说明是原生小程序项目
          } else if (fs.existsSync(path.join(selectPath, 'app.json'))) {
            data.outputPath = filePaths[0]
            filterObject = data
          }
          console.log(filterObject)

          // 插入数据
          if (Array.isArray(filterObject)) {
            for (const project of filterObject) {
              // @ts-ignore
              db.read().get('list').insert(project).write()
            }
          } else {
            // @ts-ignore
            db.read().get('list').insert(filterObject).write()
          }
          event.reply(
            'selectFolderReply',
            new Response(SUCCESS, { message: '添加成功', data: filterObject })
          )
        } else {
          event.reply('selectFolderReply', new Response(FAIL, { message: '当前项目已存在' }))
        }
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
