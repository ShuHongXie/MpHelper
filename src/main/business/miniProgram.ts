import { IpcMainEvent } from 'electron'
// @ts-ignore
import ci, { MiniProgramCI } from 'miniprogram-ci'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import db from '../db'
import Response from '../utils/response'
import { SUCCESS, FAIL } from '../constrant'
import { getExpireTime } from '../utils/tool'

let showIndex: number, ciInstance: any

// CI实例创建
export default function createMiniProgramCI(event: IpcMainEvent, arg: any) {
  showIndex = 0
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
async function upload(event: IpcMainEvent, params: any) {
  console.log('start upload...')
  try {
    const uploadResult = await ci.upload({
      project: ciInstance,
      version: params.version,
      desc: params.desc,
      setting: {
        es6: true,
        es7: true,
        autoPrefixWXSS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minifyJS: true,
        minify: true
      },
      onProgressUpdate: (res: MiniProgramCI.ITaskStatus) => {
        if (res._msg !== 'upload') {
          // 使用showIndex值来防止主进程和渲染进程频繁进行无意义的通信
          !showIndex &&
            event.reply(
              'uploadReply',
              new Response(SUCCESS, { message: `正在上传中`, index: params.index, done: false })
            )
          showIndex++
        } else if (res._msg === 'upload' && res._status === 'done') {
          showIndex = 0
          event.reply(
            'uploadReply',
            new Response(SUCCESS, {
              message: '',
              done: true
            })
          )
        }
      }
    })
    console.log(uploadResult)
  } catch (e: any) {
    showIndex = 0
    // 格式化错误捕获信息
    if (e.message.includes('Error')) {
      const error = JSON.parse(
        e.message.substring(e.message.indexOf('{'), e.message.lastIndexOf('}') + 1)
      )
      event.reply(
        'uploadReply',
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
async function preview(event: IpcMainEvent, params: any) {
  const uuid = uuidv4()
  const qrcodeOutputDest = path.resolve(__dirname, `../../image/${uuid}.png`)
  console.log('触发预览')
  try {
    const previewResult = await ci.preview({
      project: ciInstance,
      desc: params.desc, // 此备注将显示在“小程序助手”开发版列表中
      setting: {
        es6: true,
        es7: true,
        autoPrefixWXSS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minifyJS: true,
        minify: true
      },
      robot: params.robot,
      qrcodeFormat: 'image',
      qrcodeOutputDest,
      pagePath: params.pagePath,
      searchQuery: params.searchQuery,
      scene: params.scene,
      version: '',
      onProgressUpdate: (res: MiniProgramCI.ITaskStatus) => {
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
          // @ts-ignore
          db.read()
            .get('list')
            // @ts-ignore
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
  } catch (e: any) {
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
