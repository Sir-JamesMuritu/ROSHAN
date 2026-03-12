import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays } from "lucide-react";

const statusLabels: Record<string, string> = {
  open: "Registration Open",
  closed: "Registration Closed",
  upcoming: "Coming Soon",
  full: "Fully Booked",
};

const IntakeBanner = () => {
  const { data: intake } = useQuery({
    queryKey: ["active-intake"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (!intake) return null;

  return (
    <div className="bg-intake py-2.5">
      <div className="container flex items-center justify-center gap-2 text-sm font-semibold text-intake-foreground">
        <CalendarDays className="h-4 w-4" />
        <span>{intake.name} – {statusLabels[intake.status] || intake.status}</span>
      </div>
    </div>
  );
};

export default IntakeBanner;
