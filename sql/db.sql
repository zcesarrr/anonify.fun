DROP TABLE messages;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE messages(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	msg TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	answer TEXT NULL,
	answer_updated_at TIMESTAMP WITH TIME ZONE NULL
);

ALTER TABLE messages
ADD COLUMN answered_at TIMESTAMP WITH TIME ZONE NULL;

SELECT * FROM messages;

SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;

UPDATE messages SET answered_at = CURRENT_TIMESTAMP;

UPDATE messages SET answer = 'Y que tal? Funciona bien? y esa risa toda pendejita que we' 
WHERE id = 'edb2c3cb-b0ec-4ecc-9102-ea57587c79d4';

-- Test searching message by id
SELECT * FROM messages WHERE id = 'e132b481-4d75-46a0-a14d-622b1401ff2b';
SELECT * FROM messages WHERE answer IS NOT NULL ORDER BY created_at DESC LIMIT 10;
SELECT * FROM messages WHERE answer IS NULL ORDER BY created_at DESC OFFSET 0 ROWS LIMIT 10;

SELECT *, COUNT(*) OVER() AS total_rows FROM messages WHERE answer IS NULL ORDER BY created_at DESC OFFSET 0 LIMIT 10;


INSERT INTO messages(msg) VALUES('hi owo');
INSERT INTO messages(msg) VALUES('hello :3');

-- Triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.answer_updated_at = now();

	IF NEW.answered_at IS NULL THEN
        NEW.answered_at = NOW();
    END IF;
	
	RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_your_table_modified_time
BEFORE UPDATE OF answer ON messages
FOR EACH ROW
WHEN (OLD.answer IS DISTINCT FROM new.answer)
EXECUTE FUNCTION update_modified_column();