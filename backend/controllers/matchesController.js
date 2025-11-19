import { db } from '../db/database.js'

export async function startMatch(req, reply) {
    const { player1_id , player2_id, mode} = req.body || {}

    if(mode !== "bot" && mode !== "classic")
        return reply.code(400).send({ error: 'Invalid mode' })
    if ( player1_id == null || player2_id == null )
        return reply.code(400).send({ error: 'Invalid player id' })
    try {
        const valid1_id = await db.get(
        "SELECT id FROM users WHERE id = ?",
        [player1_id]
        )
        const valid2_id = await db.get(
            "SELECT id FROM users WHERE id = ?",
            [player2_id]
        )
        if(!valid1_id || !valid2_id)
            return reply.code(400).send({ error: 'Invalid player id' })
        const startedMatch = await db.run(
            "INSERT INTO matches (player1_id, player2_id, mode) VALUES (?, ?, ?)",
            [player1_id, player2_id, mode]
        )
        return reply.code(201).send({
            message: 'Match started',
            id: startedMatch?.lastID
        })
    }
    catch (error)
    {
        console.error("DB Error:", error)
        return reply.code(500).send({ error: "Internal Server Error" })
    }
} 

export async function getMatch(req, reply) {
    const { id } = req.params

    const match = await db.get(
        "SELECT * FROM matches WHERE id = ?", [id]
    );

    if(!match)
    {
        return reply.code(404).send({error: 'Match not found'})
    }
    return reply.code(200).send(match)
}

export async function getMatches(req, reply) {

    const matches = await db.all(
        "SELECT * FROM matches"
    );
    if (matches.length === 0) {
        return reply.code(404).send({ error: 'No available matches' })
    }
    return reply.code(200).send(matches)
}