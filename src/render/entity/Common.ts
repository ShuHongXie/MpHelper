/*
 * @Author: 谢树宏
 * @Date: 2022-01-17 11:56:11
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-17 16:46:03
 * @FilePath: /electron-mp-ci/src/entity/Common.ts
 */

export interface FileStatus {
  path?: string
  status?: string
  checked?: boolean
}

export interface FileStatusObject {
  unstagedData?: FileStatus[]
  stagedData?: FileStatus[]
}
