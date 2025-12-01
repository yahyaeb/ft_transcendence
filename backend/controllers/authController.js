import { db } from '../db/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config' //importing the secret .env


export async function signupController(req, reply) {
  const { username, email, password, avatar } = req.body || {}

  console.log('SIGNUP body:', req.body)

  if (!username || !email || !password) {
    return reply.code(400).send({
      error: 'Username, email and password are required'
    })
  }

  try {
    const existing = await db.get(
      `SELECT id, username, email
       FROM users
       WHERE username = ? OR email = ?`,
      [username, email]
    )

    if (existing) {
      if (existing.username === username) {
        return reply.code(409).send({ error: 'Username already taken' })
      }
      if (existing.email === email) {
        return reply.code(409).send({ error: 'Email already in use' })
      }
    }

    const hashed = await bcrypt.hash(password, 10)

    const result = await db.run(
      `INSERT INTO users (username, email, password, avatar)
       VALUES (?, ?, ?, ?)`,
      [username, email, hashed, avatar || null]
    )

    return reply.code(201).send({
      message: 'User created',
      id: result.lastID,
      username,
      email,
      avatar: avatar || null
    })
  } catch (error) {
    console.error('DB Error in /signup:', error)

    if (error.code === 'SQLITE_CONSTRAINT') {
      return reply.code(409).send({
        error: 'Username or email already in use'
      })
    }

    return reply.code(500).send({ error: 'Internal Server Error' })
  }
}

export async function loginController(req, reply) {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return reply.code(400).send({ error: 'Email and password are required' })
  }

  try {
    const user = await db.get(
      `SELECT id, username, email, password, avatar
       FROM users
       WHERE email = ?`,
      [email]
    )

    if (!user) {
      return reply.code(401).send({ error: 'Unauthorized: Invalid email or password' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return reply.code(401).send({ error: 'Unauthorized: Invalid email or password' })
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    return reply.code(200).send({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('DB Error in /login:', error)
    return reply.code(500).send({ error: 'Internal Server Error' })
  }
}