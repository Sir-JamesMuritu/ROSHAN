import { Program, Announcement, Student, UserRole, ApplicationStatus } from './types';
import { 
  BarChart, 
  BrainCircuit, 
  Database, 
  FileSpreadsheet, 
  LineChart, 
  PieChart, 
  Code, 
  Smartphone,
  PenTool
} from 'lucide-react';

export const PROGRAMS: Program[] = [
  { id: 'ai', title: 'Artificial Intelligence', description: 'Master ML models, Neural Networks, and AI ethics for real-world applications.', icon: 'BrainCircuit' },
  { id: 'da', title: 'Data Analysis', description: 'Transform raw data into actionable insights using modern statistical methods.', icon: 'BarChart' },
  { id: 'adv-excel', title: 'Advanced Excel', description: 'Go beyond basics with macros, VBA, and complex data visualization.', icon: 'FileSpreadsheet' },
  { id: 'spss', title: 'SPSS', description: 'Statistical Package for the Social Sciences for deep research analysis.', icon: 'LineChart' },
  { id: 'python', title: 'Python for Data Science', description: 'The #1 programming language for data science and automation.', icon: 'Code' },
  { id: 'powerbi', title: 'Power BI', description: 'Create immersive, interactive dashboards for business intelligence.', icon: 'PieChart' },
  { id: 'stata', title: 'STATA', description: 'Powerful statistical software for data science and econometrics.', icon: 'Database' },
  { id: 'kobo', title: 'KOBO / ODK', description: 'Mobile data collection tools for field research and surveys.', icon: 'Smartphone' },
  { id: 'design', title: 'Graphic Design', description: 'Visual communication skills to present data and ideas effectively.', icon: 'PenTool' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'January Intake Now Open', content: 'We are now accepting applications for the January cohort. Apply before the 15th!', date: '2023-12-20', author: 'Admin' },
  { id: '2', title: 'Guest Lecture: AI in Agriculture', content: 'Join us for a webinar with Dr. Emily Chen on how AI is transforming farming.', date: '2024-01-05', author: 'Principal Christopher' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.STUDENT, phone: '0712345678', program: 'Data Analysis', category: 'Graduate', status: ApplicationStatus.ACCEPTED, enrollmentDate: '2023-11-01' },
  { id: 's2', name: 'Bob Smith', email: 'bob@example.com', role: UserRole.STUDENT, phone: '0722345678', program: 'Python for Data Science', category: 'Student', status: ApplicationStatus.UNDER_REVIEW, enrollmentDate: '2023-12-10' },
  { id: 's3', name: 'Charlie Davis', email: 'charlie@example.com', role: UserRole.STUDENT, phone: '0733345678', program: 'Artificial Intelligence', category: 'Professional', status: ApplicationStatus.APPLIED, enrollmentDate: '2024-01-02' },
  { id: 's4', name: 'Diana Evans', email: 'diana@example.com', role: UserRole.STUDENT, phone: '0744345678', program: 'Power BI', category: 'Entrepreneur', status: ApplicationStatus.NOT_APPLIED, enrollmentDate: '2024-01-05' },
];

export const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScL9H21wGacWUa-0-Ot_AdEtoBRW-g1fa69863679sp3gi7wQ/viewform?embedded=true";
