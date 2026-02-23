export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  NOT_APPLIED = 'Not Applied',
  APPLIED = 'Applied',
  UNDER_REVIEW = 'Under Review',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student extends User {
  phone: string;
  program: string;
  category: string;
  status: ApplicationStatus;
  enrollmentDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  trend?: string;
  positive?: boolean;
}