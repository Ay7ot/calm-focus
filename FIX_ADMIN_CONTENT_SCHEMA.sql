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

