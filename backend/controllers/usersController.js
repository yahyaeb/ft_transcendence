
// controllers/usersController.js

import { db } from '../db/database.js'

export async function getAllUsersController(req, reply){
    // const users = await db.all("SELECT * FROM users;");
    const users = await db.all("Select id, username FROM users;");
    return users
}

export async function getSingleUserController(req, reply){
    const {id } = req.params
    // const user = await db.get("Select * FROM users WHERE id = ?", [id]);
    const user = await db.get("Select id, username FROM users WHERE id = ?", [id]);

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
    try {   
        const result = await db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password]
        );

        console.log("Inserted user:", {
            username,
            lastID: result?.lastID,
            changes: result?.changes
        });

        return reply
            .code(201)
            .send({
                message: 'User created',
                id: result?.lastID,
                username,
         });

    } catch (error)
    {
        console.error("DB Error:", error);
        return reply.code(500).send({ error: "Internal Server Error" });
    }
}
