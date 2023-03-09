const express = require('express');
const app = express();
const { Pool } = require('pg');
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'goodgame',
    password: 'password',
    port: 5432
})
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PATCH, DELETE, OPTIONS");
    next();
  });
// user commands
app.get("/api/users", (req, res) => { // select all users
    pool.query('SELECT * from users', (err, result) => {
        if (err) {
            return res.sendStatus(400);
        }
        else {
            const rows = result.rows;
            res.send(rows);
        }
    });
})
app.get("/api/users/:id", (req, res) => {  // select specific user
    const id = Number.parseInt(req.params.id);
    pool.query('SELECT username FROM users WHERE userID = ' + id + ';', (err, result) => {
        if (err){
            return res.sendStatus(400);
        }
        else {
            const user = result.rows[0];
            res.send(user);
        }
    })
})
app.post("/api/users", (req, res) => {  // add new user
    let keys = Object.keys(req.body);
    let keysStr = keys.join(', ');
    pool.query("INSERT INTO users (" + keysStr + ") VALUES ($1, $2)",[req.body.username, req.body.userID], (err, result) => {
        if (err){
            return res.sendStatus(400);
        }
        else {
            res.send(req.body);
        }
    })
})
app.patch("/api/users/:id", (req, res) => {  // update user
    const id = Number.parseInt(req.params.id);
    if (req.body.username) {
        pool.query("UPDATE users SET username = $2 WHERE userID = $1",[id, req.body.username], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    if (req.body.userID) {
        pool.query("UPDATE users SET userID= $2 WHERE userID = $1",[id, req.body.userID], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    res.send("Update Complete");
})
app.delete("/api/users/:id", (req, res) => {  // delete user
    const id = Number.parseInt(req.params.id);
    pool.query('DELETE FROM users WHERE userID = $1', [id], (err, data) => {
        if (err) {
            res.sendStatus(400);
        }
        else {
            res.send("Data Deleted");
        }
    })  
})

// game commands
app.get("/api/games", (req, res) => { // select all users
    pool.query('SELECT * from games', (err, result) => {
        if (err) {
            return res.sendStatus(400);
        }
        else {
            const rows = result.rows;
            res.send(rows);
        }
    });
})
app.get("/api/games/:id", (req, res) => {  // select specific user
    const id = Number.parseInt(req.params.id);
    pool.query('SELECT game FROM games WHERE gamesID = ' + id + ';', (err, result) => {
        if (err){
            return res.sendStatus(400);
        }
        else {
            const user = result.rows[0];
            res.send(user);
        }
    })
})
app.post("/api/games", (req, res) => {  // add new user
    let keys = Object.keys(req.body);
    let keysStr = keys.join(', ');
    pool.query("INSERT INTO games (" + keysStr + ") VALUES ($1, $2)",[req.body.game, req.body.gamesID], (err, result) => {
        if (err){
            return res.sendStatus(400);
        }
        else {
            res.send(req.body);
        }
    })
})
app.patch("/api/games/:id", (req, res) => {  // update user
    const id = Number.parseInt(req.params.id);
    if (req.body.game) {
        pool.query("UPDATE games SET game = $2 WHERE gamesID = $1",[id, req.body.game], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    if (req.body.gamesID) {
        pool.query("UPDATE games SET gamesID = $2 WHERE gamesID = $1",[id, req.body.gamesID], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    res.send("Update Complete");
})
app.delete("/api/games/:id", (req, res) => {  // delete user
    const id = Number.parseInt(req.params.id);
    pool.query('DELETE FROM games WHERE gamesID = $1', [id], (err, data) => {
        if (err) {
            res.sendStatus(400);
        }
        else {
            res.send("Data Deleted");
        }
    })  
})

// feed commands
app.get("/api/feed", (req, res) => { // select all posts
    pool.query('SELECT feed.postid, feed.post, users.username, games.game FROM feed JOIN users ON feed.userid = users.userid JOIN games ON feed.gamesid = games.gamesID;', (err, result) => {
        if (err) {
            return res.sendStatus(400);
        }
        else {
            rows = result.rows;
            res.send(rows);
        }
    });
})
app.get("/api/feed/:id", (req, res) => {  // select specific post
    const id = Number.parseInt(req.params.id);
    pool.query('SELECT feed.post, users.username, games.game FROM feed JOIN users ON feed.userid = users.userid JOIN games ON feed.gamesid = games.gamesID WHERE postid = ' + id + ';', (err, result) => {
        if (err){
            return res.sendStatus(400);
        }
        else {
            const user = result.rows[0];
            res.send(user);
        }
    })
})
app.post("/api/feed", (req, res) => {  // add new post
    let keys = Object.keys(req.body);
    let keysStr = keys.join(', ');
    pool.query("INSERT INTO feed (" + keysStr + ") VALUES ($1,$2,$3,$4)",[req.body.post, req.body.userid, req.body.gamesid, req.body.postid], (err, result) => {
        if (err){
            return res.sendStatus(400);
        }
        else {
            res.send(req.body);
        }
    })
})
app.patch("/api/feed/:id", (req, res) => {  // update post
    const id = Number.parseInt(req.params.id);
    if (req.body.post) {
        pool.query("UPDATE feed SET post = $2 WHERE postid = $1",[id, req.body.post], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    if (req.body.userid) {
        pool.query("UPDATE feed SET userid = $2 WHERE postid = $1",[id, req.body.userid], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    if (req.body.gamesid) {
        pool.query("UPDATE feed SET gamesid = $2 WHERE postid = $1",[id, req.body.gamesid], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    if (req.body.postid) {
        pool.query("UPDATE feed SET postid = $2 WHERE postid = $1",[id, req.body.postid], (err, result) => {
            if (err){
                return res.sendStatus(400);
            }
        })
    }
    res.send("Update Complete");
})
app.delete("/api/feed/:id", (req, res) => {  // delete post
    const id = Number.parseInt(req.params.id);
    pool.query('DELETE FROM feed WHERE postid = $1', [id], (err, data) => {
        if (err) {
            res.sendStatus(400);
        }
        else {
            res.send("Data Deleted");
        }
    })  
})

app.listen(8000, () => {
    console.log('server is running');
})