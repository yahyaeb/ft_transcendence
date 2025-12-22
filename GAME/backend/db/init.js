// db/init.js
import { db } from './database.js'
import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // represnent current file path as URL
//from file://home/yaya....js => /home/yaya/project/db/database.js
const __dirname = path.dirname(__filename) // gives us the absolute path of the directory
// => /home/yaya/project/db/

const schemaPath = path.join(__dirname, 'schema.sql') // => /home/yaya/project/db/schema.sql
const schema = readFileSync(schemaPath, 'utf8')

await db.exec(schema)
console.log('Database initialized')
process.exit(0)
