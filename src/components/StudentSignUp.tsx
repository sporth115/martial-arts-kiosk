import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Sparkles, Save } from 'lucide-react';
import AvatarGenerator from './AvatarGenerator';
import toast from 'react-hot-toast';

interface StudentSignUpProps {
  onAddStudent: (student: Omit<any, 'id'>) => Promise<any>;
  onClose: () => void;
}

const StudentSignUp: React.FC<StudentSignUpProps> = ({ onAddStudent, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    avatar: '',
  });
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.avatar) {
      toast.error('Please generate an AI avatar');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddStudent({
        name: formData.name.trim(),
        pin: formData.pin || undefined,
        avatar: formData.avatar,
        classesCount: 0,
        lastCheckIn: undefined,
        isActive: true,
      });
      
      toast.success(`Welcome to the dojo, ${formData.name}! 🥋`);
      onClose();
    } catch (error) {
      console.error('Error creating student:', error);
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarGenerated = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    setShowAvatarGenerator(false);
  };

  return (
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
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          width: '90%',
          maxWidth: '500px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}>
            Join the Dojo
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            margin: 0,
          }}>
            Create your student profile and start your martial arts journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
            }}>
              Your Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 52px',
                  fontSize: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* PIN Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
            }}>
              PIN (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              />
              <input
                type="password"
                name="pin"
                value={formData.pin}
                onChange={handleInputChange}
                placeholder="Enter a 4-digit PIN (optional)"
                maxLength={4}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 52px',
                  fontSize: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  outline: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Avatar Section */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Avatar *
            </label>
            
            {/* Current Avatar Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
              }}>
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Generated Avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '32px',
                    fontWeight: 'bold',
                  }}>
                    ?
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setShowAvatarGenerator(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Sparkles size={16} />
                {formData.avatar ? 'Generate New Avatar' : 'AI Avatar Studio'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.avatar || isSubmitting}
              style={{
                background: (formData.name.trim() && formData.avatar && !isSubmitting)
                  ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                color: (formData.name.trim() && formData.avatar && !isSubmitting) ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: (formData.name.trim() && formData.avatar && !isSubmitting) ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold',
                flex: 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  Joining Dojo...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Join the Dojo
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '16px 24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* CSS for spinner animation */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            input::placeholder {
              color: rgba(255, 255, 255, 0.6) !important;
            }
            input::-webkit-input-placeholder {
              color: rgba(255, 255, 255, 0.6) !important;
            }
            input::-moz-placeholder {
              color: rgba(255, 255, 255, 0.6) !important;
            }
            input:-ms-input-placeholder {
              color: rgba(255, 255, 255, 0.6) !important;
            }
          `}
        </style>
      </motion.div>

      {/* Avatar Generator Modal */}
      <AnimatePresence>
        {showAvatarGenerator && (
          <AvatarGenerator
            onAvatarGenerated={handleAvatarGenerated}
            onClose={() => setShowAvatarGenerator(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentSignUp;
