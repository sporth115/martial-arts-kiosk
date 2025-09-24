import { useState, useEffect, useCallback } from 'react';
import { Student } from '../types';
import { studentService } from '../services/database';
import toast from 'react-hot-toast';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch students';
      setError(errorMessage);
      toast.error('Failed to load students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new student
  const addStudent = useCallback(async (newStudent: Omit<Student, 'id'>) => {
    try {
      setError(null);
      const student = await studentService.addStudent(newStudent);
      setStudents(prev => [student, ...prev]);
      toast.success(`${student.name} added successfully!`);
      return student;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add student';
      setError(errorMessage);
      toast.error('Failed to add student');
      throw err;
    }
  }, []);

  // Update student
  const updateStudent = useCallback(async (id: string, updates: Partial<Student>) => {
    try {
      setError(null);
      const updatedStudent = await studentService.updateStudent(id, updates);
      setStudents(prev => 
        prev.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      toast.success(`${updatedStudent.name} updated successfully!`);
      return updatedStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update student';
      setError(errorMessage);
      toast.error('Failed to update student');
      throw err;
    }
  }, []);

  // Delete student
  const deleteStudent = useCallback(async (id: string) => {
    try {
      setError(null);
      await studentService.deleteStudent(id);
      setStudents(prev => prev.filter(student => student.id !== id));
      toast.success('Student deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete student';
      setError(errorMessage);
      toast.error('Failed to delete student');
      throw err;
    }
  }, []);

  // Check in student
  const checkInStudent = useCallback(async (id: string) => {
    try {
      setError(null);
      const updatedStudent = await studentService.checkInStudent(id);
      setStudents(prev => 
        prev.map(student => 
          student.id === id ? updatedStudent : student
        )
      );
      
      const student = students.find(s => s.id === id);
      toast.success(`${student?.name} checked in successfully! 🥋`);
      return updatedStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check in student';
      setError(errorMessage);
      toast.error('Failed to check in student');
      throw err;
    }
  }, [students]);

  // Load students on mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    checkInStudent,
    refetch: fetchStudents,
  };
};
