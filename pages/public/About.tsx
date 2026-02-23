import React from 'react';
import { Card } from '../../components/Card';
import { Target, Lightbulb, Shield, Zap, Heart, Users } from 'lucide-react';

export const About = () => {
  const values = [
    { icon: Zap, title: "Excellence", desc: "We strive for the highest standards in training and delivery.", color: "text-brand-primary", border: "border-brand-primary" },
    { icon: Shield, title: "Integrity", desc: "Honesty and transparency in all our operations.", color: "text-brand-orange", border: "border-brand-orange" },
    { icon: Lightbulb, title: "Innovation", desc: "Embracing new technologies and methods.", color: "text-brand-primary", border: "border-brand-primary" },
    { icon: Heart, title: "Inclusivity", desc: "Creating a welcoming environment for all learners.", color: "text-brand-orange", border: "border-brand-orange" },
    { icon: Users, title: "Learner-Centered", desc: "Focusing on the unique needs of every student.", color: "text-brand-primary", border: "border-brand-primary" },
    { icon: Target, title: "Practical Impact", desc: "Ensuring skills translate to real-world results.", color: "text-brand-orange", border: "border-brand-orange" }
  ];

  return (
    <div className="pb-20 bg-white">
      {/* Page Header */}
      <div className="hero-gradient py-20 text-center text-white mb-20">
         <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About RDTI</h1>
         <p className="text-xl text-brand-electric font-light">Bridging the Gap • Driving Innovation</p>
      </div>

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
           <div>
              <span className="text-brand-orange font-bold uppercase tracking-widest text-sm mb-2 block">Who We Are</span>
              <h2 className="text-3xl font-bold text-brand-dark mb-6">A Premier Data Training Institute</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Roshan Training Institute is a premier EdTech institution dedicated to bridging the data skills gap in Africa and beyond. Founded in 2023, we focus on producing competent, ethical, and innovative data professionals.
              </p>
           </div>
           
           <div className="space-y-6">
              <Card className="p-8 border-l-4 border-l-brand-primary bg-brand-surface">
                <h2 className="text-xl font-bold text-brand-dark flex items-center mb-3">
                   <Target className="h-6 w-6 text-brand-primary mr-3" /> Our Mission
                </h2>
                <p className="text-slate-600">
                  To empower learners with practical data analysis and AI skills through quality training, mentorship, and real-world applications that enhance employability, productivity, and innovation.
                </p>
              </Card>

              <Card className="p-8 border-l-4 border-l-brand-orange bg-brand-surface">
                <h2 className="text-xl font-bold text-brand-dark flex items-center mb-3">
                   <Lightbulb className="h-6 w-6 text-brand-orange mr-3" /> Our Vision
                </h2>
                <p className="text-slate-600">
                  To be a leading data training institute that produces competent, ethical, and innovative data professionals who drive impact locally and globally.
                </p>
              </Card>
           </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-brand-surface py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-dark text-center mb-16">Institute Leadership</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100 hover:shadow-lg transition-shadow">
               <div className="w-32 h-32 rounded-full mx-auto mb-6 p-1 border-2 border-brand-primary">
                 <img src="https://ui-avatars.com/api/?name=Christopher&size=200&background=0B1F3A&color=fff" className="w-full h-full rounded-full" alt="Principal" />
               </div>
               <h3 className="text-xl font-bold text-brand-dark">Christopher</h3>
               <p className="text-brand-primary font-bold text-sm uppercase mb-4">Principal</p>
               <p className="text-slate-600 text-sm">Driving the strategic vision and academic excellence of the institute.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100 hover:shadow-lg transition-shadow">
               <div className="w-32 h-32 rounded-full mx-auto mb-6 p-1 border-2 border-brand-orange">
                 <img src="https://ui-avatars.com/api/?name=Isaac&size=200&background=F97316&color=fff" className="w-full h-full rounded-full" alt="Counselor" />
               </div>
               <h3 className="text-xl font-bold text-brand-dark">Mr. Isaac</h3>
               <p className="text-brand-orange font-bold text-sm uppercase mb-4">College & Career Counselor</p>
               <p className="text-slate-600 text-sm">Guiding students towards fulfilling career paths and opportunities.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-brand-dark text-center mb-16">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className={`bg-white p-8 rounded-xl shadow-sm border-t-4 ${v.border} hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg group`}>
              <v.icon className={`h-10 w-10 ${v.color} mb-6 group-hover:scale-110 transition-transform`} />
              <h3 className="text-xl font-bold text-brand-dark mb-3">{v.title}</h3>
              <p className="text-slate-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};