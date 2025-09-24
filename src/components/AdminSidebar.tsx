import React from 'react';
import { motion } from 'framer-motion';
import { Users, Home, LogOut, ChevronRight } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminSidebarProps {
  user: User;
  activeView: 'dashboard' | 'students';
  onViewChange: (view: 'dashboard' | 'students') => void;
  onSignOut: () => void;
  onNavigateToKiosk: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  activeView,
  onViewChange,
  onSignOut,
  onNavigateToKiosk,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Statistics',
    },
    {
      id: 'students' as const,
      label: 'Students',
      icon: Users,
      description: 'Manage Students',
    },
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        width: '280px',
        height: '100vh',
        background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        borderRight: '1px solid rgba(102, 126, 234, 0.2)',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
        background: 'rgba(102, 126, 234, 0.05)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          }}>
            🥋
          </div>
          <div>
            <h2 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Dojo Admin
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              margin: 0,
            }}>
              Management Portal
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(102, 126, 234, 0.2)',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#4ade80',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            fontWeight: '500',
          }}>
            {user.email}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{
        flex: 1,
        padding: '20px 0',
        overflowY: 'auto',
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onViewChange(item.id)}
                style={{
                  width: '100%',
                  background: isActive 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                    : 'transparent',
                  border: 'none',
                  padding: '16px 20px',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }
                }}
              >
                <Icon 
                  size={20} 
                  style={{
                    color: isActive ? '#667eea' : 'rgba(255, 255, 255, 0.6)',
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.5))' : 'none',
                  }}
                />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    marginBottom: '2px',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    opacity: 0.6,
                  }}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight 
                    size={16} 
                    style={{ color: '#667eea' }}
                  />
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <button
          onClick={onNavigateToKiosk}
          style={{
            background: 'rgba(102, 126, 234, 0.1)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          <span style={{ fontSize: '16px' }}>←</span>
          Back to Kiosk
        </button>
        
        <button
          onClick={onSignOut}
          style={{
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </motion.div>
  );
};

export default AdminSidebar;
