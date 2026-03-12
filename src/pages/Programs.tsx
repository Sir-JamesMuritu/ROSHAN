import Navbar from "@/components/Navbar";
import IntakeBanner from "@/components/IntakeBanner";
import Footer from "@/components/Footer";
import ProgramCard from "@/components/ProgramCard";
import ProgramModal from "@/components/ProgramModal";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
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

const Programs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const { data: programs = [] } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").order("created_at");
      if (error) throw error;
      return data as Program[];
    },
  });

  useEffect(() => {
    const programId = searchParams.get("programId");
    if (programId && programs.length > 0 && !selectedProgram) {
      const program = programs.find((p) => p.id === programId);
      if (program) {
        setSelectedProgram(program);
      }
    }
  }, [searchParams, programs, selectedProgram]);

  const handleCloseModal = () => {
    setSelectedProgram(null);
    if (searchParams.has("programId")) {
      setSearchParams(new URLSearchParams());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <IntakeBanner />
      <Navbar />

      <div className="hero-bg py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in duration-700">
          <h1 className="text-4xl font-bold text-white mb-4">Our Programs</h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto font-light">
            Skill-based training designed for the modern data economy.
          </p>
        </div>
      </div>

      <section className="pb-16">
        <div className="container">

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <ProgramCard
                key={program.id}
                program={program as any}
                index={i}
                onEnroll={setSelectedProgram as any}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <ProgramModal
        program={selectedProgram as any}
        open={!!selectedProgram}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Programs;
