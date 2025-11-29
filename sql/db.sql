-- EXTREME EMERGENCY
-- DROP TABLE messages;


-- Create UUID4 extension only for the first installation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Create messages table only for the first installation
CREATE TABLE messages(
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	msg TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	answer TEXT NULL,
	answered_at TIMESTAMP WITH TIME ZONE NULL,
	answer_updated_at TIMESTAMP WITH TIME ZONE NULL
);


-- Functions
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


-- Triggers for the first installation
CREATE TRIGGER update_your_table_modified_time
BEFORE UPDATE OF answer ON messages
FOR EACH ROW
WHEN (OLD.answer IS DISTINCT FROM new.answer)
EXECUTE FUNCTION update_modified_column();


-- ##########################################################


-- Alter table example just in case:
ALTER TABLE messages
ADD COLUMN answered_at TIMESTAMP WITH TIME ZONE NULL;


-- Get the last 10 messages (all types)
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;


-- Get the last 10 answered messages
SELECT *, COUNT(*) OVER() AS total_rows 
FROM messages WHERE answer IS NOT NULL ORDER BY created_at DESC OFFSET 0 LIMIT 10;


-- Get the last 10 NOT-answered messages
SELECT *, COUNT(*) OVER() AS total_rows 
FROM messages WHERE answer IS NULL ORDER BY created_at DESC OFFSET 0 LIMIT 10;


-- Get all NOT-answered messages
SELECT *, COUNT(*) OVER() AS total_rows 
FROM messages WHERE answer IS NULL ORDER BY created_at DESC;


-- Answer a message example:
UPDATE messages 
SET answer = 'Creo que esto si que va a funcionar... EDIT: Probando updated_at' 
WHERE id = '407fa152-9adb-4a2f-8fce-169e7ef29cad';