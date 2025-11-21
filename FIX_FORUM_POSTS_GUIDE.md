# Fix Forum Posts Foreign Key Relationship

## Error
```json
{
  "code": "PGRST200",
  "details": "Searched for a foreign key relationship between 'forum_posts' and 'profiles' in the schema 'public', but no matches were found.",
  "message": "Could not find a relationship between 'forum_posts' and 'profiles' in the schema cache"
}
```

## Problem
The `forum_posts` table exists but doesn't have a proper foreign key relationship to the `profiles` table, so Supabase can't perform the join query `select('*, profiles(username)')`.

## Solution

### Step 1: Run This SQL in Supabase Dashboard

Go to **Supabase Dashboard → SQL Editor** and run:

```sql
-- Add user_id column if it doesn't exist
ALTER TABLE forum_posts 
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Drop existing constraint if it exists
ALTER TABLE forum_posts 
DROP CONSTRAINT IF EXISTS forum_posts_user_id_fkey;

-- Add the foreign key constraint
ALTER TABLE forum_posts 
ADD CONSTRAINT forum_posts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS forum_posts_user_id_idx ON forum_posts(user_id);
```

### Step 2: Verify the Relationship

Run this to verify the foreign key was created:

```sql
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='forum_posts';
```

**Expected output:**
```
table_name   | column_name | foreign_table_name | foreign_column_name
-------------|-------------|--------------------|--------------------- 
forum_posts  | user_id     | profiles           | id
```

### Step 3: Check Table Structure

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'forum_posts'
ORDER BY ordinal_position;
```

**Should show:**
- `id` (bigint)
- `user_id` (uuid) ← Must exist
- `title` (text)
- `content` (text)
- `category` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Temporary Workaround

The code has been updated to fall back to fetching posts without the profile join if the relationship is missing. This prevents the page from crashing, but you won't see usernames until you run the SQL fix.

## After Running the SQL

1. Refresh the Supabase schema cache (it usually auto-refreshes)
2. Hard refresh your browser (Cmd/Ctrl + Shift + R)
3. Navigate to the Content page
4. You should now see forum posts with usernames!

## If You Still Get Errors

1. **Check if forum_posts table exists:**
   ```sql
   SELECT * FROM forum_posts LIMIT 1;
   ```

2. **Check if profiles table exists:**
   ```sql
   SELECT * FROM profiles LIMIT 1;
   ```

3. **Recreate the table from scratch** (if needed):
   ```sql
   -- Backup data first if you have any
   -- Then run CHECK_AND_CREATE_TABLES.sql
   ```

The error should be resolved after adding the foreign key! 🎉

