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


-- Functions required for the first messages table creation (updatable)
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


-- Triggers for the first messages table creation
CREATE TRIGGER update_your_table_modified_time
BEFORE UPDATE OF answer ON messages
FOR EACH ROW
WHEN (OLD.answer IS DISTINCT FROM new.answer)
EXECUTE FUNCTION update_modified_column();


-- ##########################################################


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
SET answer = 'Opino lo mismo, the chicken is in the oven lenny face wtf' 
WHERE id = 'e26b309c-7575-4a78-bdde-6f0df4b3abc4';