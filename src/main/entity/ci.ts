/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 17:41:56
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 18:07:00
 * @FilePath: /electron-mp-ci/src/main/entity/ci.ts
 */

export interface IProject {
  appid: string
  type: string
  projectPath: string
  privateKey: string
  attr(): Promise<any>
  stat(prefix: string, filePath: string): any | undefined
  // getFile(prefix: string, filePath: string): Promise<Buffer>
  getFileList(prefix: string, extName: string): string[]
  updateFiles: () => void
  [key: string]: any
}

export interface ProgressUpadateEntity {
  _msg?: string
  _status?: string
}
