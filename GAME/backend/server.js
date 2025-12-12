// server.js  (ESM version)
import fastifyFactory from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { usersRoutes } from './routes/users.js'
import { authRoutes } from './routes/auth.js'
import { matchesRoutes } from './routes/matches.js'
import cors from "@fastify/cors";


const fastify = fastifyFactory({logger: true })
const PORT = 4999


await fastify.register(cors,{
  origin: ["http://localhost:5173"],
  credentials: true
})


// API documentation: http://localhost:4999/docs/
fastify.register(swagger, {
  openapi: {
    info: { title: 'Fastify API', version: '1.0.0' }
  }
})

fastify.register(swaggerUI, {
  routePrefix: '/docs'
})
fastify.get('/healthz', async(req, reply) =>{
  return { status: "ok"}
})
fastify.register(usersRoutes, { prefix: '/users' })
fastify.register(authRoutes, { prefix: '/auth'})
fastify.register(matchesRoutes, { prefix: '/matches'})

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
