import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, TrendingUp, Calendar, Award, Target } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
  totalStudents: number;
  totalCheckIns: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  totalStudents,
  totalCheckIns,
}) => {
  const averageClassesPerStudent = totalStudents > 0 ? Math.round(totalCheckIns / totalStudents * 10) / 10 : 0;

  const stats = [
    {
      icon: Users,
      label: 'Total Students',
      value: totalStudents,
      color: '#4ade80',
      bgColor: 'rgba(74, 222, 128, 0.1)',
      description: 'Registered in dojo',
    },
    {
      icon: Activity,
      label: 'Total Check-ins',
      value: totalCheckIns,
      color: '#60a5fa',
      bgColor: 'rgba(96, 165, 250, 0.1)',
      description: 'Classes attended',
    },
    {
      icon: TrendingUp,
      label: 'Avg Classes',
      value: averageClassesPerStudent,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      description: 'Per student',
    },
    {
      icon: Target,
      label: 'Active Rate',
      value: '85%',
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      description: 'Student engagement',
    },
  ];

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      minHeight: '100vh',
      color: 'white',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '40px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Welcome back, Admin! 👋
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '18px',
            margin: 0,
          }}>
            Here's what's happening in your dojo today
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = `${stat.color}40`;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '100px',
                height: '100px',
                background: `radial-gradient(circle, ${stat.bgColor} 0%, transparent 70%)`,
                borderRadius: '50%',
                transform: 'translate(30px, -30px)',
              }} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: stat.bgColor,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${stat.color}30`,
                }}>
                  <Icon size={28} style={{ color: stat.color }} />
                </div>
                
                <div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                    color: stat.color,
                  }}>
                    {stat.value}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    margin: 0,
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}>
                    {stat.description}
                  </p>
                </div>
              </div>
              
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: 0,
                color: 'white',
              }}>
                {stat.label}
              </h4>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 20px 0',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <Award size={24} style={{ color: '#f59e0b' }} />
          Quick Actions
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            textAlign: 'center',
          }}>
            <Users size={32} style={{ color: '#667eea', marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: 'white',
            }}>
              Manage Students
            </h3>
            <p style={{
              fontSize: '12px',
              margin: 0,
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Add, edit, or remove student profiles
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            textAlign: 'center',
          }}>
            <Calendar size={32} style={{ color: '#4ade80', marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: 'white',
            }}>
              View Schedule
            </h3>
            <p style={{
              fontSize: '12px',
              margin: 0,
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              Check class schedules and attendance
            </p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textAlign: 'center',
          }}>
            <TrendingUp size={32} style={{ color: '#f59e0b', marginBottom: '12px' }} />
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: 'white',
            }}>
              Analytics
            </h3>
            <p style={{
              fontSize: '12px',
              margin: 0,
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              View detailed reports and insights
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;