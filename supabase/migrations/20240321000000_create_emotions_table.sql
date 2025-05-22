-- Create emotions table
CREATE TABLE IF NOT EXISTS emotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    emotions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS emotions_user_id_idx ON emotions(user_id);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS emotions_created_at_idx ON emotions(created_at);

-- Enable Row Level Security
ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own emotions
CREATE POLICY "Users can insert their own emotions"
    ON emotions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to view their own emotions
CREATE POLICY "Users can view their own emotions"
    ON emotions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policy to allow users to update their own emotions
CREATE POLICY "Users can update their own emotions"
    ON emotions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own emotions
CREATE POLICY "Users can delete their own emotions"
    ON emotions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id); 