import { ProgramData } from "@/components/ProgramCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getProgramThumbnail } from "@/lib/programThumbnails";
import { motion } from "framer-motion";

interface ProgramModalProps {
  program: ProgramData | null;
  open: boolean;
  onClose: () => void;
}

const statusLabels: Record<string, string> = {
  available: "Available",
  ongoing: "Ongoing",
  ended: "Ended",
  coming_soon: "Coming Soon",
};

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  ended: "bg-muted text-muted-foreground border-border",
  coming_soon: "bg-amber-100 text-amber-700 border-amber-200",
};

const ProgramModal = ({ program, open, onClose }: ProgramModalProps) => {
  if (!program) return null;

  const thumbnail = program.thumbnail_url || getProgramThumbnail(program.title);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        {/* Hero image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={thumbnail}
            alt={program.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <Badge
            variant="outline"
            className={`absolute top-4 left-4 ${statusColors[program.status] || ""}`}
          >
            {statusLabels[program.status] || program.status}
          </Badge>
        </div>

        <div className="px-6 pb-6 -mt-8 relative z-10">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-display text-2xl leading-tight">
              {program.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Details about {program.title}
            </DialogDescription>
          </DialogHeader>

          {/* Meta chips */}
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
              <Clock className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold text-foreground">{program.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
              <DollarSign className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Investment</p>
                <p className="text-sm font-semibold text-foreground">{program.cost}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2">
              <BookOpen className="h-4 w-4 text-secondary" />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Format</p>
                <p className="text-sm font-semibold text-foreground">Hands-on</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              About this program
            </h4>
            <p className="text-sm leading-relaxed text-foreground/80">
              {program.detailed_summary || program.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            {["Project-based curriculum", "Industry mentors", "Career support", "Certificate included"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-secondary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to="/signup" onClick={onClose}>
            <Button variant="hero" size="lg" className="w-full gap-2 text-base">
              {program.status === "coming_soon" ? "Join Waitlist" : "Enroll Now"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramModal;
