class Response {
  constructor(status, data = null) {
    this.status = status
    this.data = data
  }

  get setData() {
    return this.data
  }

  set getData(value) {
    this.data = value
  }

  get getStatus() {
    return this.status
  }

  set setStatus(value) {
    this.status = value
  }
}

module.exports = Response
