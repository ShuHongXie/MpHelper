/*
 * @Author: 谢树宏
 * @Date: 2022-01-17 09:16:57
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 17:18:35
 * @FilePath: /electron-mp-ci/src/main/business/git.ts
 */
import { IpcMainInvokeEvent } from 'electron'
import { ChildProcess } from 'child_process'
import fs from 'fs'
import git from 'isomorphic-git'
import Response from '../utils/response'
import { SUCCESS, FAIL } from '../constrant'
import { exec } from 'shelljs'
import { StroageData, StatusRow, StatusMatrix } from '../entity/git'

// 执行Git相关操作
export default async function executeGit(
  event: IpcMainInvokeEvent,
  { type = '', params = {} }: { type: string; params: any }
): Promise<Response | undefined> {
  switch (type) {
    // 分支切换
    case 'checkout':
      try {
        await git.checkout({
          fs,
          dir: params.path,
          ref: params.currentBranch
        })
        return new Response(SUCCESS, {
          message: '切换成功'
        })
      } catch (e) {
        return new Response(FAIL, {
          message: e
        })
      }
      break
    // Git状态
    case 'status':
      console.log(params)
      let matrixData: StatusMatrix = await git.statusMatrix({
        fs,
        dir: params.path
      })
      console.log(matrixData)
      // 获取所有改动过的 或者未追踪的文件
      const normalData = matrixData.filter(
        (item) => item[1] !== 1 || item[2] !== 1 || item[3] !== 1
      )
      console.log(normalData)
      // example StatusMatrix
      /**
          [
            ["a.txt", 0, 2, 0], // new, untracked
            ["b.txt", 0, 2, 2], // added, staged
            ["c.txt", 0, 2, 3], // added, staged, with unstaged changes
            ["d.txt", 1, 1, 1], // unmodified
            ["e.txt", 1, 2, 1], // modified, unstaged
            ["f.txt", 1, 2, 2], // modified, staged
            ["g.txt", 1, 2, 3], // modified, staged, with unstaged changes
            ["h.txt", 1, 0, 1], // deleted, unstaged
            ["i.txt", 1, 0, 0], // deleted, staged
          ]
         */
      // 筛选在暂存区的 和没有在暂存区的数据
      // 数据格式 { path: 文件路径, status: example StatusMatrix中的状态用横杠连接 }
      const unstagedData: StroageData[] = []
      const stagedData: StroageData[] = []
      normalData.forEach((item: StatusRow) => {
        const path = item[0]
        const statusStr = item.slice(1, 4).join('')
        switch (statusStr) {
          case '020':
            unstagedData.push({
              path,
              status: 'new-untracked',
              checked: false
            })
            break
          case '022':
            stagedData.push({
              path,
              status: 'added-staged',
              checked: true
            })
            break
          case '023':
            unstagedData.push({
              path,
              status: 'modified-unstaged',
              checked: false
            })
            stagedData.push({
              path,
              status: 'new-untracked',
              checked: true
            })
            break
          case '121':
            unstagedData.push({
              path,
              status: 'modified-unstaged',
              checked: false
            })
            break
          case '122':
            stagedData.push({
              path,
              status: 'modified-staged',
              checked: true
            })
            break
          case '123':
            unstagedData.push({
              path,
              status: 'modified-unstaged',
              checked: false
            })
            stagedData.push({
              path,
              status: 'modified-staged',
              checked: true
            })
            break
          case '101':
            unstagedData.push({
              path,
              status: 'deleted-unstaged',
              checked: false
            })
            break
          case '100':
            stagedData.push({
              path,
              status: 'deleted-staged',
              checked: true
            })
            break
          case '003':
            stagedData.push({
              path,
              status: 'added-staged',
              checked: true
            })
            unstagedData.push({
              path,
              status: 'deleted',
              checked: false
            })
            break
        }
      })
      console.log(stagedData, unstagedData)
      return new Response(SUCCESS, {
        stagedData,
        unstagedData
      })
      break
    // 从暂存区撤销回工作区
    case 'reset':
      console.log(params)
      try {
        for (const item of Array.isArray(params?.list) ? params?.list : [params?.list]) {
          await git.resetIndex({ fs, dir: params.project.path, filepath: item.path })
        }
        return executeGit(event, {
          type: 'status',
          params: params.project
        })
      } catch (e) {
        console.log(e)
      }
      break
    // 从工作区加入暂存区
    case 'add':
      console.log(params)
      try {
        for (const item of Array.isArray(params?.list) ? params?.list : [params?.list]) {
          if (item.status.includes('delete')) {
            await git.remove({ fs, dir: params.project.path, filepath: item.path })
          } else {
            await git.add({ fs, dir: params.project.path, filepath: item.path })
          }
        }
        return executeGit(event, {
          type: 'status',
          params: params.project
        })
      } catch (e) {
        console.log(e)
      }
      break
    // 从暂存区加入版本库
    case 'commit':
      let userName,
        userEmail,
        uerNameRequest,
        uerEmailRequest,
        promiseArray = []
      const configName = await git.getConfigAll({
        fs,
        dir: params.project.path,
        path: 'user.name'
      })
      console.log(configName)
      userName = configName.length ? configName[0] : ''
      const configEmail = await git.getConfigAll({
        fs,
        dir: params.project.path,
        path: 'user.email'
      })
      userName = configEmail.length ? configName[0] : ''
      // 由于isomorphic-git只能访问当前.git文件夹下的配置
      // 没办法只能通过自己执行shell捕获
      if (!userName) {
        uerNameRequest = new Promise((resolve, reject) => {
          const process = exec('git config user.name', { async: true }) as ChildProcess
          if (process) {
            // @ts-ignore
            process.stdout.on('data', function (data) {
              data = data.replace(/\n/g, '')
              resolve(data)
            })
            // @ts-ignore
            process.stderr.on('data', (data) => {
              reject(data)
            })
          }
        })
        promiseArray.push(uerNameRequest)
      } else {
        promiseArray.push(undefined)
      }
      if (!userEmail) {
        uerEmailRequest = new Promise((resolve, reject) => {
          const process = exec('git config user.email', { async: true })
          // @ts-ignore
          process.stdout.on('data', function (data) {
            data = data.replace(/\n/g, '')
            resolve(data)
          })
          // @ts-ignore
          process.stderr.on('data', (data) => {
            reject('error')
          })
        })
        promiseArray.push(uerEmailRequest)
      } else {
        promiseArray.push(undefined)
      }
      // 如果有用户名 就可以直接提交
      if (promiseArray[0]) {
        try {
          const data = await Promise.all(promiseArray)
          userName = data[0]
          userEmail = data[1] || ''
          await git.commit({
            fs,
            dir: params.project.path,
            message: params.desc,
            author: {
              name: userName,
              email: userEmail
            }
          })
          executeGit(event, {
            type: 'status',
            params: params.project
          })
          return new Response(SUCCESS, {
            message: '提交成功'
          })
        } catch (e) {
          return new Response(FAIL, {
            message: e
          })
        }
      } else {
        return new Response(FAIL, {
          message: '请配置您的git用户名和邮箱地址，可以通过全局配置或项目配置'
        })
      }
      break
  }
}
