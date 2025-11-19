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

export async function loginController(req, reply) {
    const { username, password } = req.body || {}
    
    if (!username || !password)
    {
        return reply.code(401).send({ error: "Unauthorized"})
    }

    const validUsername = await db.get(
        "SELECT username FROM users where username = ?;",
        [req.body.username]
    )
    if(!validUsername)
    {
        return reply.code(401).send({ error: "Unauthorized: Invalid username or password"})
    }

    try
    {
        const hashedPassword = await db.get("SELECT password FROM users where username = ?;",
        [username])

        const ok = await bcrypt.compare(password, hashedPassword.password)
        
        if(ok)
        {
            return reply.code(201).send({
            message: 'Succesful login!'
            })
        }
        else
        {
            return reply.code(401).send({ error: "Unauthorized: Invalid username or password"})
        }
    }
    catch (error)
    {
        console.error("DB Error:", error)
        return reply.code(500).send({ error: "Internal Server Error" })
    }
}