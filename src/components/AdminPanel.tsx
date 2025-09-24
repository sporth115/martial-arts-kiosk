import React, { useState } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { Student } from '../types';
import AdminSidebar from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import StudentsManagement from './StudentsManagement';

interface AdminPanelProps {
  students: Student[];
  user: AuthUser | null;
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (id: string, updates: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onSignOut: () => void;
  onNavigateToKiosk: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  students,
  user,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSignOut,
  onNavigateToKiosk,
}) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'students'>('dashboard');

  // Don't render if no user (shouldn't happen due to App logic, but for safety)
  if (!user) {
    return null;
  }

  const totalCheckIns = students.reduce((sum, student) => sum + student.classesCount, 0);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
    }}>
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        onSignOut={onSignOut}
        onNavigateToKiosk={onNavigateToKiosk}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '280px', // Sidebar width
        overflow: 'auto',
      }}>
        {activeView === 'dashboard' ? (
          <AdminDashboard
            user={user}
            totalStudents={students.length}
            totalCheckIns={totalCheckIns}
          />
        ) : (
          <StudentsManagement
            students={students}
            onAddStudent={onAddStudent}
            onUpdateStudent={onUpdateStudent}
            onDeleteStudent={onDeleteStudent}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;