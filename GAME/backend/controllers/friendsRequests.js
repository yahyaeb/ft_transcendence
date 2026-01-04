import { db } from '../db/database.js'

export async function showFriends(req, reply) {
    const me = Number(req.user.id);
    const now = Date.now();
    const ONLINE_MS = 30000;

    const friends = await db.all(
        `SELECT u.id, u.username, u.last_seen_at,
                CASE
                WHEN u.last_seen_at IS NOT NULL AND (? - u.last_seen_at) <= ?
                THEN 1 ELSE 0
                END AS online
        FROM friendships f
        JOIN users u ON u.id = f.friend_id
        WHERE f.user_id = ?
        ORDER BY online DESC, u.last_seen_at DESC, u.username`,
        [now, ONLINE_MS, me]
    );

    return reply.code(200).send(friends);
}


export async function addFriend(req, reply) {
    const me = Number(req.user.id);
    const other = Number(req.body?.userId);

    if (!Number.isInteger(other))
        return reply.code(400).send({ error: "userId must be an integer" });
    if (other === me)
        return reply.code(400).send({ error: "You cannot add yourself" });

    const exists = await db.get("SELECT 1 FROM users WHERE id = ?", [other]);
    if (!exists) {
    console.log("User not found:", other);
    return reply.code(404).send({ error: "User not found" });
    }


    const blockedByThem = await db.get(
        "SELECT 1 FROM blocks WHERE blocker_id = ? AND blocked_id = ?",
        [other, me]
    );
    if (blockedByThem) {
        return reply.code(403).send({ error: "This user has blocked you" });
    }

    await db.run(
        "DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?",
        [me, other]
    );


    const already = await db.get(
        "SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ?",
        [me, other]
    );
    if (already)
        return reply.code(409).send({ error: "Already friends" });


    await db.run(
        "INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)",
        [me, other]);
    await db.run(
        "INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)",
        [other, me]);

    return reply.code(201).send({ message: "Friend added" });
}


export async function blockUser(req, reply) {
    const me = Number(req.user.id);
    const other = Number(req.body?.userId);
    if (!Number.isInteger(other))
        return reply.code(400).send({ error: "userId must be an integer" });

    if (me === other)
        return reply.code(400).send({ error: "Cannot block yourself" });
    await db.run(
        "INSERT OR IGNORE INTO blocks (blocker_id, blocked_id) VALUES (?, ?)",
        [me, other]
    );

    await db.run(
        "DELETE FROM friendships WHERE user_id = ? AND friend_id = ?",
        [me, other]);
    await db.run(
        "DELETE FROM friendships WHERE user_id = ? AND friend_id = ?",
        [other, me]);

    return reply.code(200).send({ message: "User blocked" });
}


export async function unblockUser(req, reply) {
  const me = Number(req.user.id);
  const other = Number(req.body?.userId);

  if (!Number.isInteger(other))
    return reply.code(400).send({ error: "userId must be an integer" });

  if (me === other)
    return reply.code(400).send({ error: "Cannot unblock yourself" });

  const res = await db.run(
    "DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?",
    [me, other]
  );

  if (res.changes === 0) {
    return reply.code(200).send({ message: "User was not blocked" });
  }

  return reply.code(200).send({ message: "User unblocked" });
}
