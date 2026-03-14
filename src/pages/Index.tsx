import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntakeBanner from "@/components/IntakeBanner";
import NotificationTicker from "@/components/NotificationTicker";
import ProgramCard from "@/components/ProgramCard";
import ProgramModal from "@/components/ProgramModal";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Database, Zap, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Program = {
  id: string;
  title: string;
  description: string | null;
  detailed_summary: string | null;
  duration: string | null;
  cost: string | null;
  status: string;
  thumbnail_url: string | null;
};

const Index = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const { data: programs = [] } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").order("created_at");
      if (error) throw error;
      return data as Program[];
    },
  });

  const featuredPrograms = programs.filter((p) => p.status === "available").slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <IntakeBanner />
      <Navbar />
      <NotificationTicker />
      <HeroSection />

      {/* ABOUT PREVIEW SECTION */}
      <section className="bg-card py-20 relative border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="w-16 h-1 bg-secondary rounded-full"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">We Bridge the Data Skills Gap</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Roshan Training Institute (RTI), we move beyond theory. Our curriculum is designed by industry experts to ensure you gain hands-on experience with real datasets.
              </p>
              <Link to="/about">
                <Button className="mt-4 hover:scale-105 transition-transform shadow-lg shadow-primary/20 bg-primary text-primary-foreground">Learn More About RTI</Button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="bg-muted p-6 rounded-2xl border-t-4 border-primary shadow-sm hover:-translate-y-2 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-bold text-foreground">Practical Impact</h3>
                </div>
                <div className="bg-muted p-6 rounded-2xl border-t-4 border-secondary shadow-sm hover:-translate-y-2 transition-transform duration-300">
                  <Users className="h-8 w-8 text-secondary mb-3" />
                  <h3 className="font-bold text-foreground">Mentorship</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-muted p-6 rounded-2xl border-t-4 border-accent shadow-sm hover:-translate-y-2 transition-transform duration-300">
                  <Database className="h-8 w-8 text-accent mb-3" />
                  <h3 className="font-bold text-foreground">Real Data</h3>
                </div>
                <div className="bg-muted p-6 rounded-2xl border-t-4 border-foreground shadow-sm hover:-translate-y-2 transition-transform duration-300">
                  <Trophy className="h-8 w-8 text-foreground mb-3" />
                  <h3 className="font-bold text-foreground">Certification</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS METRICS */}
      <section className="bg-primary/5 py-16 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center divide-x divide-primary/20">
            {[
              { label: 'Learners Trained', value: '500+' },
              { label: 'Completion Rate', value: '95%' },
              { label: 'Real-world Projects', value: '50+' },
              { label: 'Industry Partners', value: '10+' }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 hover:scale-105 transition-transform duration-300">
                <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2 tracking-tight">{stat.value}</p>
                <div className="w-12 h-1 bg-secondary mx-auto mb-3 rounded-full"></div>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured Programs
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-6"></div>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Industry-aligned training programs designed to launch your career in data and AI.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrograms.map((program, i) => (
              <ProgramCard
                key={program.id}
                program={program as any}
                index={i}
                onEnroll={setSelectedProgram as any}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/programs">
              <Button variant="outline" className="gap-2">
                View All Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-950 py-20 text-white relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Why Students Choose RTI</h2>
              <div className="space-y-6">
                {[
                  { title: 'Project-based Learning', desc: 'Work with real datasets from day one.' },
                  { title: 'Expert Mentorship', desc: 'Guidance from active industry professionals.' },
                  { title: 'Career Coaching', desc: 'CV reviews, interview prep, and job placement support.' },
                  { title: 'Flexible Learning', desc: 'Online, physical, and hybrid options available.' }
                ].map((item, i) => (
                  <div key={i} className="flex group relative p-4 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10">
                    <div className="mr-5 mt-1">
                      <CheckCircle className="h-6 w-6 text-secondary group-hover:text-yellow-400 transition-colors group-hover:scale-110 duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1 group-hover:text-accent transition-colors">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-primary to-slate-900 rounded-2xl p-1 shadow-2xl hover:rotate-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 rounded-2xl mix-blend-overlay"></div>
              <div className="relative h-full w-full border border-white/10 rounded-xl flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                <div className="text-center p-8 bg-slate-900/90 backdrop-blur-md rounded-xl border border-secondary/40 shadow-2xl hover:scale-105 transition-transform duration-500">
                  <p className="text-secondary font-bold text-xl mb-2 animate-pulse">Next Intake</p>
                  <p className="text-4xl font-bold text-white mb-4">ONGOING</p>
                  <Link to="/signup">
                    <Button size="sm" className="shadow-lg shadow-white/10 hover:shadow-secondary/40 bg-secondary text-secondary-foreground">Register Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* CTA SECTION */}
      <section className="bg-muted py-20 px-4">
        <div className="max-w-6xl mx-auto cta-gradient rounded-3xl p-8 sm:p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.4)] transition-shadow duration-500">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-900 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to launch your career?</h2>
            <p className="text-white/90 mb-10 text-xl font-medium max-w-2xl mx-auto">Join the next cohort of future-ready data professionals.</p>
            <Link to="/signup">
              <Button size="lg" className="bg-slate-900 text-white border-none hover:bg-slate-800 shadow-xl px-10 py-4 text-lg hover:scale-110 transition-transform duration-300">
                Apply Now <ArrowRight className="inline-block h-6 w-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <ProgramModal
        program={selectedProgram as any}
        open={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
      />
    </div>
  );
};

export default Index;
