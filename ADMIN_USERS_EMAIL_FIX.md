# Admin Users Page - Email Fetching Fix

## Issue
The users page was trying to use `supabase.auth.admin.listUsers()` on the client side, which requires admin privileges and the service role key. This caused an "User not allowed" error.

## Solution
Created a server action `getAllUsersWithEmails()` that:
1. Runs on the server (has access to service role key)
2. Fetches profiles, session counts, and post counts from database
3. Fetches emails from Supabase Auth Admin API using service role key
4. Returns merged data to the client

## Required Environment Variable

You need to add your Supabase Service Role Key to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### How to Get Service Role Key:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Under "Project API keys", find **service_role** key
4. Copy it and add to `.env.local`

⚠️ **Important**: Never commit the service role key to version control! It has full admin access to your database.

## Fallback
If the service role key is not set, the code will fall back to using the anon key (which won't return emails, but won't crash the app).

## Files Changed
- ✅ `app/admin/users/serverActions.ts` - New server action
- ✅ `app/admin/users/page.tsx` - Now uses server action instead of client-side admin call

