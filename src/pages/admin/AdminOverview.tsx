import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Bell, TrendingUp, UserCog, Megaphone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DONUT_COLORS = [
  "hsl(160, 84%, 39%)",  // accepted/enrolled - green
  "hsl(38, 92%, 50%)",   // review/pending - amber
  "hsl(0, 84%, 60%)",    // applied/new - red
];

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

  // Enrollment distribution by status
  const { data: enrollmentDistribution = [] } = useQuery({
    queryKey: ["admin-enrollment-distribution"],
    queryFn: async () => {
      const { data } = await supabase.from("enrollments").select("status");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((e) => {
        const s = e.status || "enrolled";
        counts[s] = (counts[s] || 0) + 1;
      });
      const labelMap: Record<string, string> = {
        enrolled: "Accepted",
        applied: "Applied",
        under_review: "Under Review",
        rejected: "Rejected",
      };
      return Object.entries(counts).map(([key, value]) => ({
        name: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
        value,
      }));
    },
  });

  // Top programs by enrollment count
  const { data: topPrograms = [] } = useQuery({
    queryKey: ["admin-top-programs"],
    queryFn: async () => {
      const { data: enrollments } = await supabase.from("enrollments").select("program_id, programs(title)");
      if (!enrollments) return [];
      const counts: Record<string, { title: string; count: number }> = {};
      enrollments.forEach((e: any) => {
        const id = e.program_id;
        if (!counts[id]) counts[id] = { title: e.programs?.title || "Unknown", count: 0 };
        counts[id].count++;
      });
      return Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
  });

  // Recent enrollments (applications)
  const { data: recentApplications = [] } = useQuery({
    queryKey: ["admin-recent-applications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id, enrolled_at, status, user_id, programs(title)")
        .order("enrolled_at", { ascending: false })
        .limit(5);
      if (!data) return [];
      // Fetch profile names for user_ids
      const userIds = [...new Set(data.map((e) => e.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      const nameMap: Record<string, string> = {};
      profiles?.forEach((p) => { nameMap[p.user_id] = p.full_name || "Unknown"; });
      return data.map((e: any) => ({
        ...e,
        student_name: nameMap[e.user_id] || "Unknown",
        program_title: e.programs?.title || "—",
      }));
    },
  });

  const totalEnrollments = enrollmentDistribution.reduce((s, d) => s + d.value, 0);

  const stats = [
    { label: "Total Programs", value: programCount, icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
    { label: "Total Enrollments", value: enrollmentCount, icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Active Notifications", value: notificationCount, icon: Bell, color: "text-amber-500 bg-amber-500/10" },
    { label: "Registered Students", value: studentCount, icon: Users, color: "text-purple-500 bg-purple-500/10" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      enrolled: "bg-emerald-100 text-emerald-700 border-emerald-200",
      applied: "bg-blue-100 text-blue-700 border-blue-200",
      under_review: "bg-yellow-100 text-yellow-700 border-yellow-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      enrolled: "Accepted",
      applied: "Applied",
      under_review: "Under Review",
      rejected: "Rejected",
    };
    return map[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>

      {/* Stats Cards */}
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

      {/* Middle Row: Distribution, Top Programs, Quick Actions */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Enrollment Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Enrollment Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {totalEnrollments > 0 ? (
                <>
                  <div className="relative">
                    <ResponsiveContainer width={200} height={200}>
                      <PieChart>
                        <Pie
                          data={enrollmentDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                          stroke="none"
                        >
                          {enrollmentDistribution.map((_, index) => (
                            <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-2xl font-bold text-foreground">{totalEnrollments}</span>
                      <span className="text-xs text-muted-foreground">TOTAL</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4">
                    {enrollmentDistribution.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        {d.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="py-8 text-sm text-muted-foreground">No enrollment data yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Programs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Top Programs</CardTitle>
            </CardHeader>
            <CardContent>
              {topPrograms.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topPrograms} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="title" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(224, 76%, 48%)" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-8 text-sm text-muted-foreground">No program data yet.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link
                to="/admin/students"
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <UserCog className="h-5 w-5 text-primary" />
                Manage Students
              </Link>
              <Link
                to="/admin/notifications"
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Megaphone className="h-5 w-5 text-secondary" />
                Post Announcement
              </Link>
              <Link
                to="/admin/programs"
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <BookOpen className="h-5 w-5 text-accent" />
                Manage Programs
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Applications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <Link to="/admin/students" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((app: any) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.student_name}</TableCell>
                      <TableCell>{app.program_title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusBadge(app.status)}>
                          {statusLabel(app.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(app.enrolled_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No recent applications.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
