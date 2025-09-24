import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Sparkles, Search, Filter, MoreVertical } from 'lucide-react';
import { Student } from '../types';
import AvatarGenerator from './AvatarGenerator';

interface StudentsManagementProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentsManagement: React.FC<StudentsManagementProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    pin: '',
    classesCount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that an avatar is selected
    if (!formData.avatar) {
      alert('Please generate an AI avatar before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await onUpdateStudent(editingStudent, formData);
      } else {
        await onAddStudent({
          ...formData,
          lastCheckIn: undefined,
          isActive: true,
        });
      }
      
      setFormData({ name: '', avatar: '', pin: '', classesCount: 0 });
      setShowAddForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error handling is done in the hook with toast notifications
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      avatar: student.avatar,
      pin: student.pin || '',
      classesCount: student.classesCount,
    });
    setEditingStudent(student.id);
    setShowAddForm(true);
  };

  const handleAvatarGenerated = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const handleDeleteStudent = async (studentId: string) => {
    setDeletingStudentId(studentId);
    try {
      await onDeleteStudent(studentId);
    } catch (error) {
      console.error('Error deleting student:', error);
      // Error handling is done in the hook with toast notifications
    } finally {
      setDeletingStudentId(null);
    }
  };

  // Avatar options removed - only AI generation will be used

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      color: 'white',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Students Management
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            margin: '8px 0 0 0',
            fontSize: '16px',
          }}>
            Manage your dojo students and their information
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 24px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          <Plus size={20} />
          Add Student
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.border = '1px solid rgba(102, 126, 234, 0.5)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.border = '1px solid rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: showFilters ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          <Filter size={20} />
          Filters
        </motion.button>
      </div>

      {/* Students Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px',
      }}>
        {filteredStudents.map((student) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.3)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <div style={{
                fontSize: (student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) ? 'auto' : '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '50%',
                border: '2px solid rgba(102, 126, 234, 0.3)',
              }}>
                {(student.avatar.startsWith('http') || student.avatar.startsWith('blob:')) ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : student.avatar ? (
                  student.avatar
                ) : (
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '24px',
                  }}>
                    ?
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 4px 0',
                  color: 'white',
                }}>
                  {student.name}
                </h3>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  fontSize: '14px',
                }}>
                  {student.pin ? `PIN: ${student.pin}` : 'No PIN set'}
                </p>
              </div>
              
              <button
                onClick={() => handleEdit(student)}
                style={{
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#667eea',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                }}
              >
                <MoreVertical size={16} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '12px',
                flex: 1,
                marginRight: '8px',
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#667eea',
                }}>
                  {student.classesCount}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}>
                  Classes
                </div>
              </div>
              
              <div style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                flex: 1,
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#22c55e',
                  fontWeight: 'bold',
                }}>
                  {student.lastCheckIn 
                    ? new Date(student.lastCheckIn).toLocaleDateString()
                    : 'Never'
                  }
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}>
                  Last Check-in
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
            }}>
              <button
                onClick={() => handleEdit(student)}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  flex: 1,
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#5a67d8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#667eea';
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteStudent(student.id)}
                disabled={deletingStudentId === student.id}
                style={{
                  background: deletingStudentId === student.id ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  cursor: deletingStudentId === student.id ? 'not-allowed' : 'pointer',
                  flex: 1,
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
                onMouseOver={(e) => {
                  if (deletingStudentId !== student.id) {
                    e.currentTarget.style.background = '#b91c1c';
                  }
                }}
                onMouseOut={(e) => {
                  if (deletingStudentId !== student.id) {
                    e.currentTarget.style.background = '#dc2626';
                  }
                }}
              >
                {deletingStudentId === student.id ? (
                  <>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Student Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <h2 style={{
                color: 'white',
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
              }}>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingStudent(null);
                  setFormData({ name: '', avatar: '', pin: '', classesCount: 0 });
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  display: 'block',
                }}>
                  Student Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(102, 126, 234, 0.5)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  display: 'block',
                }}>
                  PIN (Optional)
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="4-digit PIN"
                  maxLength={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(102, 126, 234, 0.5)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  display: 'block',
                }}>
                  Initial Class Count
                </label>
                <input
                  type="number"
                  value={formData.classesCount}
                  onChange={(e) => setFormData({ ...formData, classesCount: parseInt(e.target.value) || 0 })}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(102, 126, 234, 0.5)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                {/* Current Avatar Display */}
                <div style={{
                  marginBottom: '15px',
                  textAlign: 'center',
                  padding: '15px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}>
                    Current Avatar:
                  </div>
                  <div style={{
                    fontSize: (formData.avatar.startsWith('http') || formData.avatar.startsWith('blob:')) ? 'auto' : '48px',
                    minHeight: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {(formData.avatar.startsWith('http') || formData.avatar.startsWith('blob:')) ? (
                      <img
                        src={formData.avatar}
                        alt="Generated avatar"
                        style={{
                          maxWidth: '120px',
                          maxHeight: '120px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                      />
                    ) : formData.avatar ? (
                      formData.avatar
                    ) : (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '3px dashed rgba(102, 126, 234, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '48px',
                      }}>
                        ?
                      </div>
                    )}
                  </div>
                </div>
                
                <label style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  display: 'block',
                }}>
                  Avatar
                </label>
                
                {/* AI Avatar Generator Button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowAvatarGenerator(true)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      margin: '0 auto',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    <Sparkles size={20} />
                    AI Avatar Studio
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <button
                  type="submit"
                  disabled={!formData.avatar || isSubmitting}
                  style={{
                    background: (formData.avatar && !isSubmitting)
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px 28px',
                    color: (formData.avatar && !isSubmitting) ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    cursor: (formData.avatar && !isSubmitting) ? 'pointer' : 'not-allowed',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    flex: 1,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseOver={(e) => {
                    if (formData.avatar && !isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (formData.avatar && !isSubmitting) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
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
                      {editingStudent ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {editingStudent ? 'Update Student' : 'Add Student'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Avatar Generator Modal */}
      {showAvatarGenerator && (
        <AvatarGenerator
          onAvatarGenerated={handleAvatarGenerated}
          onClose={() => setShowAvatarGenerator(false)}
        />
      )}

      {/* CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default StudentsManagement;
