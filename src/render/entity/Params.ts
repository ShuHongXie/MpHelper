/*
 * @Author: 谢树宏
 * @Date: 2022-01-13 15:23:00
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-17 16:53:11
 * @FilePath: /electron-mp-ci/src/entity/Params.ts
 */
export interface Form {
  version: string
  desc?: string
}

export interface GitFileChangeObject {
  index: number
  value: boolean
  type: string
}
