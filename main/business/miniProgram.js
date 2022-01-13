const ci = require('miniprogram-ci')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const db = require('../../db/db-cjs')
const Response = require('../utils/response')
const { SUCCESS, FAIL } = require('../constrant.js')
const { getExpireTime } = require('../utils/tool')
console.log(getExpireTime)

// CI实例创建
function createMiniProgramCI(event, arg) {
  console.log(arg)
  const { type, params = {} } = arg
  ciInstance = new ci.Project({
    appid: params.appid,
    type: 'miniProgram',
    projectPath: params.outputPath,
    privateKeyPath: params.privatePath,
    ignores: ['node_modules/**/*']
  })
  switch (type) {
    case 'preview':
      preview(event, params)
      break
    case 'upload':
      upload(event, params)
      break
  }
}
// 上传
async function upload(event, params) {
  console.log('开始上传')
  try {
    const uploadResult = await ci.upload({
      project: ciInstance,
      version: params.version,
      desc: params.desc,
      setting: {
        minify: true,
        es6: true,
        es7: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: (res) => {
        console.log(res)
      }
    })
    console.log(uploadResult)
  } catch (e) {
    // 格式化错误捕获信息
    if (e.message.includes('Error')) {
      const error = JSON.parse(
        e.message.substring(e.message.indexOf('{'), e.message.lastIndexOf('}') + 1)
      )
      event.reply(
        'previewReply',
        new Response(FAIL, {
          // 返回值往往带有其他信息 这里用正则去掉
          message: error.errMsg.replace(/(\,\sreference).*/, ''),
          index: params.index
        })
      )
    }
  }
}
// 预览
async function preview(event, params) {
  const uuid = uuidv4()
  const qrcodeOutputDest = path.resolve(__dirname, `../../image/${uuid}.png`)
  console.log('触发预览')
  try {
    const previewResult = await ci.preview({
      project: ciInstance,
      desc: params.desc, // 此备注将显示在“小程序助手”开发版列表中
      setting: {
        minify: true,
        es6: true,
        es7: true,
        autoPrefixWXSS: true
      },
      robot: params.robot,
      qrcodeFormat: 'image',
      qrcodeOutputDest,
      pagePath: params.pagePath,
      searchQuery: params.searchQuery,
      scene: params.scene,
      onProgressUpdate: (res) => {
        console.log(res)
        if (res._msg !== 'upload') {
          event.reply(
            'previewReply',
            new Response(SUCCESS, { message: `正在编译中`, index: params.index, done: false })
          )
        } else if (res._msg === 'upload' && res._status === 'done') {
          const expireTime = getExpireTime(25)
          event.reply(
            'previewReply',
            new Response(SUCCESS, {
              message: '',
              index: params.index,
              done: true,
              path: `/image/${uuid}.png`,
              fullPath: qrcodeOutputDest,
              expireTime
            })
          )

          db.read()
            .get('list')
            .find({ id: params.id })
            .assign({
              qrcodePath: `/image/${uuid}.png`,
              fullQrcodePath: qrcodeOutputDest,
              expireTime
            })
            .write()
        }
      }
    })

    console.log(previewResult)
  } catch (e) {
    // 格式化错误捕获信息
    if (e.message.includes('Error')) {
      const error = JSON.parse(
        e.message.substring(e.message.indexOf('{'), e.message.lastIndexOf('}') + 1)
      )
      event.reply(
        'previewReply',
        new Response(FAIL, {
          // 返回值往往带有其他信息 这里用正则去掉
          message: error.errMsg.replace(/(\,\sreference).*/, ''),
          index: params.index
        })
      )
    }
  }
}

module.exports = createMiniProgramCI