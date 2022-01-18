/*
 * @Author: 谢树宏
 * @Date: 2022-01-18 17:06:15
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-18 17:54:45
 * @FilePath: /electron-mp-ci/test.js
 */
const { exec } = require('shelljs')

const namePromise = new Promise((resolve, reject) => {
  var child = exec('git config user.name', { async: true })
  child.stdout.on('data', function (data) {
    /* ... do something with data ... */
    resolve(data.toString())
  })
  child.stderr.on('data', (data) => {
    reject('error')
  })
})

const emailPromise = new Promise((resolve, reject) => {
  var child = exec('git config user.email', { async: true })
  child.stdout.on('data', function (data) {
    /* ... do something with data ... */
    resolve(data.toString())
  })
  child.stderr.on('data', (data) => {
    reject('error')
  })
})

Promise.all([undefined, emailPromise]).then(
  (res) => {
    console.log(res)
  },
  (rej) => {
    console.log(rej)
  }
)
