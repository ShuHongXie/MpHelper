/*
 * @Author: 谢树宏
 * @Date: 2022-01-14 09:56:10
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 16:52:46
 * @FilePath: /electron-mp-ci/src/main/business/common.ts
 */
import { IpcMainInvokeEvent } from 'electron'
import path from 'path'
import fs from 'fs'
import git from 'isomorphic-git'
import db from '../db'
import Response from '../utils/response'
import { SUCCESS, FAIL } from '../constrant'

async function excuteCommon(event: IpcMainInvokeEvent, arg: any) {
  const { type, params = {} } = arg
  switch (type) {
    // 项目信息刷新 更新当前git的HEAD分支和分支列表
    case 'refresh':
      console.log('进行刷新操作')
      const gitDirPath = path.join(params.path, '/.git/HEAD')
      const existGitDir = fs.existsSync(gitDirPath)
      if (existGitDir) {
        // 获取当前项目下的所有分支
        const branches = await git.listBranches({ fs, dir: params.path })
        // 获取当前项目下的当前分支
        const currentBranch = await git.currentBranch({
          fs,
          dir: params.path,
          fullname: false
        })
        // 插入数据
        db.read()
          .get('list')
          // @ts-ignore
          .find({ id: params.id })
          .assign({
            branches,
            currentBranch
          })
          .write()
      } else {
        // 插入数据
        db.read()
          .get('list')
          // @ts-ignore
          .find({ id: params.id })
          .assign({
            branches: '',
            currentBranch: []
          })
          .write()
      }
      return new Response(SUCCESS, {
        // 返回值往往带有其他信息 这里用正则去掉
        message: '刷新成功'
      })
      break
  }
}

export default excuteCommon
