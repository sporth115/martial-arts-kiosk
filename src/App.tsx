import React, { useState, useEffect } from 'react';
import CheckInKiosk from './components/CheckInKiosk';
import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';
import { useStudents } from './hooks/useStudents';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'react-hot-toast';

function App() {
  const [currentView, setCurrentView] = useState<'kiosk' | 'admin'>('kiosk');
  const { user, signOut } = useAuth();
  const { 
    students, 
    loading, 
    error, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    checkInStudent 
  } = useStudents();

  // Handle URL-based routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('kiosk');
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('kiosk');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem',
        gap: '20px',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
          Loading...
        </div>
        <div style={{
          fontSize: '16px',
          opacity: 0.8,
          textAlign: 'center',
        }}>
          Loading...
        </div>
        
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
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
      }}>
        <h2>⚠️ Connection Error</h2>
        <p>{error}</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '10px' }}>
          Please check your internet connection and Supabase configuration.
        </p>
      </div>
    );
  }

  // Show login form if trying to access admin without authentication
  if (currentView === 'admin' && !user) {
    return <LoginForm onSuccess={() => window.history.pushState({}, '', '/admin')} />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Main Content */}
      {currentView === 'kiosk' ? (
        <CheckInKiosk 
          students={students}
          onUpdateStudent={updateStudent}
          onCheckInStudent={checkInStudent}
        />
      ) : (
        <AdminPanel
          students={students}
          user={user}
          onAddStudent={addStudent}
          onUpdateStudent={updateStudent}
          onDeleteStudent={deleteStudent}
          onSignOut={() => signOut().then(() => window.history.pushState({}, '', '/'))}
          onNavigateToKiosk={() => {
            window.history.pushState({}, '', '/');
            setCurrentView('kiosk');
          }}
        />
      )}
      
      {/* Toast notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '16px',
            padding: '16px',
            borderRadius: '8px',
            zIndex: 9999,
          },
        }}
      />
    </div>
  );
}

export default App;
