-- Add primary key to diaries table
ALTER TABLE diaries
ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
ADD PRIMARY KEY (id);

-- Add index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON diaries(user_id);

-- Add index on created_at for better sorting performance
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at);
