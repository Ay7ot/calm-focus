-- ========================================
-- Fix forum_posts table foreign key relationship
-- ========================================

-- First, check if the table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'forum_posts';

-- Check current structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'forum_posts';

-- Add user_id column if it doesn't exist
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Add foreign key constraint to profiles
-- Drop existing constraint first if it exists
ALTER TABLE forum_posts 
DROP CONSTRAINT IF EXISTS forum_posts_user_id_fkey;

-- Add the foreign key constraint
ALTER TABLE forum_posts 
ADD CONSTRAINT forum_posts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS forum_posts_user_id_idx ON forum_posts(user_id);

-- Verify the relationship was created
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='forum_posts';

