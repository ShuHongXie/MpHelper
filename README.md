<!--
 * @Author: 谢树宏
 * @Date: 2022-01-14 17:39:57
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-29 17:14:51
 * @FilePath: /electron-mp-ci/README.md
-->
<div align="center">
  <img src="https://raw.githubusercontent.com/wiki/ShuHongXie/MpHelper/mp_helper.png" alt="">
  <h1>MpHelper</h1>
  <blockquote>微信小程序的项目管理工具，适配支持uni-app, 小程序原生</blockquote>
  <a href="https://github.com/ShuHongXie/MpHelper/actions">
    <img src="https://img.shields.io/badge/code%20style-standard-green.svg?style=flat-square" alt="">
  </a>
  <a href="https://github.com/ShuHongXie/MpHelper/actions">
    <img src="https://github.com/ShuHongXie/MpHelper/workflows/Build/badge.svg" alt="">
  </a>
  <a href="https://github.com/ShuHongXie/MpHelper/releases">
    <img src="https://img.shields.io/github/downloads/ShuHongXie/MpHelper/total.svg?style=flat-square" alt="">
  </a>
  <a href="https://github.com/ShuHongXie/MpHelper/releases/latest">
    <img src="https://img.shields.io/github/release/ShuHongXie/MpHelper.svg?style=flat-square" alt="">
  </a>
</div>

## 使用前端

本地项目必须绑定 ip

## 为什么要写这个项目

1. **源起于万表微信小程序多任务, 多需求并行开发产生的痛点。万表的小程序项目普遍较大型，当多任务并行时，测试同事对于测试版的需求预览，上传都要进行一次构建。且账号主体只能有一个，这就带来了版本覆盖问题，同小程序下，前一个版本会覆盖后一个版本，本工具旨在辅助解决这种问题。利用微信小程序的 CI 机器人库，使用机器人来发布，上传小程序。**
2. **原生小程序开发者工具附带功能太多，多开时很容易卡顿，并且项目时常要进入退出，十分不好管理，该工具能更直观地管理小程序。**

## 特色功能

- 支持微信小程序的预览，上传，版本号/备注填写
- 支持预览图片的粘贴复制，放大
- 自动识别 uni-app 项目，动态适配，分割 dev 和 prod 环境的包，
- 当私钥(\*\*\*\*.key)文件存在项目时，会自动查找，不需要手动引入
- 支持 git-status，git-commit，git-checkout 功能，不需要输入命令行
