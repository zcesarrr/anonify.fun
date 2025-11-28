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

UPDATE messages SET answer = 'Gracias por probar :3' 
WHERE id = '9649fdc5-0a4c-4a58-bc09-2f0d221160fd';

-- Test searching message by id
SELECT * FROM messages WHERE id = 'e132b481-4d75-46a0-a14d-622b1401ff2b';
SELECT * FROM messages WHERE answer IS NOT NULL ORDER BY created_at DESC LIMIT 10;
SELECT * FROM messages WHERE answer IS NULL ORDER BY created_at DESC LIMIT 10;

INSERT INTO messages(msg) VALUES('hi owo');
INSERT INTO messages(msg) VALUES('hello :3');

-- Triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.answer_updated_at = now();
	RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_your_table_modified_time
BEFORE UPDATE OF answer ON messages
FOR EACH ROW
WHEN (OLD.answer IS DISTINCT FROM new.answer)
EXECUTE FUNCTION update_modified_column();