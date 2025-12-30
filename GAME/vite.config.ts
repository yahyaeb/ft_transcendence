import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5174,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/localhost+1-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/localhost+1.pem'))
    }
  }
})