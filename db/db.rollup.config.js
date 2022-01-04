const path = require('path')
console.log(__dirname)

export default {
  input: path.resolve(__dirname, './db.js'),
  output: {
    file: path.resolve(__dirname, './db-cjs.js'),
    format: 'cjs'
  },
  watch: {
    include: './db.js'
  }
}
