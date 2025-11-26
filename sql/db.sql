DROP TABLE messages;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE messages(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	msg TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM messages;

SELECT * FROM messages ORDER BY id DESC LIMIT 10;

-- Test searching message by id
SELECT * FROM messages WHERE id = 'e132b481-4d75-46a0-a14d-622b1401ff2b';

INSERT INTO messages(msg) VALUES('hi owo');
INSERT INTO messages(msg) VALUES('hello :3');