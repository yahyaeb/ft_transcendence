// server.js  (ESM version)
import fastifyFactory from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
// import { db } from './database.js'


const fastify = fastifyFactory({logger: true })
const PORT = 4999

const database = await open({
      filename: './database.db',
      driver: sqlite3.Database  
})
console.log("DB READY!")

const users = await database.all("SELECT * FROM users;")

fastify.get('/users', (req, reply) => {
	reply.send({users})
})

fastify.get('/users/:id', async (req, reply) => {
  const {id } = req.params
  const user = await database.get("Select * FROM users WHERE id = ?", [id])

  if(!user){
    return reply.code(404).send({error: 'User not found'})
  }
  return user
})

// fastify.get('/items', (req, reply) => {
// 	reply.send({status: 'ok'})
// })
fastify.register(swagger, {
  openapi: {
    info: { title: 'Fastify API', version: '1.0.0' }
  }
})

fastify.register(swaggerUI, {
  routePrefix: '/docs'
})

// fastify.get('/items', (req, reply) => {
// 	reply.send({status: 'ok'})
// })

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
