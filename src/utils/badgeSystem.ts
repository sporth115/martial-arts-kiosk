import { Badge } from '../types';

export const getBadgeForClassCount = (classCount: number): Badge => {
  if (classCount >= 12) {
    return {
      type: 'gold',
      threshold: 12,
      icon: '🥇',
      color: '#FFD700',
    };
  } else if (classCount >= 10) {
    return {
      type: 'silver',
      threshold: 10,
      icon: '🥈',
      color: '#C0C0C0',
    };
  } else if (classCount >= 8) {
    return {
      type: 'bronze',
      threshold: 8,
      icon: '🥉',
      color: '#CD7F32',
    };
  } else {
    return {
      type: 'bronze',
      threshold: 0,
      icon: '⭐',
      color: '#87CEEB',
    };
  }
};

export const getTopStudents = (students: any[], count: number = 4) => {
  return students
    .filter(student => student.isActive)
    .sort((a, b) => b.classesCount - a.classesCount)
    .slice(0, count);
};
