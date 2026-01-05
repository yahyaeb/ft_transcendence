import { db } from '../db/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticator  } from 'otplib'
import 'dotenv/config' //importing the secret .env


export async function signupController(req, reply) {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return reply.code(400).send({ error: "Username, email and password are required" });
  }

  const u = username.trim();
  const e = email.trim();
  const avatar = "/uploads/avatars/user-22.png"
  try {
    const existing = await db.get(
      `SELECT id, username, email
       FROM users
       WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)`,
      [u, e]
    );

    if (existing) {
      if (existing.username?.toLowerCase() === u.toLowerCase()) {
        return reply.code(409).send({ error: "Username already taken" });
      }
      if (existing.email?.toLowerCase() === e.toLowerCase()) {
        return reply.code(409).send({ error: "Email already in use" });
      }
      // fallback (shouldn't happen often)
      return reply.code(409).send({ error: "Username or email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.run(
      `INSERT INTO users (username, email, password, avatar)
       VALUES (?, ?, ?, ?)`,
      [u, e, hashed, avatar || null]
    );

    return reply.code(201).send({
      message: "User created",
      id: result.lastID,
      username: u,
      email: e,
      avatar: avatar || null
    });
  } catch (error) {
    console.error("DB Error in /signup:", error);

    if (error.code === "SQLITE_CONSTRAINT") {
      return reply.code(409).send({ error: "Username or email already in use" });
    }

    return reply.code(500).send({ error: "Internal Server Error" });
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

    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET)
      return reply.code(400).send({error: "JWT_SECRET missing"})

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })

    reply.setCookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: 'localhost',
      maxAge: 60 * 60,
    })

    return reply.code(200).send({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        two_factor_enabled: user.two_factor_enabled ? "enabled" : "disabled"
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
    console.log(code);
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

export async function disable2fa(req, reply){
  const userId = req.user.id
  const { code } = req.body || {}

  try {
    const user = await db.get(
      'SELECT id, two_factor_enabled, two_factor_secret FROM users WHERE id = ?',
      [userId]
    )

    if(!user){
      return reply.code(404).send({error : 'User not found'})
    }

    if(!user.two_factor_enabled){
      return reply.code(400).send({error : '2FA is not enabled for this user'})
    }
    if (!code) {
      return reply.code(400).send({ error: '2FA code required to disable 2FA' })
    }

    const isValid = authenticator.check(code, user.two_factor_secret)
    if (!isValid){
      return reply.code(401).send({ error: 'Invalid 2FA code' })
    }
    await db.run(
      'UPDATE users SET two_factor_enabled = 0, two_factor_secret = NULL WHERE id = ?',
      [userId]
    )
    return reply.code(200).send({ message: '2FA disabled  successfully'})
  } catch (err)
  {
    console.error('Error disabling 2FA:', err)
    return reply.code(500).send({ error: 'Internal Server Error'})
  }
}


export async function checkTwoFA(req, reply) {
  const userId = req.user.id;

  const row = await db.get(
    "SELECT two_factor_enabled FROM users WHERE id = ?",
    [userId]
  );

  const enabled = !!row?.two_factor_enabled;

  return reply.code(200).send({ enabled });
}

export async function logout(req, reply) {
    reply
    .clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    })
    .send({ ok: true });
}