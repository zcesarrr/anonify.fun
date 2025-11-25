const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const pool = require('./config/db');

const rateLimit = require('express-rate-limit');

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const getMessagesLimiter = rateLimit({
    windowMs: 5 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        const retryAfter = res.getHeader("RateLimit-Reset");

        res.status(429).json({
            status: "error",
            message: "Rate limit exceeded.",
            retryAfter
        });
    },
});

app.post('/messages', getMessagesLimiter, async(req, res) => {
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