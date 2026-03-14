import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Lightbulb, Shield, Zap, Heart, Users } from 'lucide-react';

const About = () => {
  const values = [
    { icon: Zap, title: "Excellence", desc: "We strive for the highest standards in training and delivery.", color: "text-primary", border: "border-primary" },
    { icon: Shield, title: "Integrity", desc: "Honesty and transparency in all our operations.", color: "text-secondary", border: "border-secondary" },
    { icon: Lightbulb, title: "Innovation", desc: "Embracing new technologies and methods.", color: "text-primary", border: "border-primary" },
    { icon: Heart, title: "Inclusivity", desc: "Creating a welcoming environment for all learners.", color: "text-secondary", border: "border-secondary" },
    { icon: Users, title: "Learner-Centered", desc: "Focusing on the unique needs of every student.", color: "text-primary", border: "border-primary" },
    { icon: Target, title: "Practical Impact", desc: "Ensuring skills translate to real-world results.", color: "text-secondary", border: "border-secondary" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pb-20">
        {/* Page Header */}
        <div className="hero-bg py-10 text-center text-white mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">About RTI</h1>
          <p className="text-xl text-primary-foreground/90 font-light">Bridging the Gap • Driving Innovation</p>
        </div>

        {/* Intro */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">Who We Are</span>
              <h2 className="text-3xl font-bold text-foreground mb-6">A Premier Data Training Institute</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Roshan Training Institute is a premier EdTech institution dedicated to bridging the data skills gap in Africa and beyond. Founded in 2023, we focus on producing competent, ethical, and innovative data professionals.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-8 border-l-4 border-l-primary bg-muted rounded-r-xl shadow-sm">
                <h2 className="text-xl font-bold text-foreground flex items-center mb-3">
                  <Target className="h-6 w-6 text-primary mr-3" /> Our Mission
                </h2>
                <p className="text-muted-foreground">
                  To empower learners with practical data analysis and AI skills through quality training, mentorship, and real-world applications that enhance employability, productivity, and innovation.
                </p>
              </div>

              <div className="p-8 border-l-4 border-l-secondary bg-muted rounded-r-xl shadow-sm">
                <h2 className="text-xl font-bold text-foreground flex items-center mb-3">
                  <Lightbulb className="h-6 w-6 text-secondary mr-3" /> Our Vision
                </h2>
                <p className="text-muted-foreground">
                  To be a leading data training institute that produces competent, ethical, and innovative data professionals who drive impact locally and globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="bg-muted py-20 mb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">Institute Leadership</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card p-8 rounded-2xl shadow-sm text-center border border-border hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 p-1 border-2 border-primary bg-background">
                  <img src="https://ui-avatars.com/api/?name=Christopher&size=200&background=0B1F3A&color=fff" className="w-full h-full rounded-full" alt="Principal" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Christopher</h3>
                <p className="text-primary font-bold text-sm uppercase mb-4">Principal</p>
                <p className="text-muted-foreground text-sm">Driving the strategic vision and academic excellence of the institute.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl shadow-sm text-center border border-border hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 p-1 border-2 border-secondary bg-background">
                  <img src="https://ui-avatars.com/api/?name=Isaac&size=200&background=F97316&color=fff" className="w-full h-full rounded-full" alt="Counselor" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Mr. Isaac</h3>
                <p className="text-secondary font-bold text-sm uppercase mb-4">College & Career Counselor</p>
                <p className="text-muted-foreground text-sm">Guiding students towards fulfilling career paths and opportunities.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className={`bg-card p-8 rounded-xl shadow-sm border border-border border-t-4 ${v.border} hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg group`}>
                <v.icon className={`h-10 w-10 ${v.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default About;

