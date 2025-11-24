
// controllers/usersController.js

import { db } from '../db/database.js'

export async function getAllUsersController(req, reply){
    // const users = await db.all("SELECT * FROM users;");
    const users = await db.all("Select id, username, avatar FROM users order by id;");
    return users
}

export async function getSingleUserController(req, reply){
    const {id } = req.params
    // const user = await db.get("Select * FROM users WHERE id = ?", [id]);
    const user = await db.get("Select id, username, avatar FROM users WHERE id = ?", [id]);

    if(!user){
        return reply.code(404).send({error: 'User not found'})
    }
    return user
}

export async function updateAvatar(req, reply){
    const {id} = req.params
    const {avatar} = req.body || {}

    if(!avatar) {
        return reply.code(400).send({error: "Avatar is required"})
    }

	if(Number(id) !== Number(req.user.id)){
		return reply.code(403).send({ error: 'Forbidden' })
	}

    const user = await db.get(
        "SELECT id from users where id = ? ",
        [id]
    )
    if(!user)
    {
        return reply.code(404).send({error: "User not found"})
    }
    const avatarUpdate = await db.run(
        "UPDATE users SET avatar = ? WHERE id = ?;",
        [avatar, id]
    )
    return reply.code(200).send({
        message: "Avatar updated",
        id,
        avatar
    })
}

export async function getMeProfile(req, reply){
    const userId = req.user.id

    const user = await db.get(
        "SELECT id, username, avatar, created_at FROM users WHERE id = ?",
        [userId]
    )

    if(!user){
        return reply.code(404).send({ error: "User not found" })
    }

    return reply.code(200).send(user)
}
