const ci = require('miniprogram-ci')
const path = require('path')

function createMiniProgramCI(arg) {
  console.log(arg)
  ciInstance = new ci.Project({
    appid: arg.appid,
    type: 'miniProgram',
    projectPath: arg.outputPath,
    privateKeyPath: arg.privatePath,
    ignores: ['node_modules/**/*']
  })

  preview(arg)
}

async function preview(arg) {
  await ci.preview({
    project: ciInstance,
    desc: 'hello', // 此备注将显示在“小程序助手”开发版列表中
    setting: {
      es6: true,
      minify: true
    },
    robot: arg.robot,
    qrcodeFormat: 'image',
    qrcodeOutputDest: path.resolve(__dirname, '../../image/'),
    onProgressUpdate: (z1, z2) => {
      console.log(z1, z2)
    }
    // pagePath: 'pages/index/index', // 预览页面
    // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
  })
}

module.exports = createMiniProgramCI
