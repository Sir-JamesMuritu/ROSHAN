import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  LogOut, 
  Menu, 
  X, 
  FileText, 
  Bell,
  ChevronDown
} from 'lucide-react';
import { useApp, Link, useNavigate, useLocation } from '../context/AppContext';
import { UserRole } from '../types';
import logoImage from '../assets/Roshan_Training_Institute_Logo.png';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Enrollment', path: '/student/enrollment', icon: FileText },
  ];

  const links = user.role === UserRole.ADMIN ? adminLinks : studentLinks;
  
  const portalTitle = user.role === UserRole.ADMIN ? 'Admin Panel' : 'Student Portal';
  const portalSubtitle = user.role === UserRole.ADMIN ? 'Management System' : 'Student Portal';

  // Get current page title
  const currentLink = links.find(link => link.path === location.pathname);
  const pageTitle = currentLink ? currentLink.name : 'Portal';

  return (
    <div className="flex h-screen bg-brand-surface overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-dark border-r border-slate-800 text-white shadow-2xl z-20">
        <div className="flex flex-col items-center justify-center pt-8 pb-6 px-4">
           <div className="bg-white/10 p-2 rounded-xl mb-3">
             <img
               src={logoImage}
               alt="Roshan Training Institute logo"
               className="h-8 w-8 object-contain"
             />
           </div>
           <span className="font-bold text-lg tracking-wide">ROSHAN</span>
           <span className="text-[10px] text-slate-400 uppercase tracking-widest">{portalSubtitle}</span>
           <div className="w-12 h-0.5 bg-brand-orange mt-4 rounded-full"></div>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-r-lg rounded-l-md transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange"></div>
                )}
                <Icon className={`h-5 w-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-electric'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
          >
            <LogOut className="h-4 w-4 mr-3 group-hover:text-brand-orange transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
           <div className="flex items-center">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 mr-2 text-slate-500">
               <Menu className="h-6 w-6" />
             </button>
             <h1 className="text-xl font-bold text-brand-primary hidden md:block">{pageTitle}</h1>
             <span className="md:hidden font-bold text-brand-dark">RDTI {portalTitle}</span>
           </div>

           <div className="flex items-center gap-4">
             <button className="p-2 text-slate-400 hover:text-brand-orange transition-colors relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full border-2 border-white"></span>
             </button>
             
             <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
             
             <div className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-brand-dark leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user.role}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
             </div>
           </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative flex flex-col w-72 bg-brand-dark h-full shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
                <span className="font-bold text-white text-lg">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 py-6 px-3 space-y-1">
                 {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <Link 
                        key={link.path} 
                        to={link.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                          isActive 
                            ? 'bg-brand-primary text-white' 
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {link.name}
                      </Link>
                    );
                  })}
              </div>
              <div className="p-4 border-t border-white/10">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-brand-surface p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};
