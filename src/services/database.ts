import { supabase, TABLES } from '../lib/supabase';
import { Student, AttendanceRecord } from '../types';
import { storageService } from './storage';

// Database response type (snake_case)
interface DbStudent {
  id: string;
  name: string;
  avatar: string;
  classes_count: number;
  last_check_in: string | null;
  pin: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Student operations
export const studentService = {
  // Get all students
  async getAllStudents(): Promise<Student[]> {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .order('classes_count', { ascending: false });
    
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    
    // Convert snake_case to camelCase for frontend
    return (data as DbStudent[] || []).map((student: DbStudent) => ({
      id: student.id,
      name: student.name,
      avatar: student.avatar,
      classesCount: student.classes_count,
      lastCheckIn: student.last_check_in ? new Date(student.last_check_in) : undefined,
      pin: student.pin || undefined,
      isActive: student.is_active,
    }));
  },

  // Get student by ID
  async getStudentById(id: string): Promise<Student | null> {
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching student:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Convert snake_case to camelCase for frontend
    const studentData = data as DbStudent;
    return {
      id: studentData.id,
      name: studentData.name,
      avatar: studentData.avatar,
      classesCount: studentData.classes_count,
      lastCheckIn: studentData.last_check_in ? new Date(studentData.last_check_in) : undefined,
      pin: studentData.pin || undefined,
      isActive: studentData.is_active,
    };
  },

  // Add new student (admin only)
  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    let avatarUrl = student.avatar;

    // If avatar is a blob URL, upload it to Supabase storage
    if (student.avatar.startsWith('blob:')) {
      try {
        // Generate a temporary ID for the upload
        const tempId = `temp-${Date.now()}`;
        avatarUrl = await storageService.uploadAvatarFromBlob(student.avatar, tempId);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        // Continue with the blob URL as fallback
        avatarUrl = student.avatar;
      }
    }

    // Convert camelCase to snake_case for database
    const dbStudent = {
      name: student.name,
      avatar: avatarUrl,
      classes_count: student.classesCount,
      last_check_in: student.lastCheckIn,
      pin: student.pin,
      is_active: student.isActive,
    };

    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .insert([dbStudent])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding student:', error);
      throw error;
    }
    
    // If we successfully uploaded to storage, update the avatar URL with the real student ID
    if (student.avatar.startsWith('blob:') && avatarUrl !== student.avatar) {
      try {
        const newStudentData = data as DbStudent;
        const newAvatarUrl = await storageService.uploadAvatarFromBlob(student.avatar, newStudentData.id);
        
        // Update the student record with the correct avatar URL
        const { error: updateError } = await supabase
          .from(TABLES.STUDENTS)
          .update({ avatar: newAvatarUrl })
          .eq('id', newStudentData.id);

        if (updateError) {
          console.error('Error updating avatar URL:', updateError);
        } else {
          avatarUrl = newAvatarUrl;
        }
      } catch (error) {
        console.error('Error updating avatar with correct ID:', error);
      }
    }
    
    // Convert snake_case back to camelCase for frontend
    const newStudent = data as DbStudent;
    return {
      id: newStudent.id,
      name: newStudent.name,
      avatar: avatarUrl,
      classesCount: newStudent.classes_count,
      lastCheckIn: newStudent.last_check_in ? new Date(newStudent.last_check_in) : undefined,
      pin: newStudent.pin || undefined,
      isActive: newStudent.is_active,
    };
  },

  // Update student (admin only)
  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required to update students');
    }

    let avatarUrl = updates.avatar;

    // If updating avatar and it's a blob URL, upload it to Supabase storage
    if (updates.avatar && updates.avatar.startsWith('blob:')) {
      try {
        avatarUrl = await storageService.uploadAvatarFromBlob(updates.avatar, id);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        // Continue with the blob URL as fallback
        avatarUrl = updates.avatar;
      }
    }

    // Convert camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.avatar !== undefined) dbUpdates.avatar = avatarUrl;
    if (updates.classesCount !== undefined) dbUpdates.classes_count = updates.classesCount;
    if (updates.lastCheckIn !== undefined) dbUpdates.last_check_in = updates.lastCheckIn;
    if (updates.pin !== undefined) dbUpdates.pin = updates.pin;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }
    
    // Convert snake_case back to camelCase for frontend
    const updatedStudent = data as DbStudent;
    return {
      id: updatedStudent.id,
      name: updatedStudent.name,
      avatar: avatarUrl || updatedStudent.avatar,
      classesCount: updatedStudent.classes_count,
      lastCheckIn: updatedStudent.last_check_in ? new Date(updatedStudent.last_check_in) : undefined,
      pin: updatedStudent.pin || undefined,
      isActive: updatedStudent.is_active,
    };
  },

  // Delete student (admin only)
  async deleteStudent(id: string): Promise<void> {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required to delete students');
    }

    const { error } = await supabase
      .from(TABLES.STUDENTS)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // Check in student (increment class count and update last check-in)
  async checkInStudent(id: string): Promise<Student> {
    // First get the current student to increment the count
    const { data: currentStudent, error: fetchError } = await supabase
      .from(TABLES.STUDENTS)
      .select('classes_count')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching current student:', fetchError);
      throw fetchError;
    }

    const newClassCount = (currentStudent.classes_count || 0) + 1;

    // Update the student with new count and last check-in
    const { data, error } = await supabase
      .from(TABLES.STUDENTS)
      .update({
        classes_count: newClassCount,
        last_check_in: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error checking in student:', error);
      throw error;
    }
    
    // Convert snake_case back to camelCase for frontend
    const checkedInStudent = data as DbStudent;
    return {
      id: checkedInStudent.id,
      name: checkedInStudent.name,
      avatar: checkedInStudent.avatar,
      classesCount: checkedInStudent.classes_count,
      lastCheckIn: checkedInStudent.last_check_in ? new Date(checkedInStudent.last_check_in) : undefined,
      pin: checkedInStudent.pin || undefined,
      isActive: checkedInStudent.is_active,
    };
  },
};

// Attendance operations
export const attendanceService = {
  // Get attendance records for a student
  async getAttendanceByStudent(studentId: string): Promise<AttendanceRecord[]> {
    const { data, error } = await supabase
      .from(TABLES.ATTENDANCE)
      .select('*')
      .eq('student_id', studentId)
      .order('check_in_time', { ascending: false });
    
    if (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
    
    return data || [];
  },

  // Record attendance
  async recordAttendance(studentId: string): Promise<AttendanceRecord> {
    const attendanceRecord = {
      student_id: studentId,
      check_in_time: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    const { data, error } = await supabase
      .from(TABLES.ATTENDANCE)
      .insert([attendanceRecord])
      .select()
      .single();
    
    if (error) {
      console.error('Error recording attendance:', error);
      throw error;
    }
    
    return data;
  },

  // Get attendance statistics
  async getAttendanceStats(): Promise<{ totalCheckIns: number; todayCheckIns: number }> {
    const today = new Date().toISOString().split('T')[0];
    
    const [totalResult, todayResult] = await Promise.all([
      supabase.from(TABLES.ATTENDANCE).select('id', { count: 'exact' }),
      supabase.from(TABLES.ATTENDANCE).select('id', { count: 'exact' }).eq('date', today),
    ]);

    return {
      totalCheckIns: totalResult.count || 0,
      todayCheckIns: todayResult.count || 0,
    };
  },
};
