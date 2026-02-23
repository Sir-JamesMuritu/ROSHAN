import React from 'react';
import { ArrowRight, CheckCircle, BrainCircuit, BarChart, Database, Zap, Trophy, Users, Star } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PROGRAMS } from '../../constants';
import * as LucideIcons from 'lucide-react';
import { Link } from '../../context/AppContext';

export const Home = () => {
  return (
    <div className="pb-20 bg-brand-surface">
      
      {/* 1️⃣ HERO SECTION (Redesigned) */}
      <section className="relative hero-gradient text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           {/* Abstract Data Bars */}
           <div className="absolute bottom-0 left-10 w-12 h-64 bg-white/10 rounded-t-lg animate-pulse-slow"></div>
           <div className="absolute bottom-0 left-24 w-12 h-40 bg-white/10 rounded-t-lg animate-pulse-slow" style={{animationDelay: '1s'}}></div>
           <div className="absolute bottom-0 left-38 w-12 h-80 bg-white/10 rounded-t-lg animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
           
           {/* Floating Dots */}
           <div className="absolute top-20 right-20 w-4 h-4 bg-brand-orange rounded-full opacity-60 animate-bounce"></div>
           <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-brand-amber rounded-full opacity-80 animate-ping"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 flex flex-col items-start justify-center min-h-[50vh] md:min-h-[500px]">
          <div className="animate-slide-up max-w-4xl">
             <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-brand-electric/30 backdrop-blur-sm text-brand-amber text-xs font-bold uppercase tracking-wider mb-6">
               <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
               <span>January Intake – Ongoing</span>
             </span>
             
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
               Gain Practical <span className="text-brand-orange">AI & Data Skills</span><br className="hidden md:block"/>
               for the Global Market
             </h1>
             
             <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 font-light leading-relaxed border-l-4 border-brand-orange pl-6">
               Empowering learners with competency-based training, mentorship, and real-world applications to drive innovation and employability.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-5">
               <Link to="/register">
                 <Button variant="cta" size="lg" className="w-full sm:w-auto text-lg shadow-xl hover:shadow-2xl">
                   Apply for Enrollment
                 </Button>
               </Link>
               <Link to="/programs">
                 <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg backdrop-blur-sm bg-white/5 border-brand-electric text-white hover:bg-brand-electric hover:border-brand-electric">
                   View Programs
                 </Button>
               </Link>
             </div>
          </div>
        </div>
        
        {/* Soft bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-brand-surface to-transparent z-10"></div>
      </section>

      {/* 2️⃣ ABOUT PREVIEW SECTION */}
      <section className="bg-white py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                 <div className="w-16 h-1 bg-brand-orange rounded-full"></div>
                 <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">We Bridge the Data Skills Gap</h2>
                 <p className="text-slate-600 text-lg leading-relaxed">
                   At Roshan Training Institute (RDTI), we move beyond theory. Our curriculum is designed by industry experts to ensure you gain hands-on experience with real datasets. 
                 </p>
                 <Link to="/about">
                   <Button variant="primary" className="mt-4">Learn More About RDTI</Button>
                 </Link>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                 <div className="space-y-4 mt-8">
                    <div className="bg-brand-surface p-6 rounded-2xl border-t-4 border-brand-primary shadow-sm hover:-translate-y-1 transition-transform">
                       <Zap className="h-8 w-8 text-brand-primary mb-3" />
                       <h3 className="font-bold text-brand-dark">Practical Impact</h3>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-2xl border-t-4 border-brand-orange shadow-sm hover:-translate-y-1 transition-transform">
                       <Users className="h-8 w-8 text-brand-orange mb-3" />
                       <h3 className="font-bold text-brand-dark">Mentorship</h3>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="bg-brand-surface p-6 rounded-2xl border-t-4 border-brand-electric shadow-sm hover:-translate-y-1 transition-transform">
                       <Database className="h-8 w-8 text-brand-electric mb-3" />
                       <h3 className="font-bold text-brand-dark">Real Data</h3>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-2xl border-t-4 border-brand-dark shadow-sm hover:-translate-y-1 transition-transform">
                       <Trophy className="h-8 w-8 text-brand-dark mb-3" />
                       <h3 className="font-bold text-brand-dark">Certification</h3>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6️⃣ SUCCESS METRICS (Brand Aligned) */}
      <section className="bg-blue-50 py-16 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-200/50">
            {[
              { label: 'Learners Trained', value: '500+' },
              { label: 'Completion Rate', value: '95%' },
              { label: 'Real-world Projects', value: '50+' },
              { label: 'Industry Partners', value: '10+' }
            ].map((stat, idx) => (
              <div key={idx} className="p-4">
                <p className="text-4xl md:text-5xl font-extrabold text-brand-primary mb-2 tracking-tight">{stat.value}</p>
                <div className="w-12 h-1 bg-brand-orange mx-auto mb-3 rounded-full"></div>
                <p className="text-sm text-slate-600 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ PROGRAMS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Core Programs</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-electric mx-auto rounded-full"></div>
            <p className="text-slate-600 max-w-2xl mx-auto mt-6">
              Industry-relevant courses designed to take you from beginner to professional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS.slice(0, 3).map((program, index) => {
               // @ts-ignore
               const IconComponent = LucideIcons[program.icon] || BarChart;
               const isFeatured = index === 1;

               return (
                <Card 
                  key={program.id} 
                  className={`p-8 flex flex-col group transition-all duration-300 border hover:border-brand-orange hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] ${isFeatured ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-slate-100'}`}
                >
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${isFeatured ? 'bg-brand-primary text-white' : 'bg-blue-50 text-brand-primary group-hover:bg-brand-primary group-hover:text-white'}`}>
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">{program.title}</h3>
                  <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{program.description}</p>
                  <Link to="/programs" className="mt-auto">
                    <span className="text-brand-primary font-bold flex items-center group-hover:text-brand-orange transition-colors">
                      Course Details <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </Card>
               )
            })}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/programs">
              <Button variant="outline" size="lg" className="border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5️⃣ WHY CHOOSE US (Brand Block) */}
      <section className="bg-brand-dark py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <h2 className="text-3xl font-bold mb-8">Why Students Choose RDTI</h2>
                 <div className="space-y-6">
                    {[
                      { title: 'Project-based Learning', desc: 'Work with real datasets from day one.' },
                      { title: 'Expert Mentorship', desc: 'Guidance from active industry professionals.' },
                      { title: 'Career Coaching', desc: 'CV reviews, interview prep, and job placement support.' },
                      { title: 'Flexible Learning', desc: 'Online, physical, and hybrid options available.' }
                    ].map((item, i) => (
                      <div key={i} className="flex group">
                         <div className="mr-5 mt-1">
                            <CheckCircle className="h-6 w-6 text-brand-orange group-hover:text-brand-amber transition-colors group-hover:scale-110 duration-300" />
                         </div>
                         <div>
                            <h4 className="font-bold text-lg text-white mb-1 group-hover:text-brand-electric transition-colors">{item.title}</h4>
                            <p className="text-slate-400 text-sm">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="relative h-96 bg-gradient-to-br from-brand-primary to-brand-dark rounded-2xl p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 rounded-2xl"></div>
                 <div className="relative h-full w-full border border-white/10 rounded-xl flex items-center justify-center">
                    <div className="text-center p-8 bg-brand-dark/80 backdrop-blur-md rounded-xl border border-brand-orange/30">
                       <p className="text-brand-orange font-bold text-xl mb-2">Next Intake</p>
                       <p className="text-4xl font-bold text-white mb-4">JAN 15</p>
                       <Link to="/register">
                          <Button variant="secondary" size="sm">Register Now</Button>
                       </Link>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 7️⃣ TESTIMONIALS */}
      <section className="bg-brand-surface py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-dark text-center mb-12">Student Success Stories</h2>
            <div className="grid md:grid-cols-2 gap-8">
               <Card className="p-8 border-t-4 border-brand-orange">
                  <div className="flex items-center mb-4">
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange"><Star className="h-5 w-5 fill-current" /></div>
                  </div>
                  <p className="text-slate-600 italic mb-6">"The practical approach at RDTI changed my career trajectory. I went from knowing zero Python to building my own data models in 3 months."</p>
                  <div className="flex items-center">
                     <div className="h-10 w-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold mr-3">JD</div>
                     <div>
                        <p className="font-bold text-brand-dark">John Doe</p>
                        <p className="text-xs text-brand-primary">Data Analyst @ FinTech Co.</p>
                     </div>
                  </div>
               </Card>
               <Card className="p-8 border-t-4 border-brand-primary">
                  <div className="flex items-center mb-4">
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange mr-2"><Star className="h-5 w-5 fill-current" /></div>
                     <div className="text-brand-orange"><Star className="h-5 w-5 fill-current" /></div>
                  </div>
                  <p className="text-slate-600 italic mb-6">"The mentorship was invaluable. My instructor didn't just teach code; he taught me how to think like a data scientist."</p>
                  <div className="flex items-center">
                     <div className="h-10 w-10 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold mr-3">SM</div>
                     <div>
                        <p className="font-bold text-brand-dark">Sarah Maina</p>
                        <p className="text-xs text-brand-primary">Graduate Student</p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>
      </section>

      {/* 8️⃣ CTA SECTION (Bold Brand Block) */}
      <section className="bg-brand-surface py-20 px-4">
        <div className="max-w-6xl mx-auto cta-gradient rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to launch your career?</h2>
            <p className="text-white/90 mb-10 text-xl font-medium max-w-2xl mx-auto">Join the next cohort of future-ready data professionals.</p>
            <Link to="/register">
              <Button size="lg" className="bg-brand-dark text-white border-none hover:bg-slate-900 shadow-xl px-10 py-4 text-lg">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
