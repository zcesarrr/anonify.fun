require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.SERVER_PORT || 3000;

const pool = require('./config/db');

const rateLimit = require('express-rate-limit');

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['RateLimit-Reset', 'RateLimit-Remaining']
}));

app.use(express.json());

const limiterHandler = (req, res) => {
    const retryAfter = res.getHeader("RateLimit-Reset");

    res.status(429).json({
        status: "error",
        message: "Rate limit exceeded.",
        retryAfter
    });
}

const getMessagesLimiter = rateLimit({
    windowMs: 15 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limiterHandler,
});

const sendMessagesLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limiterHandler,
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

app.post('/send', sendMessagesLimiter, async(req, res) => {
    try {
        let message = req.body.message;

        if (message.length < 6) {
            const data400 = {
                status: "error",
                message: "The message must be higher than 5 characters.",
            }

            return res.status(400).json(data400);
        }

        const client = await pool.connect();
        const result = await client.query('INSERT INTO messages(msg) VALUES($1)', [message]);
        client.release();
        
        const data = {
            status: "success",
            message: "The message has been sent!"
        }

        res.status(200).json(data);
    } catch (err) {
        console.error("Error executing query", err);

        const data = {
            status: "error",
            message: "Something went wrong."
        }

        res.status(500).json(data);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});