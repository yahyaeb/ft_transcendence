import { db } from '../db/database.js'
import bcrypt from 'bcrypt'

export async function signupController(req, reply) {
    const { username, password, avatar } = req.body || {}

    // validate input
    if (!username || !password) {
        return reply.code(400).send({ error: 'Username and password are required' })
    }
    // check for dups
    const existing = await db.get(
        "SELECT id FROM users WHERE username = ?",
        [username]
    )
    if (existing) {
        return reply.code(409).send({ error: 'Username already taken' })
    }

    try {
        // password hashing
        const hashed = await bcrypt.hash(password, 10)

        // single INSERT with optional avatar
        const result = await db.run(
            "INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)",
            [username, hashed, avatar || null]
        )

        // respond with created user (no password)
        return reply.code(201).send({
            message: 'User created',
            id: result?.lastID,
            username,
            avatar: avatar || null
        })

    } catch (error) {
        console.error("DB Error:", error)
        return reply.code(500).send({ error: "Internal Server Error" })
    }
}
