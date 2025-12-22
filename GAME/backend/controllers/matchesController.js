import { db } from '../db/database.js'

export async function startMatch(req, reply) {
    const player1_id = Number(req.user.id);
    const { mode, guest_name } = req.body || {};

    if (!["pvp", "pve", "tournament"].includes(mode)) {
        return reply.code(400).send({ error: "Invalid mode" });
    }
    let p2, player2_name;

    if (mode === "pve") {
        p2 = 9999;
        player2_name = "Bot";
    } else {
        p2 = 9998;
        player2_name = (guest_name && guest_name.trim()) || "Guest";
    }
    if (Number.isNaN(player1_id)) {
        return reply.code(400).send({ error: "Invalid player1_id" });
    }

    try {
        const valid1 = await db.get(
            "SELECT id FROM users WHERE id = ?",
            [player1_id]
        );
        if (!valid1) {
            return reply.code(400).send({ error: "Invalid player1_id" });
        }

        const startedMatch = await db.run(
            "INSERT INTO matches (player1_id, player2_id, player2_name, mode, status) VALUES (?, ?, ?, ?, 'active')",
            [player1_id, p2, player2_name, mode]
        );

        return reply.code(201).send({
            message: "Match started",
            id: startedMatch?.lastID
        });
    } catch (err) {
        console.error("DB Error:", err);
        return reply.code(500).send({ error: "Internal Server Error" });
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
    const userId = Number(req.user.id)
	if(match.player1_id !== userId && match.player2_id !== userId){
		return reply.code(403).send({ error: "Forbidden" })
	}
    return reply.code(200).send(match)
}

export async function getMatches(req, reply) {

    const matches = await db.all(
        "SELECT * FROM matches WHERE player1_id = ? OR player2_id = ?",
    [req.user.id, req.user.id]
	);
    if (matches.length === 0) {
        return reply.code(200).send({matches})
    }

    return reply.code(200).send(matches)
}

export async function updateMatchStatus(req, reply) {

	const matchId = Number(req.params.id);
    
    const userId = Number(req.user.id)
    const { status } = req.body || {}
    const allowedStatus = ["pending", "ongoing", "finished", "cancelled"]

    if(!status)
        return reply.code(400).send({error: "Status is required"})
    if (!allowedStatus.includes(status))
        return reply.code(400).send({ error: "Invalid status value" })
    if (Number.isNaN(matchId)) 
        return reply.code(400).send({ error: "Invalid match id" });
    
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
    const {score_p1, score_p2} = req.body
	const userId = Number(req.user.id)

    const match = await db.get(
        "SELECT player1_id, player2_id FROM matches where id = ?",
        [id]
    )
    if (score_p1 < 0 || score_p2 < 0) {
    return reply.code(400).send({ error: "Scores must be >= 0" })
    }

    if(!match)
        return reply.code(404).send({ error: "Match not found" })
    if(userId !== match.player1_id && userId !== match.player2_id)
        return reply.code(403).send({ error: "Forbidden"})
	let winner_id = null    
    if (score_p1 > score_p2) winner_id = match.player1_id;
    else if (score_p2 > score_p1) winner_id = match.player2_id;
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