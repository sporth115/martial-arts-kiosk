export interface Student {
  id: string;
  name: string;
  avatar: string;
  classesCount: number;
  lastCheckIn?: Date;
  pin?: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  checkInTime: Date;
  date: string;
}

export type BadgeType = 'bronze' | 'silver' | 'gold';

export interface Badge {
  type: BadgeType;
  threshold: number;
  icon: string;
  color: string;
}
