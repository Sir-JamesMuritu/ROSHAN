import React from 'react';
import { useApp, Link } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ApplicationStatus } from '../../types';
import { FileText, Clock, Bell, CheckCircle, Circle, ArrowRight, User, Phone, Briefcase } from 'lucide-react';

const StatusBadge: React.FC<{ status: ApplicationStatus; size?: 'sm' | 'lg' }> = ({ status, size = 'sm' }) => {
  const styles = {
    [ApplicationStatus.NOT_APPLIED]: 'bg-slate-100 text-slate-600 border-slate-200',
    [ApplicationStatus.APPLIED]: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    [ApplicationStatus.UNDER_REVIEW]: 'bg-brand-amber/10 text-yellow-700 border-brand-amber/20',
    [ApplicationStatus.ACCEPTED]: 'bg-green-50 text-green-700 border-green-200',
    [ApplicationStatus.REJECTED]: 'bg-red-50 text-red-700 border-red-200',
  };

  const sizeClasses = size === 'lg' ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold border ${sizeClasses} ${styles[status]}`}>
      {status}
    </span>
  );
};

const ProgressStepper: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const steps = [
    { label: 'Account Created', status: 'completed' },
    { label: 'Applied', status: status !== ApplicationStatus.NOT_APPLIED ? 'completed' : 'pending' },
    { label: 'Under Review', status: [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(status) ? 'completed' : (status === ApplicationStatus.APPLIED ? 'current' : 'pending') },
    { label: 'Decision', status: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED].includes(status) ? 'completed' : ([ApplicationStatus.UNDER_REVIEW].includes(status) ? 'pending' : 'pending') },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          return (
            <div key={index} className="flex flex-col items-center bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isCompleted ? 'bg-brand-primary border-brand-primary text-white' : 
                isCurrent ? 'bg-white border-brand-orange text-brand-orange shadow-[0_0_0_4px_rgba(249,115,22,0.1)]' : 
                'bg-white border-slate-200 text-slate-300'
              }`}>
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5 fill-current" />}
              </div>
              <span className={`text-xs font-bold mt-2 ${isCompleted || isCurrent ? 'text-brand-dark' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StudentDashboard = () => {
  const { currentUserStudentData, announcements } = useApp();

  if (!currentUserStudentData) return <div className="p-8 text-center text-slate-500">Loading student data...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. WELCOME CARD */}
      <Card className="p-0 overflow-hidden flex flex-col md:flex-row shadow-sm border border-slate-200">
         <div className="w-2 bg-brand-primary h-full hidden md:block"></div>
         <div className="p-8 flex-1">
            <h2 className="text-2xl font-bold text-brand-dark mb-1">Welcome back, {currentUserStudentData.name.split(' ')[0]}</h2>
            <p className="text-slate-500 mb-6">Track your application and stay updated with the latest institute news.</p>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
               <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-brand-primary" />
                  <span className="font-semibold text-brand-dark mr-1">Program:</span> {currentUserStudentData.program}
               </div>
               <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
               <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-brand-primary" />
                  <span className="font-semibold text-brand-dark mr-1">ID:</span> {currentUserStudentData.id}
               </div>
            </div>
         </div>
         <div className="bg-brand-surface p-8 md:w-1/3 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100">
             {currentUserStudentData.status === ApplicationStatus.NOT_APPLIED ? (
               <Link to="/student/enrollment" className="w-full">
                 <Button fullWidth variant="cta" className="shadow-lg shadow-orange-500/20">
                   Complete Application
                 </Button>
               </Link>
             ) : (
                <div className="text-center">
                   <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Current Status</p>
                   <StatusBadge status={currentUserStudentData.status} size="lg" />
                </div>
             )}
         </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. ENROLLMENT STATUS & PROGRESS */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-8 border-t-4 border-t-brand-primary">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-lg font-bold text-brand-dark">Application Tracker</h3>
                    <p className="text-sm text-slate-500">Real-time updates on your admission process</p>
                 </div>
                 <div className="hidden md:block">
                    <StatusBadge status={currentUserStudentData.status} />
                 </div>
              </div>
              
              <ProgressStepper status={currentUserStudentData.status} />
              
              <div className="mt-8 bg-blue-50/50 rounded-xl p-6 border border-blue-100 flex items-start gap-4">
                 <div className="p-2 bg-brand-primary/10 rounded-lg shrink-0">
                    <Clock className="h-5 w-5 text-brand-primary" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-brand-dark mb-1">What happens next?</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                       {currentUserStudentData.status === ApplicationStatus.NOT_APPLIED && "Please submit the enrollment form to start your application process."}
                       {currentUserStudentData.status === ApplicationStatus.APPLIED && "Your application is being reviewed by the admissions team. Expect feedback within 3-5 business days."}
                       {currentUserStudentData.status === ApplicationStatus.UNDER_REVIEW && "We are currently evaluating your profile. You may be contacted for a short interview."}
                       {currentUserStudentData.status === ApplicationStatus.ACCEPTED && "Congratulations! Please check your email for the admission letter and fee structure."}
                       {currentUserStudentData.status === ApplicationStatus.REJECTED && "Thank you for your interest. Unfortunately, we cannot move forward with your application at this time."}
                    </p>
                 </div>
              </div>
           </Card>

           {/* 4. ANNOUNCEMENTS */}
           <div>
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-brand-dark">Announcements</h3>
                <span className="text-xs font-bold text-brand-primary cursor-pointer hover:underline">View All</span>
             </div>
             <div className="space-y-4">
               {announcements.map((ann) => (
                 <Card key={ann.id} className="p-5 flex gap-4 hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-transparent hover:border-l-brand-orange">
                    <div className="bg-brand-surface p-3 rounded-xl h-fit group-hover:bg-brand-orange/10 transition-colors">
                       <Bell className="h-5 w-5 text-slate-400 group-hover:text-brand-orange transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-brand-dark text-sm group-hover:text-brand-primary transition-colors">{ann.title}</h4>
                        {/* Mock "New" badge for recent items */}
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{ann.date}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{ann.content}</p>
                    </div>
                 </Card>
               ))}
             </div>
           </div>
        </div>

        {/* 3. PROFILE OVERVIEW (Sidebar style) */}
        <div className="space-y-8">
           <Card className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                 <h3 className="font-bold text-brand-dark">My Profile</h3>
                 <Button variant="ghost" size="sm" className="text-xs h-8">Edit</Button>
              </div>
              
              <div className="space-y-6">
                 <div className="flex items-start">
                    <User className="h-5 w-5 text-brand-primary mt-0.5 mr-3" />
                    <div>
                       <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Full Name</p>
                       <p className="font-medium text-slate-700">{currentUserStudentData.name}</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <FileText className="h-5 w-5 text-brand-primary mt-0.5 mr-3" />
                    <div>
                       <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Email</p>
                       <p className="font-medium text-slate-700 break-all">{currentUserStudentData.email}</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <Phone className="h-5 w-5 text-brand-primary mt-0.5 mr-3" />
                    <div>
                       <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Phone</p>
                       <p className="font-medium text-slate-700">{currentUserStudentData.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-brand-primary mt-0.5 mr-3" />
                    <div>
                       <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Category</p>
                       <p className="font-medium text-slate-700">{currentUserStudentData.category}</p>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="bg-brand-dark text-white p-6 relative overflow-hidden border-none">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary rounded-full opacity-20 -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-brand-orange rounded-full opacity-20 -ml-8 -mb-8"></div>
              
              <h3 className="font-bold text-lg mb-2 relative z-10">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-4 relative z-10">Contact the admissions office for support regarding your application.</p>
              <Button size="sm" variant="secondary" className="w-full relative z-10 border-none bg-white/10 text-white hover:bg-white hover:text-brand-dark">
                 Contact Support
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
};
