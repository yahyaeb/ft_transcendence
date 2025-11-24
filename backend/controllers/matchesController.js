import { db } from '../db/database.js'

export async function startMatch(req, reply) {

	const player1_id = Number(req.user.id)
    const { player2_id, mode} = req.body || {}

    if(mode !== "bot" && mode !== "classic")
        return reply.code(400).send({ error: 'Invalid mode' })
    if (player2_id == null )
        return reply.code(400).send({ error: 'Invalid Xplayer id' })
    const p2 = Number(player2_id)
	if(Number.isNaN(player1_id) || Number.isNaN(p2)){
		return reply.code(400).send({ error: "Invalid X3player id"})
	}
	if (mode === "classic" && player1_id === p2)
	{
		return reply.code(400).send({ error: "Cannot start a classic match against yourself"})
	}
	try {
        const valid1_id = await db.get(
        "SELECT id FROM users WHERE id = ?",
        [player1_id]
        )
        const valid2_id = await db.get(
            "SELECT id FROM users WHERE id = ?",
            [p2]
        )
        if(!valid1_id || !valid2_id)
            return reply.code(400).send({ error: 'Invalid player id' })
        const startedMatch = await db.run(
            "INSERT INTO matches (player1_id, player2_id, mode) VALUES (?, ?, ?)",
            [player1_id, p2, mode]
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

export async function updateMatchStatus(req, reply) {

	const matchId = Number(req.params.id)
    const userId = Number(req.user.id)
    const { status } = req.body || {}
    const allowedStatus = ["pending", "ongoing", "finished"]

    if(!status)
        return reply.code(400).send({error: "Status is required"})
    if (!allowedStatus.includes(status))
        return reply.code(400).send({ error: "Invalid status value" })

	const currentStatus = await db.get(
    "SELECT id, player1_id, player2_id, status FROM matches WHERE id = ?",
    [matchId]
    )
	if(!currentStatus || Number.isNaN(matchId)){
		return reply.code(404).send({ error: "Match not found" })
	}
	if(currentStatus.player1_id !== userId && currentStatus.player2_id !== userId){
		return reply.code(403).send({ error: "Forbidden"})
	}

    if (currentStatus.status === "finished")
        return reply.code(400).send({ error: "Game has already ended" })
    
	await db.run(
    "UPDATE matches SET status = ? WHERE id = ?",
    [status, matchId]
    )
    return reply.code(200).send({
        message: "Status updated",
        id: matchId,
        status
    })
}

export async function finishedMatch(req, reply){
    const { id } = req.params
    const {winner_id, score_p1, score_p2} = req.body

    const match = await db.get(
        "SELECT player1_id, player2_id FROM matches where id = ?",
        [id]
    )
    if (score_p1 < 0 || score_p2 < 0) {
    return reply.code(400).send({ error: "Scores must be >= 0" })
    }

    if(!match)
        return reply.code(404).send({ error: "Match not found" })
    if(winner_id !== match.player1_id && winner_id !== match.player2_id)
        return reply.code(400).send({ error: "Winner ID does not match player"})
    
    await db.run(
        "UPDATE matches SET winner_id = ?, score_p1 = ?, score_p2 = ?, status = 'finished' WHERE id = ?",
        [winner_id, score_p1, score_p2, id]
    )

    return reply.code(200).send({
        message: "Match finished",
        id,
        winner_id,
        score_p1,
        score_p2
    })
}