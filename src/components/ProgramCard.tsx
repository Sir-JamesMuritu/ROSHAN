import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { getProgramThumbnail } from "@/lib/programThumbnails";

type ProgramStatus = "available" | "ongoing" | "ended" | "coming_soon";

export interface ProgramData {
  id: string;
  title: string;
  description: string | null;
  detailed_summary: string | null;
  duration: string | null;
  cost: string | null;
  status: string;
  thumbnail_url?: string | null;
}

const statusColors: Record<ProgramStatus, string> = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  ended: "bg-muted text-muted-foreground border-border",
  coming_soon: "bg-amber-100 text-amber-700 border-amber-200",
};

const statusLabels: Record<ProgramStatus, string> = {
  available: "Available",
  ongoing: "Ongoing",
  ended: "Ended",
  coming_soon: "Coming Soon",
};

interface ProgramCardProps {
  program: ProgramData;
  index: number;
  onEnroll: (program: ProgramData) => void;
}

const ProgramCard = ({ program, index, onEnroll }: ProgramCardProps) => {
  const status = program.status as ProgramStatus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={program.thumbnail_url || getProgramThumbnail(program.title)}
          alt={program.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <Badge variant="outline" className={`absolute top-3 left-3 ${statusColors[status] || ""}`}>
          {statusLabels[status] || status}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">

        <h3 className="mb-2 font-display text-lg font-semibold text-card-foreground">
          {program.title}
        </h3>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {program.description}
        </p>

        <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {program.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            {program.cost}
          </span>
        </div>

        <Button
          variant="default"
          className="w-full"
          disabled={status === "ended"}
          onClick={() => onEnroll(program)}
        >
          {status === "coming_soon" ? "Notify Me" : status === "ended" ? "Ended" : "Enroll Now"}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
