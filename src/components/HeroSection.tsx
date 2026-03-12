import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Brain, Code2, TrendingUp } from "lucide-react";

const animatedPhrases = [
  { text: "AI & Data Skills", icon: BarChart3 },
  { text: "Digital Marketing", icon: Brain },
  { text: "Business Analytics", icon: TrendingUp },
  { text: "Software Engineering", icon: Code2 },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animatedPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = animatedPhrases[currentIndex].icon;

  return (
    <section className="relative hero-bg text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute bottom-0 left-10 w-12 h-64 bg-white/10 rounded-t-lg animate-pulse"></div>
        <div className="absolute bottom-0 left-24 w-12 h-40 bg-white/10 rounded-t-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-38 w-12 h-80 bg-white/10 rounded-t-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        <div className="absolute top-20 right-20 w-4 h-4 bg-secondary rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-80 animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 flex flex-col items-start justify-center min-h-[50vh] md:min-h-[500px]">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary">
              <CurrentIcon className="h-4 w-4" />
              Now Enrolling
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-8 font-display text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            Build Your Future in{" "} <br className="md:hidden" />
            <span className="relative inline-block text-secondary min-w-[300px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block"
                >
                  {animatedPhrases[currentIndex].text}
                </motion.span>
              </AnimatePresence>
            </span><br className="hidden md:block" />
            for the Global Market
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 font-light leading-relaxed border-l-4 border-secondary pl-6"
          >
            Empowering learners with competency-based training, mentorship, and real-world applications to drive innovation and employability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg shadow-xl hover:shadow-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Apply for Enrollment
              </Button>
            </Link>
            <Link to="/programs">
              <Button size="lg" className="w-full sm:w-auto text-lg backdrop-blur-sm bg-white/5 border border-primary hover:bg-primary/20 text-white">
                Explore Programs
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;
