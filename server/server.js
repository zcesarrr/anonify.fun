const express = require('express');
const app = express();
const port = 3000;

const pool = require('./config/db');

app.get('/messages/', async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages ORDER BY id DESC');
        client.release();
        
        const data = {
            status: "success",
            message: "Operation has been completed sucessfully!",
            data: result.rows
        }
        
        res.status(200).json(data);
    } catch (err) {
        console.error("Error executing query", err);

        const data = {
            status: "error",
            message: "Server error"
        }

        res.status(500).json(data);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});