import { Low, JSONFile } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { chain } from 'lodash'
const __dirname = dirname(fileURLToPath(import.meta.url))

interface Adapter<T> {
  read: () => Promise<T | null>
  write: (data: T) => Promise<void>
}
export declare class LowDB<T = unknown> {
  adapter: Adapter<T>
  data: T | null
  constructor(adapter: Adapter<T>)
  read(): Promise<void>
  write(): Promise<void>
  chain(): T
}

type Data = {
  data: string[] // Expect posts to be an array of strings
}
console.log(join(__dirname, 'db.json'))

const adapter = new JSONFile<Data>(join(__dirname, 'db.json'))
const db = new Low<Data>(adapter) as LowDB
db.chain = chain(db.data) as any

export default db
