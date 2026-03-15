import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, User, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getProfileCompletion } from "@/lib/profileCompletion";

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

const StudentOverview = () => {
  const { user, profile } = useAuth();

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

  const { data: payments = [] } = useQuery({
    queryKey: ["student-payments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("amount")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: programCount = 0 } = useQuery({
    queryKey: ["available-programs-count"],
    queryFn: async () => {
      const { count } = await supabase.from("programs").select("*", { count: "exact", head: true }).eq("status", "available");
      return count || 0;
    },
  });

  const acceptedEnrollments = enrollments.filter((e: any) => e.status === "enrolled");

  const totalFee = acceptedEnrollments.reduce((sum: number, e: any) => {
    const cost = parseFloat(e.programs?.cost?.replace(/[^0-9.]/g, "") || "0");
    return sum + cost;
  }, 0);
  const paidFee = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const balanceFee = totalFee - paidFee;

  const stats = [
    { label: "Enrolled Programs", value: acceptedEnrollments.length, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
    { label: "Available Programs", value: programCount, icon: GraduationCap, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Student ID", value: profile?.student_id || "—", icon: User, color: "text-purple-500 bg-purple-500/10" },
  ];

  const feeStats = [
    { label: "Total Fee", value: `KSh ${totalFee.toLocaleString()}`, icon: Wallet, color: "text-amber-500 bg-amber-500/10" },
    { label: "Paid Fee", value: `KSh ${paidFee.toLocaleString()}`, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Balance Fee", value: `KSh ${balanceFee.toLocaleString()}`, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
  ];

  const profileCompletion = getProfileCompletion(profile);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          Welcome, {profile?.full_name || "Student"} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Student ID: <span className="font-mono font-medium text-foreground">{profile?.student_id || "Generating..."}</span>
        </p>
      </motion.div>

      {/* Profile Completion Tracker */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Profile Completion</p>
              <span className={`text-sm font-bold ${profileCompletion >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                {profileCompletion}%
              </span>
            </div>
            <Progress value={profileCompletion} className="h-3" />
            {profileCompletion < 80 && (
              <p className="mt-2 text-xs text-destructive">
                Complete your profile to at least 80% to enroll in programs.{" "}
                <Link to="/profile" className="underline font-medium">Update Profile →</Link>
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
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

      {/* Fee Summary */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Fee Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {feeStats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
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
      </section>

      {/* Recent Enrollments */}
      {enrollments.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Recent Enrollments</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.slice(0, 3).map((enrollment: any) => {
              const statusColor = enrollmentStatusColors[enrollment.status] || enrollmentStatusColors.not_applied;
              const statusLabel = enrollmentStatusLabels[enrollment.status] || enrollment.status;
              return (
                <Card key={enrollment.id}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{enrollment.programs?.title}</p>
                      <Badge variant="outline" className={`text-xs ${statusColor}`}>
                        {statusLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{enrollment.programs?.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentOverview;
