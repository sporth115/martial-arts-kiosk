import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import StudentCard from './StudentCard';
import SearchBar from './SearchBar';
import { Student } from '../types';
import { getTopStudents } from '../utils/badgeSystem';

interface CheckInKioskProps {
  students: Student[];
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onCheckInStudent: (id: string) => Promise<Student>;
}

const CheckInKiosk: React.FC<CheckInKioskProps> = ({ students, onUpdateStudent, onCheckInStudent }) => {
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkingInStudent, setCheckingInStudent] = useState<string | null>(null);

  // Get top 5 students for featured display
  const topStudents = getTopStudents(students, 5);

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCheckIn = async (student: Student) => {
    if (checkingInStudent) return;

    setCheckingInStudent(student.id);

    try {
      // Use the Supabase check-in function
      const updatedStudent = await onCheckInStudent(student.id);
      
      // Show success animation and toast
      toast.success(
        `Welcome ${student.name}! Class #${updatedStudent.classesCount} checked in! 🥋`,
        {
          duration: 3000,
          style: {
            background: '#4CAF50',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
          },
        }
      );
    } catch (error) {
      toast.error('Failed to check in. Please try again.');
    } finally {
      setCheckingInStudent(null);
    }
  };

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

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Top 5 Students - Special Layout */}
      {searchQuery === '' && topStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '40px' }}
        >
          <h2 style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '1.8rem',
            marginBottom: '30px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
          }}>
            🏆 Top 5 Students
          </h2>
          
          {/* Top Row - 3 students */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '25px',
            marginBottom: '25px',
            flexWrap: 'wrap',
          }}>
            {topStudents.slice(0, 3).map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  width: '200px',
                  height: '200px',
                }}
              >
                <StudentCard
                  student={student}
                  onCheckIn={handleCheckIn}
                  isCheckingIn={checkingInStudent === student.id}
                  isTopStudent={true}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Bottom Row - 2 students */}
          {topStudents.length > 3 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '25px',
              flexWrap: 'wrap',
            }}>
              {topStudents.slice(3, 5).map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                  style={{
                    width: '200px',
                    height: '200px',
                  }}
                >
                  <StudentCard
                    student={student}
                    onCheckIn={handleCheckIn}
                    isCheckingIn={checkingInStudent === student.id}
                    isTopStudent={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Search Results Only */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 style={{
            color: 'white',
            textAlign: 'center',
            fontSize: '1.5rem',
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            Search Results
          </h2>
          
          <AnimatePresence>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 10px',
            }}>
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <StudentCard
                    student={student}
                    onCheckIn={handleCheckIn}
                    isCheckingIn={checkingInStudent === student.id}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: '1.2rem',
                marginTop: '40px',
              }}
            >
              No students found matching "{searchQuery}"
            </motion.div>
          )}
        </motion.div>
      )}
      
    </div>
  );
};

export default CheckInKiosk;
