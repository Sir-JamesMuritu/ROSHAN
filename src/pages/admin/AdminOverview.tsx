import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Bell, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AdminOverview = () => {
  const { data: programCount = 0 } = useQuery({
    queryKey: ["admin-program-count"],
    queryFn: async () => {
      const { count } = await supabase.from("programs").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: enrollmentCount = 0 } = useQuery({
    queryKey: ["admin-enrollment-count"],
    queryFn: async () => {
      const { count } = await supabase.from("enrollments").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["admin-notification-count"],
    queryFn: async () => {
      const { count } = await supabase.from("notifications").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: studentCount = 0 } = useQuery({
    queryKey: ["admin-student-count"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    { label: "Total Programs", value: programCount, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
    { label: "Total Enrollments", value: enrollmentCount, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Active Notifications", value: notificationCount, icon: Bell, color: "text-amber-500 bg-amber-500/10" },
    { label: "Registered Students", value: studentCount, icon: Users, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
