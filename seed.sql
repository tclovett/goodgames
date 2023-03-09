CREATE TABLE feed (
post TEXT,
userid INT,
gamesid INT,
postid INT
);
CREATE TABLE users (
username TEXT,
userid INT
);
CREATE TABLE games (
game TEXT,
gamesid INT
);
INSERT INTO users VALUES ('Sio', 1),('Lovix', 2),('Mave', 3);
INSERT INTO games VALUES ('World of Warcraft', 1),('League of Legends', 2),('Dark Souls', 3);
INSERT INTO feed VALUES ('I love this game!', 1, 1, 1),('Looking forward to the new patch!', 2, 2, 2),('This game is too hard...', 3, 2, 3),
('Can not get enough', 1, 3, 4),('Perfect boss fight, love it', 2, 2, 5);