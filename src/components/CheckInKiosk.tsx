import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Student } from '../types';
import { getTopStudents } from '../utils/badgeSystem';

interface CheckInKioskProps {
  students: Student[];
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onCheckInStudent: (id: string) => Promise<Student>;
}

const CheckInKiosk: React.FC<CheckInKioskProps> = ({ students, onUpdateStudent, onCheckInStudent }) => {
  const [_, setFilteredStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkingInStudent, setCheckingInStudent] = useState<string | null>(null);

  // Get top 5 students for featured display

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // When no search query, show all students (including top 5)
      setFilteredStudents(students.filter(student => student.isActive));
    } else {
      // When searching, show all matching students (including top 5 if they match)
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        student.isActive
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <Toaster position="top-center" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 'bold',
          marginBottom: '10px',
          textShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}>
          Student Check-In
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '1.2rem',
          margin: 0,
        }}>
          Tap your avatar to check in for class!
        </p>
      </motion.div>
      
    </div>
  );
};

export default CheckInKiosk;
