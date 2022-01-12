const path = require('path')
const { v4: uuidv4 } = require('uuid')
const git = require('isomorphic-git')
const db = require('../../db/db-cjs')
const Response = require('../utils/response')
const { SUCCESS, FAIL } = require('../constrant.js')
const fs = require('fs')

// 执行选择文件逻辑
async function executeGit(event, { type, params = {} }) {
  switch (type) {
    case 'checkout':
      const FILE = 0,
        HEAD = 1,
        WORKDIR = 2,
        STAGE = 3

      // const filenames = (await git.statusMatrix({ dir: params.path, fs }))
      //   .filter((row) => row[WORKDIR] !== row[STAGE])
      //   .map((row) => row[FILE])

      // const filenames1 = (await git.statusMatrix({ dir: params.path, fs }))
      //   .filter((row) => row[HEAD] !== row[WORKDIR])
      //   .map((row) => row[FILE])
      // console.log(filenames, filenames1)
      let status = await git.statusMatrix({
        fs,
        dir: params.path
      })
      console.log(status)
      // const data = await await git.checkout({
      //   fs,
      //   dir: params.path,
      //   ref: params.currentBranch
      // })
      // console.log(data)
      break
  }
}

module.exports = executeGit
