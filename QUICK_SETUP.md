# Quick Setup Guide

## The Issue: Supabase Not Configured

If you're seeing a "Supabase Not Configured" error or the login UI appears broken, it means the environment variables are not set up.

## Quick Fix (5 minutes):

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization and create the project
4. Wait 2-3 minutes for setup to complete

### 2. Set Up Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste it into the SQL editor and click **Run**
4. This creates your tables and sample data

### 3. Get Your Credentials
1. Go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key

### 4. Create Environment File
Create a file called `.env.local` in your project root with:

```bash
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: AI Avatar Generation (get token from https://pollinations.ai)
REACT_APP_POLLINATIONS_TOKEN=your_bearer_token_here
```

Replace the values with your actual credentials from step 3.

**Note:** The `REACT_APP_POLLINATIONS_TOKEN` is optional. If you don't provide it, the AI avatar generation will still work but with rate limits.

### 5. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## That's It!

After these steps:
- ✅ The login form will work properly
- ✅ You can create admin accounts
- ✅ Student data will load from Supabase
- ✅ Check-ins will be saved to the database

## Need Help?

- Check the full [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions
- Check the [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) for auth details
- Make sure your `.env.local` file is in the project root (same folder as `package.json`)

## Common Issues:

1. **"Supabase Not Configured" error**: Environment variables not set
2. **Login form not working**: Check Supabase URL and key are correct
3. **Database errors**: Make sure you ran the SQL schema
4. **Still having issues**: Restart the development server after adding `.env.local`
