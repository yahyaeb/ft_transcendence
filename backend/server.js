// server.js  (ESM version)
import fastifyFactory from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { usersRoutes } from './routes/users.js'
import { authRoutes } from './routes/auth.js'



const fastify = fastifyFactory({logger: true })
const PORT = 4999



// API documentation: http://localhost:4999/docs/
fastify.register(swagger, {
  openapi: {
    info: { title: 'Fastify API', version: '1.0.0' }
  }
})

fastify.register(swaggerUI, {
  routePrefix: '/docs'
})
fastify.register(usersRoutes, { prefix: '/users' })
fastify.register(authRoutes, { prefix: '/auth'})

const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: '0.0.0.0'
    })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
