import { Low, JSONFile } from 'lowdb'
import { chain } from 'lodash'

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
const adapter = new JSONFile<Data>('db.json')
const db = new Low<Data>(adapter) as LowDB
db.chain = chain(db.data) as any

export default db
