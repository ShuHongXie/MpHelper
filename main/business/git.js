/*
 * @Author: 谢树宏
 * @Date: 2022-01-17 09:16:57
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-17 11:55:43
 * @FilePath: /electron-mp-ci/main/business/git.js
 */
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const git = require('isomorphic-git')
const db = require('../../db/db-cjs')
const Response = require('../utils/response')
const { SUCCESS, FAIL } = require('../constrant.js')
const fs = require('fs')

// 执行Git相关操作
async function executeGit(event, { type, params = {} }) {
  switch (type) {
    // 分支切换
    case 'checkout':
      const data = await await git.checkout({
        fs,
        dir: params.path,
        ref: params.currentBranch
      })
      console.log(data)
      break
    // Git状态
    case 'status':
      console.log(params)
      let matrixData = await git.statusMatrix({
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
      const unstagedData = []
      const stagedData = []
      normalData.forEach((item) => {
        const path = item[0]
        item = item.slice(1, 4).join('')
        switch (item) {
          case '020':
            unstagedData.push({
              path,
              status: 'new-untracked'
            })
            break
          case '022':
            stagedData.push({
              path,
              status: 'added-staged'
            })
            break
          case '023':
            unstagedData.push({
              path,
              status: 'new-untracked'
            })
            stagedData.push({
              path,
              status: 'modified-unstaged'
            })
            break
          case '122':
            unstagedData.push({
              path,
              status: 'modified-unstaged'
            })
            break
          case '121':
            stagedData.push({
              path,
              status: 'modified-staged'
            })
            break
          case '123':
            unstagedData.push({
              path,
              status: 'modified-unstaged'
            })
            stagedData.push({
              path,
              status: 'modified-staged'
            })
            break
          case '101':
            unstagedData.push({
              path,
              status: 'deleted-unstaged'
            })
            break
          case '100':
            stagedData.push({
              path,
              status: 'deleted-staged'
            })
            break
        }
      })
      console.log(stagedData, unstagedData)
      event.reply(
        'gitStatusReply',
        new Response(SUCCESS, {
          data: {
            stagedData,
            unstagedData
          }
        })
      )
      break
  }
}

module.exports = executeGit
