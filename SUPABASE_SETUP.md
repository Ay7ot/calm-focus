# Supabase Setup Guide for Calm Focus

## Current Status
✅ Supabase client configuration is complete
✅ Authentication middleware is set up
✅ Server and client-side utilities are ready

## What You Need to Do

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - Name: `calm-focus` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Click "Create new project" and wait for setup to complete

### 2. Get Your Environment Variables
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys" → "anon public")

3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database Tables

Go to **SQL Editor** in your Supabase dashboard and run these SQL commands:

#### A. Profiles Table (User Data)
```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### B. Forum Posts Table
```sql
-- Create forum_posts table
create table public.forum_posts (
  id bigserial primary key,
  title text not null,
  content text not null,
  category text not null default 'general',
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.forum_posts enable row level security;

-- Policies for forum_posts
create policy "Forum posts are viewable by authenticated users"
  on forum_posts for select
  to authenticated
  using ( true );

create policy "Authenticated users can create posts"
  on forum_posts for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can update their own posts"
  on forum_posts for update
  to authenticated
  using ( auth.uid() = user_id );

create policy "Users can delete their own posts"
  on forum_posts for delete
  to authenticated
  using ( auth.uid() = user_id );

-- Index for performance
create index forum_posts_user_id_idx on forum_posts(user_id);
create index forum_posts_created_at_idx on forum_posts(created_at desc);
```

#### C. Reminders Table
```sql
-- Create reminders table
create table public.reminders (
  id bigserial primary key,
  title text not null,
  message text,
  remind_at timestamp with time zone not null,
  is_global boolean default false,
  created_by uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.reminders enable row level security;

-- Policies for reminders
create policy "Users can view their own reminders and global reminders"
  on reminders for select
  to authenticated
  using ( auth.uid() = created_by or is_global = true );

create policy "Authenticated users can create reminders"
  on reminders for insert
  to authenticated
  with check ( auth.uid() = created_by );

create policy "Users can update their own reminders"
  on reminders for update
  to authenticated
  using ( auth.uid() = created_by );

create policy "Users can delete their own reminders"
  on reminders for delete
  to authenticated
  using ( auth.uid() = created_by );

-- Index for performance
create index reminders_created_by_idx on reminders(created_by);
create index reminders_remind_at_idx on reminders(remind_at);
```

#### D. Focus Sessions Table (Optional - for tracking)
```sql
-- Create focus_sessions table
create table public.focus_sessions (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  duration_minutes integer not null,
  completed boolean default false,
  session_type text default 'focus',
  started_at timestamp with time zone not null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.focus_sessions enable row level security;

-- Policies for focus_sessions
create policy "Users can view their own sessions"
  on focus_sessions for select
  to authenticated
  using ( auth.uid() = user_id );

create policy "Users can create their own sessions"
  on focus_sessions for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can update their own sessions"
  on focus_sessions for update
  to authenticated
  using ( auth.uid() = user_id );

-- Index for performance
create index focus_sessions_user_id_idx on focus_sessions(user_id);
create index focus_sessions_started_at_idx on focus_sessions(started_at desc);
```

### 4. Configure Authentication Settings

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (already enabled by default)
3. Optional: Configure email templates under **Authentication** → **Email Templates**
4. Optional: Set up OAuth providers (Google, GitHub, etc.) if desired

### 5. Test Your Setup

1. Restart your Next.js dev server:
```bash
npm run dev
```

2. Try to sign up at `/signup`
3. Check Supabase dashboard under **Authentication** → **Users** to see if the user was created
4. Check **Table Editor** → **profiles** to see if the profile was auto-created

## Troubleshooting

### Common Issues:

1. **"Invalid API Key" error**
   - Double-check your `.env.local` file
   - Make sure you're using the **anon/public key**, not the service role key
   - Restart your dev server after adding env variables

2. **Profile not created automatically**
   - Make sure you ran the trigger SQL from step 3A
   - Check Supabase logs under **Logs** → **Postgres Logs**

3. **RLS Policy errors (can't read/write data)**
   - Make sure you ran all the RLS policies
   - Verify you're authenticated (check auth state in browser dev tools)
   - Check Supabase logs for policy violations

4. **Users table doesn't show profiles join**
   - Make sure you're selecting profiles in your query: `.select('*, profiles(username)')`

## Next Steps

Once setup is complete, you can:
- ✅ Sign up and log in users
- ✅ Automatically create user profiles
- ✅ Create forum posts with user attribution
- ✅ Create personal and global reminders
- ✅ Track focus sessions (optional)

All features in the app will now work with real authentication and database storage!

