import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GraduationCap, BookOpen, User, LogOut, Clock, DollarSign, ChevronDown, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ongoing: "bg-blue-100 text-blue-700 border-blue-200",
  ended: "bg-muted text-muted-foreground border-border",
  coming_soon: "bg-amber-100 text-amber-700 border-amber-200",
};

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
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
      toast.success("Successfully enrolled!");
    },
    onError: (error: Error) => {
      if (error.message.includes("duplicate")) {
        toast.info("You're already enrolled in this program.");
      } else {
        toast.error("Failed to enroll. Please try again.");
      }
    },
  });

  const enrolledProgramIds = new Set(enrollments.map((e: any) => e.program_id));

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">RTI</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {profile?.full_name || user?.email}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground">{profile?.full_name || "Student"}</p>
                <p className="text-xs text-muted-foreground">{profile?.student_id || "ID pending..."}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="container py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Welcome, {profile?.full_name || "Student"} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Student ID: <span className="font-mono font-medium text-foreground">{profile?.student_id || "Generating..."}</span>
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {[
            { label: "Enrolled Programs", value: enrollments.length, icon: BookOpen },
            { label: "Available Programs", value: programs.filter((p: any) => p.status === "available").length, icon: GraduationCap },
            { label: "Student ID", value: profile?.student_id || "—", icon: User },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* My Enrollments */}
        {enrollments.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">My Enrollments</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment: any) => (
                <Card key={enrollment.id} className="border-secondary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                        Enrolled
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </span>
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
              ))}
            </div>
          </section>
        )}

        {/* All Programs */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">All Programs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program: any) => (
              <Card key={program.id}>
                <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={statusColors[program.status] || ""}>
                      {program.status.replace("_", " ")}
                    </Badge>
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
                    disabled={enrolledProgramIds.has(program.id) || program.status === "ended"}
                    onClick={() => enrollMutation.mutate(program.id)}
                  >
                    {enrolledProgramIds.has(program.id)
                      ? "Already Enrolled"
                      : program.status === "ended"
                        ? "Ended"
                        : program.status === "coming_soon"
                          ? "Notify Me"
                          : "Enroll Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
            {programs.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-12">No programs available yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
