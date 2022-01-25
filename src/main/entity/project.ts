/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 17:08:18
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 17:16:09
 * @FilePath: /electron-mp-ci/src/main/entity/project.ts
 */
export enum ProjectSettingKey {
  ES6 = 'es6',
  ES7 = 'es7',
  MINIFY_JS = 'minifyJS',
  MINIFY_WXML = 'minifyWXML',
  MINIFY_CSS = 'minifyCSS',
  MINIFY = 'minify',
  CODE_PROJECT = 'code_project',
  AUTO_PREFIX_WXSS = 'autoPrefixWXSS'
}

export interface ProjectSetting {
  [key: string]: boolean
}

export interface Project {
  projectName?: string
  name?: string
  path?: string
  branches?: string[]
  currentBranch?: string
  appid?: string
  outputPath?: string
  privatePath?: string
  robot?: number
  qrcodePath?: string
  done?: boolean
  expireTime?: string
  pagePath?: string
  searchQuery?: string
  scene?: string
  threads?: number
  setting?: ProjectSetting
  desc?: string
  version?: string
}
