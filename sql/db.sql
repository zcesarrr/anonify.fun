DROP TABLE messages;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE messages(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	msg TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	answer TEXT NULL,
	answer_updated_at TIMESTAMP WITH TIME ZONE NULL
);

SELECT * FROM messages;

SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;

UPDATE messages SET answer = 'Hola gracias por responder' WHERE id = 'e42a25d6-5176-43e0-b260-a2ce1dbc30c1';

-- Test searching message by id
SELECT * FROM messages WHERE id = 'e132b481-4d75-46a0-a14d-622b1401ff2b';
SELECT * FROM messages WHERE answer IS NOT NULL;

INSERT INTO messages(msg) VALUES('hi owo');
INSERT INTO messages(msg) VALUES('hello :3');