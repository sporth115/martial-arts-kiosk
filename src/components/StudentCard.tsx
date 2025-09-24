import React from 'react';
import { motion } from 'framer-motion';
import { Student } from '../types';
import { getBadgeForClassCount } from '../utils/badgeSystem';

interface StudentCardProps {
  student: Student;
  onCheckIn: (student: Student) => void;
  isCheckingIn?: boolean;
  isTopStudent?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  onCheckIn, 
  isCheckingIn = false,
  isTopStudent = false
}) => {
  const badge = getBadgeForClassCount(student.classesCount);
  
  // Avatar size based on whether it's a top student
  const avatarSize = isTopStudent ? '100px' : '60px';
  const fontSize = isTopStudent ? '64px' : '48px';

  return (
    <motion.div
      className="student-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onCheckIn(student)}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
        opacity: isCheckingIn ? 0.7 : 1,
        pointerEvents: isCheckingIn ? 'none' : 'auto',
      }}
    >
      <motion.div
        className="avatar"
        style={{
          fontSize: (student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) ? 'auto' : fontSize,
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: avatarSize,
        }}
        animate={isCheckingIn ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 0.6 }}
      >
        {(student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) ? (
          <img
            src={student.avatar}
            alt={student.name}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: '50%',
              objectFit: 'cover',
              border: isTopStudent ? '4px solid rgba(255, 255, 255, 0.9)' : '3px solid rgba(255, 255, 255, 0.8)',
              boxShadow: isTopStudent ? '0 6px 20px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          />
        ) : student.avatar ? (
          student.avatar
        ) : (
          <div style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            border: isTopStudent ? '4px solid rgba(255, 255, 255, 0.6)' : '3px solid rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: isTopStudent ? '48px' : '32px',
          }}>
            ?
          </div>
        )}
      </motion.div>
      
      <h3 style={{ 
        color: 'white', 
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}>
        {student.name}
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '8px',
      }}>
        <span style={{ 
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          {student.classesCount} classes
        </span>
        <span style={{ fontSize: '20px' }}>
          {badge.icon}
        </span>
      </div>
      
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '8px',
        padding: '4px 8px',
        fontSize: '12px',
        color: 'white',
        fontWeight: '500',
      }}>
        {badge.type.toUpperCase()} BADGE
      </div>
    </motion.div>
  );
};

export default StudentCard;
