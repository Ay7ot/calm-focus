-- Add ban reason columns to profiles table

-- Add new columns for ban management
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ban_reason TEXT,
ADD COLUMN IF NOT EXISTS banned_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS banned_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for checking expired bans
CREATE INDEX IF NOT EXISTS idx_profiles_banned_until ON profiles(banned_until) WHERE is_banned = true;

-- Add comment for documentation
COMMENT ON COLUMN profiles.ban_reason IS 'Reason provided by admin when banning the user';
COMMENT ON COLUMN profiles.banned_until IS 'Timestamp when the ban expires (NULL for permanent bans)';
COMMENT ON COLUMN profiles.banned_by IS 'Admin user ID who issued the ban';

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('ban_reason', 'banned_until', 'banned_by', 'is_banned')
ORDER BY ordinal_position;

