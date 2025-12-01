
// controllers/usersController.js

import { db } from '../db/database.js'
import bcrypt from 'bcrypt'

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
    const id = req.user.id
    const {avatar} = req.body || {}

    if(!avatar) {
        return reply.code(400).send({error: "Avatar is required"})
    }

	if(typeof avatar !== 'string') {
        return reply.code(400).send({error: "Path is not a valid string"})
    }
    const user = await db.get(
        "SELECT id from users where id = ? ",
        [id]
    )
    if(!user){
        return reply.code(404).send({error: "User not found"})
    }
    await db.run(
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


export async function updatePassword(req, reply){

    const userId = req.user.id
    const {oldpwd, newpwd, secnewpwd} = req.body || {}

    if(!oldpwd || !newpwd || !secnewpwd) {
        return reply.code(400).send({error: "All password fields are required!"})
    }

    if(newpwd !== secnewpwd)
        return reply.code(400).send({ error: 'New passwords do not match' })

    if(newpwd.length < 8)
        return reply.code(400).send({ error: 'New password must be at least 8 characters long' })

    const user = await db.get(
        "SELECT id, password FROM users WHERE id = ?;",
        [userId]
    )

    const oldOk = await bcrypt.compare(oldpwd, user.password)
    if (!oldOk) {
        return reply.code(401).send({ error: 'Current password is incorrect' })
    }

    const sameAsOld = await bcrypt.compare(newpwd, user.password)
    if (sameAsOld) {
        return reply.code(400).send({ error: 'New password must be different from the old password' })
    }

    const hashed = await bcrypt.hash(newpwd, 10)

    await db.run(
        "UPDATE users SET password = ? WHERE id = ?;",
        [hashed, userId]
        )

    return reply.code(200).send({
        message: 'Password updated successfully'
    })

}