
// controllers/usersController.js

import { db } from '../db/database.js'
import path from "path";
import fs from "fs";
import bcrypt from 'bcrypt'

export async function ping(req, reply) {
  const me = Number(req.user.id);
  const now = Date.now();

  await db.run(
    "UPDATE users SET last_seen_at = ? WHERE id = ?",
    [now, me]
  );

  return reply.code(200).send({
    ok: true,
    last_seen_at: now
  });
}

export async function getAllUsersController(req, reply){
    // const users = await db.all("SELECT * FROM users;");
    const users = await db.all("Select id, email, username, avatar FROM users order by id;");
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

export async function updateAvatar(req, reply) {
  const id = req.user.id;

  const file = await req.file();
  if (!file) {
    return reply.code(400).send({ error: "No file uploaded" });
  }

  // validate mimetype
  const mime = file.mimetype;
  const ext =
    mime === "image/png" ? "png" :
    mime === "image/jpeg" ? "jpg" :
    null;

  if (!ext) {
    return reply.code(400).send({ error: "Only PNG/JPG allowed" });
  }

  const dir = path.join(process.cwd(), "uploads", "avatars");
  fs.mkdirSync(dir, { recursive: true });

  const filename = `user-${id}.${ext}`;
  const filepath = path.join(dir, filename);

  await fs.promises.writeFile(filepath, await file.toBuffer());

  const avatarUrl = `/uploads/avatars/${filename}`;
  await db.run("UPDATE users SET avatar = ? WHERE id = ?", [avatarUrl, id]);

  return reply.code(200).send({ avatarUrl });
}

export async function getMeProfile(req, reply){
    const userId = req.user.id

    const user = await db.get(
        "SELECT id, email, username, avatar, two_factor_enabled, created_at FROM users WHERE id = ?",
        [userId]
    )
    if(!user){
        return reply.code(404).send({ error: "User not found" })
    }

    return reply.code(200).send({
        user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        two_factor_authenticator: user.two_factor_enabled ? "enabled" : "disabled"
      }
    })
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

export async function updateUsername(req, reply) {
  const id = req.user.id;
  const { username } = req.body || {};

  if (typeof username !== "string") {
    return reply.code(400).send({ error: "Username must be a string" });
  }

  const clean = username.trim();
  if (!clean) {
    return reply.code(400).send({ error: "New username is required" });
  }
  if (clean.length < 3 || clean.length > 30) {
    return reply.code(400).send({ error: "Username must be 3-30 characters" });
  }

  const user = await db.get("SELECT id, username FROM users WHERE id = ?", [id]);
  if (!user) return reply.code(404).send({ error: "User not found" });

  if (user.username === clean) {
    return reply.code(400).send({ error: "Username is unchanged" });
  }

  const taken = await db.get(
    "SELECT id FROM users WHERE username = ? AND id != ?",
    [clean, id]
  );
  if (taken) return reply.code(409).send({ error: "Username already taken" });

  await db.run("UPDATE users SET username = ? WHERE id = ?", [clean, id]);

  return reply.code(200).send({
    message: "username updated",
    id,
    oldUsername: user.username,
    newUsername: clean,
  });
}

export async function getUserStats(req, reply) {
  const userId = req.user.id;

  const totalFinishedRow = await db.get(
    `SELECT COUNT(*) AS total
     FROM matches
     WHERE winner_id IS NOT NULL
       AND (player1_id = ? OR player2_id = ?)`,
    [userId, userId]
  );

  const totalWinsRow = await db.get(
    `SELECT COUNT(*) AS wins
     FROM matches
     WHERE winner_id = ?
       AND (player1_id = ? OR player2_id = ?)`,
    [userId, userId, userId]
  );

  const regularWinsRow = await db.get(
    `SELECT COUNT(*) AS wins
     FROM matches
     WHERE winner_id = ?
       AND mode != 'tournament'
       AND (player1_id = ? OR player2_id = ?)`,
    [userId, userId, userId]
  );

  const tournamentWinsRow = await db.get(
    `SELECT COUNT(*) AS wins
     FROM matches
     WHERE winner_id = ?
       AND mode = 'tournament'
       AND (player1_id = ? OR player2_id = ?)`,
    [userId, userId, userId]
  );

  const total = totalFinishedRow?.total || 0;
  const wins = totalWinsRow?.wins || 0;
  const losses = total - wins;

  return reply.code(200).send({
    userId,
    regularWins: regularWinsRow?.wins || 0,
    tournamentWins: tournamentWinsRow?.wins || 0,
    losses
  });
}

export async function getHistory(req, reply) {
  const userId = req.user.id;

  const matches = await db.all(
    `
    SELECT
      m.id,
      u1.username AS player1_name,
      m.player2_name AS player2_name,
      m.score_p1,
      m.score_p2,
      m.winner_id,
      m.created_at
    FROM matches m
    JOIN users u1 ON u1.id = m.player1_id
    WHERE m.winner_id IS NOT NULL
      AND m.mode != 'tournament'
      AND (m.player1_id = ? OR m.player2_id = ?)
    ORDER BY m.created_at DESC
    `,
    [userId, userId]
  );

  return reply.code(200).send({ matches });
}


export async function getUserTicStats(req, reply) {
  const userId = Number(req.user?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const row = await db.get(
    `
    SELECT
      SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN winner_id = 9999 THEN 1 ELSE 0 END) AS losses,
      SUM(CASE WHEN winner_id IS NULL THEN 1 ELSE 0 END) AS draws,
      COUNT(*) AS total
    FROM tictactoe_matches
    WHERE player1_id = ?
      AND status = 'finished';
    `,
    [userId, userId]
  );

  const wins = Number(row?.wins ?? 0);
  const losses = Number(row?.losses ?? 0);
  const draws = Number(row?.draws ?? 0);
  const total = Number(row?.total ?? 0);
  const winrate = total ? Math.round((wins / total) * 100) : 0;

  return reply.code(200).send({
    userId,
    wins,
    losses,
    draws,
    total,
    winrate: `${winrate}%`,
  });
}


export async function getTicHistory(req, reply) {
  const userId = Number(req.user?.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const rows = await db.all(
    `
    SELECT
      id,
      player2_name,
      winner_id,
      created_at
    FROM tictactoe_matches
    WHERE player1_id = ?
      AND status = 'finished'
    ORDER BY created_at DESC
    LIMIT 50
    `,
    [userId]
  );

  const matches = rows.map(m => {
    let outcome = 'draw';

    if (m.winner_id === userId) {
      outcome = 'win';
    } else if (m.winner_id === 9999) {
      outcome = 'loss';
    }

    return {
      id: m.id,
      opponent: m.player2_name || "Guest",
      winner_id: m.winner_id,   // keep raw value if frontend needs it
      outcome,                  // 'win' | 'loss' | 'draw'
      played_at: m.created_at,
    };
  });


  return reply.code(200).send({ matches });
}
