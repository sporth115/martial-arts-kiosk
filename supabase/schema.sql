-- Martial Arts Kiosk Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT DEFAULT '🥋',
    classes_count INTEGER DEFAULT 0,
    last_check_in TIMESTAMPTZ,
    pin TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to increment class count
CREATE OR REPLACE FUNCTION increment_classes_count(student_id UUID)
RETURNS INTEGER AS $$
DECLARE
    current_count INTEGER;
BEGIN
    SELECT classes_count INTO current_count 
    FROM students 
    WHERE id = student_id;
    
    RETURN COALESCE(current_count, 0) + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to students (for kiosk display)
CREATE POLICY "Allow public read access to students" ON students
    FOR SELECT USING (is_active = true);

-- Allow public insert for attendance records (for check-ins)
CREATE POLICY "Allow public insert attendance" ON attendance_records
    FOR INSERT WITH CHECK (true);

-- Allow public read access to attendance records
CREATE POLICY "Allow public read attendance" ON attendance_records
    FOR SELECT USING (true);

-- Admin operations require authentication
-- Allow authenticated users to insert, update, delete students
CREATE POLICY "Allow authenticated users to modify students" ON students
    FOR ALL USING (auth.role() = 'authenticated');

-- Storage policies for avatars bucket
CREATE POLICY "Allow public read access to avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated users to upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to update avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Allow authenticated users to delete avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
    );

-- Create admin user (run this in Supabase Auth > Users > Invite User)
-- Or use the sign-up form in the app to create your first admin account
-- 
-- Note: After creating your first admin user, you may want to disable
-- public sign-ups in Supabase Auth settings for security



-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_classes_count ON students(classes_count DESC);
CREATE INDEX IF NOT EXISTS idx_students_active ON students(is_active);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in_time ON attendance_records(check_in_time DESC);
