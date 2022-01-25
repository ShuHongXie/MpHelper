/*
 * @Author: 谢树宏
 * @Date: 2022-01-25 17:18:26
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 17:18:27
 * @FilePath: /electron-mp-ci/src/main/entity/git.ts
 */
export type StroageData = {
  path?: string
  status?: string
  checked?: boolean
}

export type Filename = string
export type HeadStatus = 0 | 1
export type WorkdirStatus = 0 | 1 | 2
export type StageStatus = 0 | 1 | 2 | 3

export type StatusRow = [Filename, HeadStatus, WorkdirStatus, StageStatus]

export type StatusMatrix = StatusRow[]
