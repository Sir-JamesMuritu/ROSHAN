import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, User, UserRole, Announcement, ApplicationStatus } from '../types';
import { MOCK_STUDENTS, MOCK_ANNOUNCEMENTS } from '../constants';

// --- Custom Router Implementation ---

export const useLocation = () => {
  const [pathname, setPathname] = useState(window.location.hash.replace(/^#/, '') || '/');
  
  useEffect(() => {
    const handleHashChange = () => {
      let path = window.location.hash.replace(/^#/, '') || '/';
      // Remove query params for pathname if needed, though simple replacement is usually enough for this app
      // Assuming hash is like #/path
      setPathname(path);
    };
    
    // Initial set
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  return { pathname };
};

export const useNavigate = () => {
  return (to: string, options?: { replace?: boolean }) => {
    window.location.hash = to;
  };
};

export const Link: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }> = ({ to, children, className, onClick, ...props }) => {
  return (
    <a 
      href={`#${to}`} 
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export const Navigate: React.FC<{ to: string }> = ({ to }) => {
  useEffect(() => {
    window.location.hash = to;
  }, [to]);
  return null;
};

export const HashRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

export const Route: React.FC<{ path: string; element: React.ReactNode }> = ({ element }) => <>{element}</>;

export const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  
  let elementToRender: React.ReactNode = null;
  
  React.Children.forEach(children, (child) => {
    if (elementToRender) return;
    if (React.isValidElement(child)) {
        const { path, element } = child.props as { path: string, element: React.ReactNode };
        // Simple exact matching or wildcard
        if (path === '*' || path === pathname) {
            elementToRender = element;
        }
    }
  });
  
  return <>{elementToRender}</>;
};

// --- End Custom Router ---

interface AppContextType {
  user: User | Student | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  students: Student[];
  announcements: Announcement[];
  updateStudentStatus: (id: string, status: ApplicationStatus) => void;
  addAnnouncement: (announcement: Announcement) => void;
  registerStudent: (studentData: Omit<Student, 'id' | 'role' | 'status' | 'enrollmentDate'>) => void;
  currentUserStudentData: Student | null; // If user is student, this holds their specific data
  markEnrollmentSubmitted: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Student | null>(null);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  // Simulate persistent data via local storage or just memory for this session
  // For this demo, we use memory state but pre-filled with mocks.

  const login = (email: string, role: UserRole) => {
    if (role === UserRole.ADMIN) {
      setUser({
        id: 'admin1',
        name: 'Administrator',
        email: email,
        role: UserRole.ADMIN,
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0F172A&color=fff'
      });
    } else {
      // Find existing student or create a temporary session user
      const foundStudent = students.find(s => s.email === email);
      if (foundStudent) {
        setUser(foundStudent);
      } else {
        // Fallback for demo if not found in mock list (shouldn't happen if flow is followed)
        alert("User not found in mock DB. Please Register first.");
      }
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateStudentStatus = (id: string, status: ApplicationStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addAnnouncement = (announcement: Announcement) => {
    setAnnouncements(prev => [announcement, ...prev]);
  };

  const registerStudent = (data: Omit<Student, 'id' | 'role' | 'status' | 'enrollmentDate'>) => {
    const newStudent: Student = {
      ...data,
      id: `s${Date.now()}`,
      role: UserRole.STUDENT,
      status: ApplicationStatus.NOT_APPLIED,
      enrollmentDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${data.name.replace(' ', '+')}&background=14B8A6&color=fff`
    };
    setStudents(prev => [...prev, newStudent]);
    setUser(newStudent); // Auto login
  };

  const markEnrollmentSubmitted = () => {
    if (user && user.role === UserRole.STUDENT) {
      const studentUser = user as Student;
      const updatedStudent = { ...studentUser, status: ApplicationStatus.APPLIED };
      setUser(updatedStudent);
      updateStudentStatus(updatedStudent.id, ApplicationStatus.APPLIED);
    }
  };

  const currentUserStudentData = user?.role === UserRole.STUDENT 
    ? students.find(s => s.id === user.id) || (user as Student)
    : null;

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      students,
      announcements,
      updateStudentStatus,
      addAnnouncement,
      registerStudent,
      currentUserStudentData,
      markEnrollmentSubmitted
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
