/*
 * @Author: 谢树宏
 * @Date: 2022-01-24 15:18:45
 * @LastEditors: 谢树宏
 * @LastEditTime: 2022-01-25 16:03:24
 * @FilePath: /electron-mp-ci/src/main/utils/response.ts
 */
/**
 *
 * 统一返回结果集
 * @export
 * @class Reply
 */
export default class Reply {
  status: string
  data: any
  constructor(status: string, data = {}) {
    this.status = status
    this.data = data
  }

  get setData() {
    return this.data
  }

  set getData(value: any) {
    this.data = value
  }

  get getStatus() {
    return this.status
  }

  set setStatus(value: string) {
    this.status = value
  }
}
