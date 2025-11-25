const express = require('express');
const app = express();
const port = 3000;

const pool = require('./config/db');

app.use(express.json());

app.post('/messages', async(req, res) => {
    try {
        let limit = req.body.limit || 10;

        if (limit == -1) limit = 99999;

        if (limit <= 0) {
            const data400 = {
                status: "error",
                message: "'limit' must be higher than 0",
            }

            return res.status(400).json(data400);
        }

        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages ORDER BY id DESC LIMIT $1', [limit]);
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