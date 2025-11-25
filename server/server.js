const express = require('express');
const app = express();
const port = 3000;

const pool = require('./config/db');

app.get('/', async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages ORDER BY id DESC');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query", err);
        res.status(500).send("Server error");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});