import { Low, JSONFile } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { chain } from 'lodash'

console.log(join(__dirname, 'db.json'))

const adapter = new JSONFile(join(__dirname, 'db.json'))
const db = new Low(adapter)
db.chain = chain(db.data)

export default db
