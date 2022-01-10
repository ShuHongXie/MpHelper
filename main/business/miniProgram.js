const { ipcMain } = require('electron')
const ci = require('miniprogram-ci')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const db = require('../../db/db-cjs')
const Response = require('../utils/response')
const { SUCCESS } = require('../constrant.js')
const { getExpireTime } = require('../utils/tool')
console.log(getExpireTime)

// 实例创建
function createMiniProgramCI(event, arg) {
  console.log(arg)
  ciInstance = new ci.Project({
    appid: arg.appid,
    type: 'miniProgram',
    projectPath: arg.outputPath,
    privateKeyPath: arg.privatePath,
    ignores: ['node_modules/**/*']
  })

  preview(event, arg)
}

async function preview(event, arg) {
  const uuid = uuidv4()
  const qrcodeOutputDest = path.resolve(__dirname, `../../image/${uuid}.png`)
  try {
    const previewResult = await ci.preview({
      project: ciInstance,
      desc: 'hello', // 此备注将显示在“小程序助手”开发版列表中
      setting: {
        es6: true,
        minify: true
      },
      robot: arg.robot,
      qrcodeFormat: 'image',
      qrcodeOutputDest,
      onProgressUpdate: (res) => {
        console.log(res)
        if (res._msg !== 'upload') {
          event.reply(
            'previewReply',
            new Response(SUCCESS, { message: `正在编译中`, index: arg.index, done: false })
          )
        } else if (res._msg === 'upload' && res._status === 'done') {
          const expireTime = getExpireTime(25)
          event.reply(
            'previewReply',
            new Response(SUCCESS, {
              message: '',
              index: arg.index,
              done: true,
              path: `/image/${uuid}.png`,
              fullPath: qrcodeOutputDest,
              expireTime
            })
          )

          db.read()
            .get('list')
            .find({ id: arg.id })
            .assign({
              qrcodePath: `/image/${uuid}.png`,
              fullQrcodePath: qrcodeOutputDest,
              expireTime
            })
            .write()
        }
      }
      // pagePath: 'pages/index/index', // 预览页面
      // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
    })

    console.log(previewResult)
  } catch (e) {}
}

module.exports = createMiniProgramCI
