import { db } from '../db/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticator  } from 'otplib'
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
  const { email, password, code } = req.body || {}

  if (!email || !password) {
    return reply.code(400).send({ error: 'Email and password are required' })
  }

  try {
    const user = await db.get(
      `SELECT id, username, email, password, avatar,
              two_factor_enabled, two_factor_secret
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

    if (user.two_factor_enabled) {
      if (!code) {
        return reply.code(401).send({ error: '2FA code required' })
      }

      const isValidCode = authenticator.check(code, user.two_factor_secret)
      if (!isValidCode) {
        return reply.code(401).send({ error: 'Invalid 2FA code' })
      }
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


export async function enableTwoFactor(req, reply){
  const userId = req.user.id
  const secret = authenticator.generateSecret();
  const padded = secret.padEnd(secret.length + (8 - secret.length % 8) % 8, "=")


  await db.run(
    'UPDATE users SET two_factor_secret = ?, two_factor_enabled = 0 WHERE id = ?',
    [padded, userId]
  )

  const optauthURL = authenticator.keyuri(
    req.user.username,
    'Ft_Transcendence',
    padded
  )
  return reply.code(200).send({
    message: '2FA secret generated',
    padded,
    optauthURL
  })

}

export async function verifyTwoFactorSetup(req, reply){
  const userId = req.user.id
  const { code } = req.body || {}
  if(!code){
    return reply.code(400).send({ error: 'Code is required'})
  }

  const user = await db.get(
    'SELECT two_factor_secret FROM users WHERE id = ?',
    [userId]
  )

  if(!user || !user.two_factor_secret){
      return reply.code(400).send({ error: '2FA is not initialized for this user'})
  }

  const isValid = authenticator.check(code, user.two_factor_secret)

  if (!isValid){
    return reply.code(401).send({ error: 'Invalid 2FA code' })
  }

  await db.run(
    'UPDATE users SET two_factor_enabled = 1 WHERE id = ?',
    [userId]
  )
  
  return reply.code(200).send({ message: '2FA enabled successfully'})
}
