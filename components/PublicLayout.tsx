import React, { useState } from 'react';
import { Menu, X, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from './Button';
import { useApp, Link, useLocation } from '../context/AppContext';
import logoImage from '../assets/Roshan_Training_Institute_Logo.png';
import fullLogoImage from '../assets/Full_Roshan_Training_Institute_Logo.png';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useApp();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-surface">
      {/* Navbar - Light Theme */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-slate-100 p-2 rounded-xl group-hover:bg-slate-200 transition-colors">
                <img
                  src={logoImage}
                  alt="Roshan Training Institute logo"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <img
                src={fullLogoImage}
                alt="Full Roshan Training Institute logo"
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-all relative py-2 ${
                    location.pathname === link.path 
                      ? 'text-brand-primary' 
                      : 'text-slate-600 hover:text-brand-primary'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                 <Link to={user.role === 'ADMIN' ? '/admin' : '/student'}>
                   <Button variant="cta" size="sm">Dashboard</Button>
                 </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-brand-primary hover:bg-slate-100">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="cta" size="sm" className="shadow-brand-orange/20">Apply Now</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-brand-primary p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-6 px-4 shadow-xl absolute w-full left-0 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium px-4 py-2 rounded-lg ${
                    location.pathname === link.path 
                      ? 'bg-brand-primary/10 text-brand-primary' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-brand-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-200 my-2" />
               {user ? (
                 <Link to={user.role === 'ADMIN' ? '/admin' : '/student'} onClick={() => setIsMobileMenuOpen(false)}>
                   <Button fullWidth variant="cta">Go to Dashboard</Button>
                 </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button fullWidth variant="ghost" className="mb-2 text-slate-600 hover:text-brand-primary hover:bg-slate-100">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button fullWidth variant="cta">Apply Now</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Deep Navy */}
      <footer className="bg-brand-dark text-slate-300 pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-white/10 p-2 rounded-lg">
                  <img
                    src={logoImage}
                    alt="Roshan Training Institute logo"
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span className="font-bold text-xl text-white tracking-tight">RDTI</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Empowering learners with practical data analysis and AI skills through quality training, mentorship, and real-world applications.
              </p>
              <div className="flex space-x-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 bg-white/5 rounded-full hover:bg-brand-primary cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 bg-white/5 rounded-full hover:bg-brand-primary cursor-pointer transition-colors"></div>
                <div className="w-8 h-8 bg-white/5 rounded-full hover:bg-brand-primary cursor-pointer transition-colors"></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-brand-orange font-bold mb-6 tracking-wide text-sm uppercase">Programs</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/programs" className="hover:text-brand-electric transition-colors">Artificial Intelligence</Link></li>
                <li><Link to="/programs" className="hover:text-brand-electric transition-colors">Data Analysis</Link></li>
                <li><Link to="/programs" className="hover:text-brand-electric transition-colors">Power BI</Link></li>
                <li><Link to="/programs" className="hover:text-brand-electric transition-colors">Python for Data Science</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-brand-orange font-bold mb-6 tracking-wide text-sm uppercase">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="hover:text-brand-electric transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-brand-electric transition-colors">Contact</Link></li>
                <li><Link to="/login" className="hover:text-brand-electric transition-colors">Student Portal</Link></li>
                <li><Link to="/admin" className="hover:text-brand-electric transition-colors">Admin Portal</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-brand-orange font-bold mb-6 tracking-wide text-sm uppercase">Contact</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-brand-electric mr-3 shrink-0" />
                  <span className="hover:text-white transition-colors">roshandatainstitute@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-brand-electric mr-3 shrink-0" />
                  <span className="hover:text-white transition-colors">0702171149</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-brand-electric mr-3 shrink-0" />
                  <span>Nairobi, Kenya</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Roshan Training Institute. All rights reserved.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-orange transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
