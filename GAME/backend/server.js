// server.js  (ESM version)
import fastifyFactory from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { usersRoutes } from './routes/users.js'
import { authRoutes } from './routes/auth.js'
import { matchesRoutes } from './routes/matches.js'
import { friendsRoute } from './routes/friendships.js'
import fastifyStatic from "@fastify/static";
import path from "path";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors";
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fastifyCookie from '@fastify/cookie';
// <<<<<<< HEAD

// const fastify = fastifyFactory({logger: true })
// =======
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fastify = fastifyFactory({
  logger: true,
  https: {
    key: readFileSync(join(__dirname, 'certs', 'localhost+1-key.pem')),
    cert: readFileSync(join(__dirname, 'certs', 'localhost+1.pem'))
  }
})
// >>>>>>> origin/Game_v2
const PORT = 4999


await fastify.register(cors,{
  origin: ["https://localhost:5173", "https://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
})

fastify.register(multipart);

fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
});


// API documentation: https://localhost:4999/docs/
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

fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET,
});

fastify.register(usersRoutes, { prefix: '/users' })
fastify.register(authRoutes, { prefix: '/auth'})
fastify.register(matchesRoutes, { prefix: '/matches'})
fastify.register(friendsRoute, { prefix: '/friends'})

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
