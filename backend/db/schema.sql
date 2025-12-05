CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    two_factor_enabled INTEGER NOT NULL DEFAULT 0,
    two_factor_secret TEXT
);

CREATE TABLE IF NOT EXISTS matches(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    mode TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    winner_id INTEGER NULL,
    score_p1 INTEGER DEFAULT 0,
    score_p2 INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY(player1_id) REFERENCES users(id),
    FOREIGN KEY(player2_id) REFERENCES users(id) 
);




INSERT INTO users (username, email, password)
VALUES
  ('Yahya', 'test1@test.com', '123456'),
  ('yassine', 'test21@test.com', '123456'),
  ('mehdi', 'test3@test.com', '123456'),
  ('nisar', 'test4@test.com', '123456'),
  ('iheb', 'test5@test.com', '123456'),
  ('hicham', 'test6@test.com', '123456');
