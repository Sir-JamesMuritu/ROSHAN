import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { GOOGLE_FORM_URL } from '../../constants';
import { CheckCircle, Info, ArrowRight, HelpCircle } from 'lucide-react';
import { ApplicationStatus } from '../../types';

export const Enrollment = () => {
  const { markEnrollmentSubmitted, currentUserStudentData } = useApp();
  
  const isApplied = currentUserStudentData?.status !== ApplicationStatus.NOT_APPLIED;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      
      {/* LEFT: FORM SECTION */}
      <div className="lg:col-span-2 space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-dark">Enrollment Application</h1>
              <div className="w-12 h-1 bg-brand-orange rounded-full mt-2 mb-1"></div>
              <p className="text-slate-500 text-sm">Fill out the form below to finalize your application.</p>
            </div>
         </div>

         {isApplied && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center shadow-sm">
               <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
               <div>
                  <p className="font-bold">Application submitted successfully!</p>
                  <p className="text-sm opacity-80">You can track your status in the dashboard.</p>
               </div>
            </div>
         )}

         <Card className="overflow-hidden bg-white shadow-md border border-slate-200">
            <iframe 
              src={GOOGLE_FORM_URL} 
              width="100%" 
              height="1200" 
              frameBorder="0" 
              title="Enrollment Form"
              className="w-full"
            >
              Loading…
            </iframe>
         </Card>

         {!isApplied && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg sticky bottom-4 z-10 flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <p className="font-bold text-brand-dark">Finished the form?</p>
                  <p className="text-sm text-slate-500">Don't forget to confirm your submission here.</p>
               </div>
               <div className="flex items-center gap-4 w-full md:w-auto">
                   <div className="group relative hidden md:block">
                      <HelpCircle className="h-6 w-6 text-slate-400 hover:text-brand-orange cursor-help transition-colors" />
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 bg-brand-dark text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-center z-50 pointer-events-none">
                         Clicking this will change your status to 'Applied'. This action cannot be undone.
                         <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-dark"></div>
                      </div>
                   </div>
                   <Button 
                      onClick={markEnrollmentSubmitted} 
                      variant="cta" 
                      size="lg"
                      className="w-full md:w-auto shadow-orange-500/30"
                   >
                     I Have Submitted My Application <ArrowRight className="h-4 w-4 ml-2" />
                   </Button>
               </div>
            </div>
         )}
      </div>

      {/* RIGHT: INFO PANEL */}
      <div className="lg:col-span-1 space-y-6">
         <div className="sticky top-6 space-y-6">
            <Card className="p-6 bg-blue-50 border border-blue-100">
               <h3 className="font-bold text-brand-dark flex items-center mb-4">
                  <Info className="h-5 w-5 text-brand-primary mr-2" />
                  Before You Apply
               </h3>
               <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start">
                     <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 mr-2 shrink-0"></span>
                     Ensure you have your academic transcripts ready.
                  </li>
                  <li className="flex items-start">
                     <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 mr-2 shrink-0"></span>
                     Select the correct program category.
                  </li>
                  <li className="flex items-start">
                     <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 mr-2 shrink-0"></span>
                     Double-check your email address for correspondence.
                  </li>
               </ul>
            </Card>

            <Card className="p-6">
               <h3 className="font-bold text-brand-dark mb-4">Application Timeline</h3>
               <div className="relative border-l-2 border-slate-100 pl-4 space-y-6">
                  <div className="relative">
                     <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-brand-orange rounded-full border-2 border-white shadow-sm"></div>
                     <p className="text-xs font-bold text-brand-primary uppercase">Step 1</p>
                     <p className="font-bold text-brand-dark text-sm">Submit Application</p>
                     <p className="text-xs text-slate-500">Fill out the Google Form</p>
                  </div>
                  <div className="relative">
                     <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                     <p className="text-xs font-bold text-slate-400 uppercase">Step 2</p>
                     <p className="font-bold text-slate-600 text-sm">Review Process</p>
                     <p className="text-xs text-slate-500">3-5 Business Days</p>
                  </div>
                  <div className="relative">
                     <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                     <p className="text-xs font-bold text-slate-400 uppercase">Step 3</p>
                     <p className="font-bold text-slate-600 text-sm">Admission Decision</p>
                     <p className="text-xs text-slate-500">Sent via Email</p>
                  </div>
               </div>
            </Card>

            <Card className="p-6">
               <h3 className="font-bold text-brand-dark flex items-center mb-4">
                  <HelpCircle className="h-5 w-5 text-brand-orange mr-2" />
                  Have Questions?
               </h3>
               <p className="text-sm text-slate-600 mb-4">
                  If you encounter any issues with the form or payment, please contact us directly.
               </p>
               <div className="text-sm space-y-1">
                  <p className="font-bold text-brand-dark">Admissions Office</p>
                  <p className="text-slate-500">0702171149</p>
                  <p className="text-slate-500">roshandatainstitute@gmail.com</p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};