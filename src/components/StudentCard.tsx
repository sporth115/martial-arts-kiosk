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
  const avatarSize = isTopStudent ? '200px' : '200px';
  const fontSize = isTopStudent ? '80px' : '80px';

  return (
    <motion.div
      className="student-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onCheckIn(student)}
      style={{
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: isCheckingIn ? 0.7 : 1,
        pointerEvents: isCheckingIn ? 'none' : 'auto',
      }}
    >
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <motion.div
          className="avatar"
          style={{
            fontSize: (student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) ? 'auto' : fontSize,
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
              border: isTopStudent ? '3px solid rgba(255, 255, 255, 0.9)' : '3px solid rgba(255, 255, 255, 0.8)',
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
            border: isTopStudent ? '3px solid rgba(255, 255, 255, 0.6)' : '3px solid rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: isTopStudent ? '60px' : '48px',
          }}>
            ?
          </div>
        )}
      </motion.div>
      
      {/* Badge Overlay */}
      {badge.imageUrl && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          zIndex: 10,
        }}>
          <img
            src={badge.imageUrl}
            alt={`${badge.type} badge`}
            style={{
              width: '64px',
              height: '64px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
        </div>
      )}
      </div>
      
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
        marginBottom: '8px',
      }}>
        <span style={{ 
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          {student.classesCount} classes
        </span>
      </div>
    </motion.div>
  );
};

export default StudentCard;
