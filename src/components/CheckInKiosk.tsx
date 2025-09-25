import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import StudentCard from './StudentCard';
import SearchBar from './SearchBar';
import StudentSignUp from './StudentSignUp';
import Fireworks from './Fireworks';
import CheckInConfirmation from './CheckInConfirmation';
import { Student } from '../types';
import { getTopStudents } from '../utils/badgeSystem';
import backgroundImage from '../assets/images/background.webp';

interface CheckInKioskProps {
  students: Student[];
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onCheckInStudent: (id: string) => Promise<Student>;
  onAddStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
}

const CheckInKiosk: React.FC<CheckInKioskProps> = ({ students, onUpdateStudent, onCheckInStudent, onAddStudent }) => {
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkingInStudent, setCheckingInStudent] = useState<string | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

  const handleCheckIn = (student: Student) => {
    if (checkingInStudent) return;

    // Show confirmation dialog
    setSelectedStudent(student);
    setShowConfirmation(true);
  };

  const handleConfirmCheckIn = async () => {
    if (!selectedStudent) return;

    setCheckingInStudent(selectedStudent.id);
    setShowConfirmation(false);

    try {
      // Use the Supabase check-in function
      const updatedStudent = await onCheckInStudent(selectedStudent.id);
      
      // Show fireworks celebration
      setShowFireworks(true);
      
      // Show success animation and toast
      toast.success(
        `Welcome ${selectedStudent.name}! Class #${updatedStudent.classesCount} checked in! 🥋`,
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
      setSelectedStudent(null);
    }
  };

  const handleCancelCheckIn = () => {
    setShowConfirmation(false);
    setSelectedStudent(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `
        linear-gradient(rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)),
        url(${backgroundImage})
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Toaster position="top-center" />
      
      {/* Animated overlay for video game effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
        animation: 'shimmer 3s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      
      {/* Main content with higher z-index */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative',
        }}
      >
        {/* Sign Up Button */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => setShowSignUp(true)}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          }}
        >
          <UserPlus size={16} />
          Join Dojo
        </motion.button>

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
          Tap to Power Up!
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
          {/* Top Row - 3 students */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '25px',
            marginBottom: '45px',
            flexWrap: 'wrap',
          }}>
            {topStudents.slice(0, 3).map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  width: '250px',
                  height: '250px',
                }}
              >
                <StudentCard
                  student={student}
                  onCheckIn={handleCheckIn}
                  isCheckingIn={checkingInStudent === student.id}
                  isTopStudent={true}
                  isTappable={false}
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
                    width: '250px',
                    height: '250px',
                  }}
                >
                  <StudentCard
                    student={student}
                    onCheckIn={handleCheckIn}
                    isCheckingIn={checkingInStudent === student.id}
                    isTopStudent={true}
                    isTappable={false}
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
                    isTappable={true}
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
      
      {/* Student Sign Up Modal */}
      <AnimatePresence>
        {showSignUp && (
          <StudentSignUp
            onAddStudent={onAddStudent}
            onClose={() => setShowSignUp(false)}
          />
        )}
      </AnimatePresence>

      {/* Fireworks Celebration */}
      <Fireworks 
        show={showFireworks}
        onComplete={() => setShowFireworks(false)}
      />

      {/* Check-in Confirmation Dialog */}
      <CheckInConfirmation
        isOpen={showConfirmation}
        student={selectedStudent}
        onConfirm={handleConfirmCheckIn}
        onCancel={handleCancelCheckIn}
      />
      
      {/* CSS for shimmer animation */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default CheckInKiosk;
