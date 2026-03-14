import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Brain, Code2, TrendingUp } from "lucide-react";

import slide1 from "@/assets/slides/boy-learning.jpeg";
import slide2 from "@/assets/slides/male-leaning.jpg";
import slide3 from "@/assets/slides/two-learning.jpg";
import slide4 from "@/assets/slides/Analysis.png";
// import slide5 from "@/assets/slides/classroom.jpeg";
import slide6 from "@/assets/slides/geralt-big.jpeg";
import slide7 from "@/assets/slides/graduate.jpeg";
import slide8 from "@/assets/slides/training.jpeg";

const slideImages = [slide1, slide2, slide3, slide4, slide6, slide7, slide8];

const animatedPhrases = [
  { text: "AI & Data Skills", icon: BarChart3 },
  { text: "Digital Marketing", icon: Brain },
  { text: "Business Analytics", icon: TrendingUp },
  { text: "Software Engineering", icon: Code2 },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animatedPhrases.length);
    }, 2500);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideImages.length);
    }, 8000);
    return () => clearInterval(imageInterval);
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh] md:min-h-[500px]">
          {/* Left Side Content */}
          <div className="max-w-2xl">
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
              className="mb-8 font-display text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
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
              className="text-base sm:text-lg md:text-xl text-slate-300 max-w-xl mb-10 font-light leading-relaxed border-l-4 border-secondary pl-6"
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

          {/* Right Side Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={slideImages[currentImageIndex]}
                alt="Students learning"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/80 to-transparent"></div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;
