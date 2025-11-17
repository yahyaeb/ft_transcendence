
// controllers/usersController.js

import { db } from '../db/database.js'

export async function getAllUsersController(req, reply){
    const users = await db.all("SELECT * FROM users;");
    reply.send({users})
}

export async function getSingleUserController(req, reply){
    const {id } = req.params
    const user = await db.get("Select * FROM users WHERE id = ?", [id]);

    if(!user){
        return reply.code(404).send({error: 'User not found'})
    }
    return user
}


export async function postSingleUserController(req, reply) {
    const { username, password } = req.body || {}

    if(!username || !password){
        return reply.code(404).send({error: 'Username and password are required'})
    }
    try
    {   
        const result = await db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password]
        );
    } catch (error)
    {
        console.error("DB Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
    }
}
