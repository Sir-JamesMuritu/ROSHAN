import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, User, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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

  const totalFee = enrollments.reduce((sum: number, e: any) => {
    const cost = parseFloat(e.programs?.cost?.replace(/[^0-9.]/g, "") || "0");
    return sum + cost;
  }, 0);
  const paidFee = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const balanceFee = totalFee - paidFee;

  const stats = [
    { label: "Enrolled Programs", value: enrollments.length, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
    { label: "Available Programs", value: programCount, icon: GraduationCap, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Student ID", value: profile?.student_id || "—", icon: User, color: "text-purple-500 bg-purple-500/10" },
  ];

  const feeStats = [
    { label: "Total Fee", value: `KSh ${totalFee.toLocaleString()}`, icon: Wallet, color: "text-amber-500 bg-amber-500/10" },
    { label: "Paid Fee", value: `KSh ${paidFee.toLocaleString()}`, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Balance Fee", value: `KSh ${balanceFee.toLocaleString()}`, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
  ];

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
            {enrollments.slice(0, 3).map((enrollment: any) => (
              <Card key={enrollment.id}>
                <CardContent className="p-5">
                  <p className="font-medium text-foreground">{enrollment.programs?.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{enrollment.programs?.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StudentOverview;
