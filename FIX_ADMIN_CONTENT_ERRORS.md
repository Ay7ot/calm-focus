# Fix Admin Content Errors

## Errors Encountered

1. **Error fetching posts: {}** - Empty error from forum_posts query
2. **Error creating tip: {}** - Empty error when creating daily tips

## Root Causes

### 1. Missing `title` column in `daily_tips` table
The code expects a `title` field but the database schema only has `content`.

### 2. RLS Policy Issues
The admin RLS policies might not have proper `WITH CHECK` clauses for inserts.

### 3. `created_by` field constraints
The field might be `NOT NULL` but we're not always providing it.

## Solution

### Step 1: Run the SQL Migration

Go to your Supabase Dashboard → SQL Editor and run:

```sql
-- Fix daily_tips table to add title field
ALTER TABLE daily_tips ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';

-- Update daily_tips RLS policies to allow admin writes with check
DROP POLICY IF EXISTS "Admins can manage tips" ON daily_tips;

CREATE POLICY "Admins can manage tips"
  ON daily_tips FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Make sure created_by can be null (for backwards compatibility)
ALTER TABLE daily_tips ALTER COLUMN created_by DROP NOT NULL;

-- Fix reminders table - make sure created_by can be null
ALTER TABLE reminders ALTER COLUMN created_by DROP NOT NULL;
```

### Step 2: Verify the Schema

Check that these columns exist:

```sql
-- Check daily_tips structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'daily_tips';

-- Should have:
-- - id (bigint)
-- - title (text) ← NEW
-- - content (text)
-- - category (text)
-- - is_active (boolean)
-- - created_by (uuid, nullable)
-- - created_at (timestamp)
-- - updated_at (timestamp)
```

### Step 3: Check RLS Policies

```sql
-- View all policies for daily_tips
SELECT * FROM pg_policies WHERE tablename = 'daily_tips';

-- View all policies for reminders
SELECT * FROM pg_policies WHERE tablename = 'reminders';

-- View all policies for forum_posts
SELECT * FROM pg_policies WHERE tablename = 'forum_posts';
```

### Common Issues

**If you still get errors after running the SQL:**

1. **Check if tables exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('daily_tips', 'reminders', 'forum_posts');
   ```

2. **Check RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('daily_tips', 'reminders', 'forum_posts');
   ```

3. **Temporarily disable RLS to test** (only for debugging):
   ```sql
   ALTER TABLE daily_tips DISABLE ROW LEVEL SECURITY;
   -- Try creating a tip
   -- Then re-enable:
   ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;
   ```

## Files That Need the Schema Updates

- ✅ `app/admin/content/page.tsx` - Already expects `title` field
- ✅ `app/admin/reminders/page.tsx` - Already handles `created_by`
- ✅ All forms already have the correct fields

## After Running the SQL

1. Refresh your browser (hard refresh: Cmd/Ctrl + Shift + R)
2. Try creating a new tip
3. Try creating a new reminder
4. Check that forum posts load correctly

The errors should be resolved! 🎉

