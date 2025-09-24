# Supabase Setup Guide

This guide will help you set up Supabase for your Martial Arts Kiosk application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and create a new project
4. Wait for the project to be set up (this takes a few minutes)

## 2. Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/schema.sql` into the editor
3. Click "Run" to execute the SQL and create your tables

## 3. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your authentication settings:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: Add your production domain when deploying
3. Optionally disable email confirmations for testing:
   - Go to Authentication > Settings
   - Toggle "Enable email confirmations" off for easier testing

## 4. Configure Environment Variables

1. In your Supabase dashboard, go to Settings > API
2. Copy your Project URL and anon/public key
3. Create a `.env.local` file in your project root:

```bash
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

Example:
```bash
REACT_APP_SUPABASE_URL=https://xyzcompany.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Create Your First Admin User

1. Start your development server: `npm start`
2. Navigate to `http://localhost:3000`
3. Click the "Admin" button
4. Click "Create Account" on the login form
5. Enter your email and password
6. If email confirmation is enabled, check your email and click the verification link
7. Sign in with your new account

## 6. Test the Connection

1. The app should now load data from Supabase instead of mock data
2. You should see the sample students that were inserted by the schema
3. Try checking in a student to test the functionality
4. Access the admin panel to manage students (requires authentication)

## 7. Deploy to Vercel

### Option A: Using Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to set up your project
4. Add your environment variables in the Vercel dashboard

### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

## 6. Database Security (Optional)

The current setup allows public access to all operations, which is suitable for a kiosk. If you want to add authentication:

1. Enable Row Level Security (RLS) policies
2. Add authentication for admin operations
3. Use Supabase Auth for user management
4. Set up storage bucket for AI-generated avatars

### Storage Configuration

The schema automatically creates an `avatars` storage bucket with the following features:

- **Public Read Access**: Kiosk can display avatar images without authentication
- **Authenticated Upload**: Only admin users can upload/update avatars
- **Automatic Organization**: Avatars are stored in `student-avatars/` folder
- **Unique Naming**: Files are named with student ID and timestamp

## 7. Sample Data

The schema includes sample students:
- David Kim (20 classes) - Gold badge
- Sarah Johnson (18 classes) - Gold badge  
- Mike Chen (15 classes) - Gold badge
- Emma Wilson (12 classes) - Gold badge
- Alex Rodriguez (10 classes) - Silver badge
- Lisa Park (8 classes) - Bronze badge
- Tom Brown (6 classes) - Bronze badge
- Zoe Davis (4 classes) - Bronze badge

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure the database tables were created successfully

### Build Issues
- Make sure all environment variables are set in your deployment platform
- Check that your Supabase project URL and key are valid

### Data Not Loading
- Verify the schema was executed successfully
- Check the browser console for any error messages
- Ensure RLS policies allow the operations you need

## Features Included

✅ Real-time student data from Supabase  
✅ Check-in functionality with database updates  
✅ Admin panel for managing students  
✅ Toast notifications for user feedback  
✅ Loading and error states  
✅ Responsive design for kiosk displays  
✅ Ready for Vercel deployment  

## Next Steps

1. Customize the student data for your dojo
2. Add your own avatars and styling
3. Set up authentication if needed
4. Configure backup and monitoring
5. Set up custom domain (optional)
