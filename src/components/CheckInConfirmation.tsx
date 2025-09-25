import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Award } from 'lucide-react';

interface CheckInConfirmationProps {
  isOpen: boolean;
  student: Student | null;
  onConfirm: () => void;
  onCancel: () => void;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  classesCount: number;
  lastCheckIn?: Date;
  pin?: string;
  isActive: boolean;
}

const CheckInConfirmation: React.FC<CheckInConfirmationProps> = ({
  isOpen,
  student,
  onConfirm,
  onCancel
}) => {
  if (!student) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            backdropFilter: 'blur(10px)',
          }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(50, 50, 50, 0.95))',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px auto',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                }}
              >
                <User size={30} color="white" />
              </motion.div>
              <h2 style={{
                color: 'white',
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: 'bold',
              }}>
                Confirm Check-In
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontSize: '14px',
              }}>
                Ready to start your training?
              </p>
            </div>

            {/* Student Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: student.avatar.startsWith('http') || student.avatar.startsWith('blob:') 
                    ? `url(${student.avatar})` 
                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}>
                  {!(student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) && (
                    <span style={{ fontSize: '24px' }}>{student.avatar}</span>
                  )}
                </div>
                <div>
                  <h3 style={{
                    color: 'white',
                    margin: '0 0 5px 0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}>
                    {student.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                    <Award size={16} style={{ marginRight: '5px' }} />
                    <span style={{ fontSize: '14px' }}>
                      {student.classesCount} classes completed
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              }}>
                <Calendar size={16} style={{ marginRight: '8px' }} />
                <span>
                  {student.lastCheckIn 
                    ? `Last check-in: ${formatDate(student.lastCheckIn)} at ${formatTime(student.lastCheckIn)}`
                    : 'First time checking in!'
                  }
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
            }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(76, 175, 80, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                }}
              >
                Yes, Check In!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckInConfirmation;
