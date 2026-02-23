import React, { useState } from 'react';
import { useApp, Link, useNavigate } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';
import logoImage from '../../assets/Roshan_Training_Institute_Logo.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate simple login check logic
    if (email.includes('admin')) {
      login(email, UserRole.ADMIN);
      navigate('/admin');
    } else {
      login(email, UserRole.STUDENT);
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-4 relative">
      <Link 
        to="/" 
        className="absolute top-4 left-4 md:top-8 md:left-8 text-slate-500 hover:text-brand-primary flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
      >
         <ArrowLeft className="h-5 w-5" />
         <span className="font-bold text-sm hidden sm:inline">Back to Home</span>
      </Link>

      <Link to="/" className="mb-8 flex flex-col items-center group">
         <div className="bg-brand-dark p-3 rounded-xl mb-2 group-hover:shadow-lg transition-shadow">
            <img
              src={logoImage}
              alt="Roshan Training Institute logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <span className="font-bold text-2xl text-brand-dark">RDTI</span>
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8">Sign in to your portal</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
              placeholder="Enter your email" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
               <label className="block text-sm font-bold text-slate-700">Password</label>
               <a href="#" className="text-xs text-brand-primary font-bold hover:underline">Forgot password?</a>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition-all"
              placeholder="••••••••" 
            />
          </div>

          <Button fullWidth size="lg" variant="primary">Sign In</Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-brand-orange font-bold hover:underline">Register here</Link>
        </div>
        
        <div className="mt-8 p-4 bg-brand-surface text-slate-600 text-xs rounded-lg border border-slate-200">
          <p className="font-bold mb-1 text-brand-dark">Demo Credentials:</p>
          <p>Admin: admin@rdti.com / anypass</p>
          <p>Student: alice@example.com / anypass</p>
        </div>
      </div>
    </div>
  );
};
