
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
