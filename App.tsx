import React from 'react';
import { AppProvider, HashRouter as Router, Routes, Route, Navigate } from './context/AppContext';

// Layouts
import { PublicLayout } from './components/PublicLayout';
import { DashboardLayout } from './components/DashboardLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Programs } from './pages/public/Programs';
import { Contact } from './pages/public/Contact';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Student Pages
import { StudentDashboard } from './pages/student/Dashboard';
import { Enrollment } from './pages/student/Enrollment';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Students } from './pages/admin/Students';
import { Announcements } from './pages/admin/Announcements';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/programs" element={<PublicLayout><Programs /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
          <Route path="/student/enrollment" element={<DashboardLayout><Enrollment /></DashboardLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
          <Route path="/admin/students" element={<DashboardLayout><Students /></DashboardLayout>} />
          <Route path="/admin/announcements" element={<DashboardLayout><Announcements /></DashboardLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
