require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.SERVER_PORT || 3000;

const pool = require('./config/db');

const rateLimit = require('express-rate-limit');

const allowedOrigins = process.env.CLIENT_URLS.split(",");

app.use(cors({
    origin: [allowedOrigins],
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
    windowMs: 180 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limiterHandler,
});

const searchMessageLimiter = rateLimit({
    windowMs: 120 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limiterHandler,
});


const sendMessagesLimiter = rateLimit({
    windowMs: 300 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: limiterHandler,
});

app.post('/messages', getMessagesLimiter, async(req, res) => {
    try {
        let limit = req.body.limit || 10;
        let offset = req.body.offset || 0;
        let answerRequired = req.body.answerRequired;

        if (limit == -1) limit = 99999;

        if (limit <= 0) {
            const data400 = {
                status: "error",
                message: "'limit' must be higher than 0",
            }

            return res.status(400).json(data400);
        }

        const client = await pool.connect();
        const result = await client.query(`SELECT msg, created_at, answer, answered_at, answer_updated_at FROM messages ${answerRequired ? 'WHERE answer IS NOT NULL' : ''} ORDER BY created_at DESC OFFSET $1 ROWS LIMIT $2`, [offset, limit]);

        const total_rows = await client.query(`SELECT COUNT(*) AS total FROM messages ${answerRequired ? 'WHERE answer IS NOT NULL' : ''}`);
        client.release();
        
        const data = {
            status: "success",
            message: "Operation has been completed sucessfully!",
            data: result.rows,
            offset:offset,
            totalRows: parseInt(total_rows.rows[0].total)
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

app.post('/search', searchMessageLimiter, async(req, res) => {
    try {
        const id = req.body.id;

        if (id === null || id === "") {
            const data400 = {
                status: "error",
                message: "'id' is invalid.",
            }

            return res.status(400).json(data400);
        }

        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages WHERE id = $1', [id]);
        client.release();

        if (result.rows.length > 0) {
            const data = {
                status: "success",
                message: "A message was found!",
                data: result.rows[0]
            }

            return res.status(200).json(data);
        } else {
            const data = {
                status: "success",
                message: "No messages were found with the provided ID.",
            }

            return res.status(200).json(data);
        }
    } catch (err) {
        console.error("Error executing query", err);

        const data = {
            status: "error",
            message: "Something went wrong."
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
        const result = await client.query('INSERT INTO messages(msg) VALUES($1) RETURNING id, msg, created_at', [message]);
        client.release();

        const row = result.rows[0];
        
        const data = {
            status: "success",
            message: "The message has been sent!",
            data: {
                id: row.id,
                message: row.msg,
                created_at: row.created_at
            }
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
    console.log(`App listening on port http://localhost:${port}`);
});