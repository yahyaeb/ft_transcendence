CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password TEXT NOT NULL,
    avatar TEXT,
    last_seen_at INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    two_factor_enabled INTEGER NOT NULL DEFAULT 0,
    two_factor_secret TEXT
);

CREATE TABLE IF NOT EXISTS matches(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER,
    player2_name TEXT,
    mode TEXT NOT NULL CHECK (mode IN ('pvp', 'pve', 'tournament')),
    status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'finished', 'cancelled')),
    winner_id INTEGER,
    score_p1 INTEGER DEFAULT 0,
    score_p2 INTEGER DEFAULT 0,
    tournament_id   INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    

    FOREIGN KEY(player1_id) REFERENCES users(id),
    FOREIGN KEY(player2_id) REFERENCES users(id),
    FOREIGN KEY(winner_id)  REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS tictactoe_matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player1_id INTEGER NOT NULL,
  player2_id INTEGER,
  player2_name TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','finished','cancelled')),
  winner_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  finished_at TEXT,

  FOREIGN KEY(player1_id) REFERENCES users(id),
  -- FOREIGN KEY(player2_id) REFERENCES users(id),
  FOREIGN KEY(winner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, friend_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(friend_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blocker_id INTEGER NOT NULL,
  blocked_id INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blocker_id, blocked_id),
  FOREIGN KEY(blocker_id) REFERENCES users(id),
  FOREIGN KEY(blocked_id) REFERENCES users(id)
);

-- INSERT INTO users (username, email, password)
-- VALUES
--   ('Yahya', 'test1@test.com', '123456'),
--   ('yassine', 'test21@test.com', '123456'),
--   ('mehdi', 'test3@test.com', '123456'),
--   ('nisar', 'test4@test.com', '123456'),
--   ('iheb', 'test5@test.com', '123456'),
--   ('hicham', 'test6@test.com', '123456');
