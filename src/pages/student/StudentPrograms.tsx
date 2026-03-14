import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const programStatusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  ended: "bg-muted text-muted-foreground border-border",
  coming_soon: "bg-amber-100 text-amber-700 border-amber-200",
};

const enrollmentStatusColors: Record<string, string> = {
  enrolled: "bg-green-100 text-green-800 border-green-200",
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  under_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  not_applied: "bg-muted text-muted-foreground border-border",
};

const enrollmentStatusLabels: Record<string, string> = {
  enrolled: "Accepted",
  applied: "Applied",
  under_review: "Under Review",
  rejected: "Rejected",
  not_applied: "Not Applied",
};

const StudentPrograms = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: programs = [] } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, programs(*)")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (programId: string) => {
      const { error } = await supabase.from("enrollments").insert({
        user_id: user!.id,
        program_id: programId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Application submitted successfully! Your status is now 'Applied'.");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.info("You've already applied to this program.");
      } else if (error.message.includes("check constraint")) {
        toast.error("Unable to enroll. Please contact support.");
      } else {
        toast.error("Failed to enroll. Please try again.");
      }
    },
  });

  const enrollmentByProgram = enrollments.reduce((acc: Record<string, any>, e: any) => {
    acc[e.program_id] = e;
    return acc;
  }, {});

  const enrolledProgramIds = new Set(enrollments.map((e: any) => e.program_id));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Programs</h1>

      {/* My Enrollments */}
      {enrollments.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">My Enrollments</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment: any) => {
              const statusColor = enrollmentStatusColors[enrollment.status] || enrollmentStatusColors.not_applied;
              const statusLabel = enrollmentStatusLabels[enrollment.status] || enrollment.status;
              return (
                <Card key={enrollment.id} className="border-secondary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={statusColor}>
                        {statusLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-lg">{enrollment.programs?.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{enrollment.programs?.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{enrollment.programs?.duration}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{enrollment.programs?.cost}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* All Programs */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">All Programs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program: any, i: number) => {
            const enrollment = enrollmentByProgram[program.id];
            const isEnrolled = enrolledProgramIds.has(program.id);
            const isRejected = enrollment?.status === "rejected";

            let buttonLabel = "Enroll Now";
            let buttonDisabled = false;

            if (isEnrolled && !isRejected) {
              buttonLabel = enrollmentStatusLabels[enrollment?.status] || "Enrolled";
              buttonDisabled = true;
            } else if (program.status === "ended") {
              buttonLabel = "Ended";
              buttonDisabled = true;
            } else if (program.status === "coming_soon") {
              buttonLabel = "Notify Me";
            }

            return (
              <motion.div key={program.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={programStatusColors[program.status] || ""}>{program.status.replace("_", " ")}</Badge>
                      {enrollment && (
                        <Badge variant="outline" className={`text-xs ${enrollmentStatusColors[enrollment.status] || ""}`}>
                          {enrollmentStatusLabels[enrollment.status] || enrollment.status}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 text-sm text-muted-foreground">{program.description}</p>
                    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{program.duration}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{program.cost}</span>
                    </div>
                    <Button
                      className="w-full"
                      disabled={buttonDisabled}
                      onClick={() => enrollMutation.mutate(program.id)}
                    >
                      {buttonLabel}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {programs.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">No programs available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentPrograms;
