const path = require('path')

module.exports = [
  {
    input: path.resolve(__dirname, './db.js'),
    output: {
      file: path.resolve(__dirname, './db-cjs.js'),
      format: 'cjs'
    }
  }
]
