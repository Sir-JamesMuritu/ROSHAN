import React, { useState } from 'react';
import { useApp, Link, useNavigate } from '../../context/AppContext';
import { PROGRAMS } from '../../constants';
import { Button } from '../../components/Button';
import { ArrowLeft } from 'lucide-react';
import logoImage from '../../assets/Roshan_Training_Institute_Logo.png';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: PROGRAMS[0].title,
    category: 'Student'
  });
  
  const { registerStudent } = useApp();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerStudent(formData);
    navigate('/student'); // Redirect to dashboard after auto-login
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center p-4 py-12 relative">
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
      
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold text-brand-dark mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 text-center mb-8">Join RDTI and start your journey</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
              <input 
                name="phone" 
                type="tel" 
                required 
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary outline-none"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Target Program</label>
             <select 
                name="program" 
                value={formData.program} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary outline-none bg-white"
             >
               {PROGRAMS.map(p => (
                 <option key={p.id} value={p.title}>{p.title}</option>
               ))}
             </select>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Learner Category</label>
             <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary outline-none bg-white"
             >
               <option value="Student">University / College Student</option>
               <option value="Graduate">Recent Graduate / Form Four Leaver</option>
               <option value="Professional">Working Professional</option>
               <option value="Entrepreneur">Entrepreneur / Freelancer</option>
             </select>
          </div>
          
          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-primary outline-none"
            />
          </div>

          <div className="pt-4">
            <Button fullWidth size="lg" variant="cta">Create Account</Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-primary font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};
