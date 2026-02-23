import React from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PROGRAMS } from '../../constants';
import * as LucideIcons from 'lucide-react';
import { Link } from '../../context/AppContext';

export const Programs = () => {
  return (
    <div className="bg-brand-surface min-h-screen pb-20">
      <div className="hero-gradient py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <h1 className="text-4xl font-bold text-white mb-4">Our Programs</h1>
           <p className="text-xl text-brand-electric max-w-2xl mx-auto">
            Skill-based training designed for the modern data economy.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program) => {
            // @ts-ignore
            const IconComponent = LucideIcons[program.icon] || LucideIcons.BookOpen;
            
            return (
              <Card key={program.id} className="flex flex-col h-full group transition-all duration-300 hover:border-brand-orange hover:shadow-xl hover:shadow-brand-primary/5">
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors text-brand-primary">
                       <IconComponent className="h-6 w-6" />
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">Certificate</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">{program.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                    {program.description}
                  </p>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500">
                      <LucideIcons.Clock className="h-4 w-4 mr-2 text-brand-orange" />
                      <span>8 - 12 Weeks</span>
                    </div>
                     <div className="flex items-center text-sm text-slate-500">
                      <LucideIcons.Monitor className="h-4 w-4 mr-2 text-brand-orange" />
                      <span>Online / Hybrid</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <Link to="/register">
                    <Button fullWidth variant="outline" className="group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-colors">Enroll Now</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
