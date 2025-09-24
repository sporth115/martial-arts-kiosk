import React from 'react';
import { motion } from 'framer-motion';
import { Student } from '../types';
import { getBadgeForClassCount } from '../utils/badgeSystem';
import './ChiAnimations.css';

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
  
  // Get border color based on badge level
  const getBorderColor = () => {
    switch (badge.type) {
      case 'gold':
        return 'rgba(255, 215, 0, 0.9)'; // Gold
      case 'silver':
        return 'rgba(192, 192, 192, 0.9)'; // Silver
      case 'bronze':
        return 'rgba(205, 127, 50, 0.9)'; // Bronze
      case 'star':
        return 'rgba(135, 206, 235, 0.9)'; // Light blue for star
      default:
        return 'rgba(255, 255, 255, 0.8)';
    }
  };
  
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
        {/* Chi Energy Bubbles Rising Up - More bubbles with random movements */}
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '20%',
          left: '30%',
          width: '15px',
          height: '15px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 1), rgba(255, 215, 0, 0.6))',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
          animation: 'chi-rise-random 3s ease-in-out infinite',
          zIndex: 10,
          border: '1px solid rgba(255, 215, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '15%',
          right: '25%',
          width: '12px',
          height: '12px',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 1), rgba(255, 69, 0, 0.6))',
          borderRadius: '50%',
          boxShadow: '0 0 15px rgba(255, 69, 0, 0.8), 0 0 30px rgba(255, 69, 0, 0.4)',
          animation: 'chi-rise-random 3.5s ease-in-out infinite 0.8s',
          zIndex: 10,
          border: '1px solid rgba(255, 69, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '25%',
          left: '60%',
          width: '18px',
          height: '18px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9), rgba(255, 215, 0, 0.5))',
          borderRadius: '50%',
          boxShadow: '0 0 25px rgba(255, 215, 0, 0.7), 0 0 50px rgba(255, 215, 0, 0.3)',
          animation: 'chi-rise-random 4.2s ease-in-out infinite 1.5s',
          zIndex: 10,
          border: '1px solid rgba(255, 215, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '10%',
          left: '45%',
          width: '10px',
          height: '10px',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 1), rgba(255, 69, 0, 0.6))',
          borderRadius: '50%',
          boxShadow: '0 0 12px rgba(255, 69, 0, 0.8), 0 0 24px rgba(255, 69, 0, 0.4)',
          animation: 'chi-rise-random 3.8s ease-in-out infinite 2.2s',
          zIndex: 10,
          border: '1px solid rgba(255, 69, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '30%',
          right: '40%',
          width: '20px',
          height: '20px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.4))',
          borderRadius: '50%',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3)',
          animation: 'chi-rise-random 4.5s ease-in-out infinite 0.3s',
          zIndex: 10,
          border: '1px solid rgba(255, 215, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '18%',
          left: '15%',
          width: '8px',
          height: '8px',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.9), rgba(255, 69, 0, 0.5))',
          borderRadius: '50%',
          boxShadow: '0 0 10px rgba(255, 69, 0, 0.7), 0 0 20px rgba(255, 69, 0, 0.3)',
          animation: 'chi-rise-random 2.8s ease-in-out infinite 3.1s',
          zIndex: 10,
          border: '1px solid rgba(255, 69, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '22%',
          right: '15%',
          width: '14px',
          height: '14px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.7), rgba(255, 215, 0, 0.3))',
          borderRadius: '50%',
          boxShadow: '0 0 18px rgba(255, 215, 0, 0.6), 0 0 36px rgba(255, 215, 0, 0.3)',
          animation: 'chi-rise-random 3.2s ease-in-out infinite 1.8s',
          zIndex: 10,
          border: '1px solid rgba(255, 215, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '12%',
          left: '75%',
          width: '16px',
          height: '16px',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.8), rgba(255, 69, 0, 0.4))',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(255, 69, 0, 0.6), 0 0 40px rgba(255, 69, 0, 0.3)',
          animation: 'chi-rise-random 4.8s ease-in-out infinite 2.5s',
          zIndex: 10,
          border: '1px solid rgba(255, 69, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '28%',
          left: '35%',
          width: '11px',
          height: '11px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 1), rgba(255, 215, 0, 0.6))',
          borderRadius: '50%',
          boxShadow: '0 0 14px rgba(255, 215, 0, 0.8), 0 0 28px rgba(255, 215, 0, 0.4)',
          animation: 'chi-rise-random 3.6s ease-in-out infinite 0.5s',
          zIndex: 10,
          border: '1px solid rgba(255, 215, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '8%',
          right: '30%',
          width: '13px',
          height: '13px',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.9), rgba(255, 69, 0, 0.5))',
          borderRadius: '50%',
          boxShadow: '0 0 16px rgba(255, 69, 0, 0.7), 0 0 32px rgba(255, 69, 0, 0.3)',
          animation: 'chi-rise-random 3.9s ease-in-out infinite 1.2s',
          zIndex: 10,
          border: '1px solid rgba(255, 69, 0, 0.5)',
        }} />
        
        <div className="chi-bubble" style={{
          position: 'absolute',
          bottom: '35%',
          left: '80%',
          width: '9px',
          height: '9px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0.4))',
          borderRadius: '50%',
          boxShadow: '0 0 12px rgba(255, 215, 0, 0.6), 0 0 24px rgba(255, 215, 0, 0.3)',
          animation: 'chi-rise-random 2.5s ease-in-out infinite 3.8s',
          zIndex: 10,
          border: '1px solid rgba(255, 215, 0, 0.5)',
        }} />
        
        <motion.div
          className="avatar"
          style={{
            fontSize: (student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) ? 'auto' : fontSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: avatarSize,
            position: 'relative',
            zIndex: 2,
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
              borderRadius: '10%',
              objectFit: 'cover',
              border: `4px solid ${getBorderColor()}`,
              boxShadow: `
                0 0 15px ${getBorderColor().replace('0.9', '0.4')},
                0 0 25px ${getBorderColor().replace('0.9', '0.2')},
                0 6px 20px rgba(0, 0, 0, 0.3),
                inset 0 0 15px rgba(255, 255, 255, 0.15)
              `,
              filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ) : student.avatar ? (
          <div style={{
            fontSize: '60px',
            filter: `drop-shadow(0 0 8px ${getBorderColor().replace('0.9', '0.5')})`,
            textShadow: `0 0 12px ${getBorderColor().replace('0.9', '0.6')}`,
          }}>
            {student.avatar}
          </div>
        ) : (
          <div style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${getBorderColor().replace('0.9', '0.3')}, ${getBorderColor().replace('0.9', '0.2')})`,
            border: `4px solid ${getBorderColor()}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getBorderColor(),
            fontSize: '60px',
            boxShadow: `
              0 0 15px ${getBorderColor().replace('0.9', '0.3')},
              0 6px 20px rgba(0, 0, 0, 0.25),
              inset 0 0 15px rgba(255, 255, 255, 0.15)
            `,
            textShadow: `0 0 10px ${getBorderColor().replace('0.9', '0.6')}`,
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
