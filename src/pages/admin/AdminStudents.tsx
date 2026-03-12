import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const AdminStudents = () => {
  const [search, setSearch] = useState("");

  const { data: students = [] } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["admin-all-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, programs(title)");
      if (error) throw error;
      return data;
    },
  });

  // Group enrollments by user_id
  const enrollmentsByUser = enrollments.reduce((acc: Record<string, any[]>, e: any) => {
    if (!acc[e.user_id]) acc[e.user_id] = [];
    acc[e.user_id].push(e);
    return acc;
  }, {});

  const filtered = students.filter((s: any) => {
    const q = search.toLowerCase();
    return (
      (s.full_name || "").toLowerCase().includes(q) ||
      (s.student_id || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Student Enrollment Overview</h1>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or student ID..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Enrolled Programs</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s: any) => {
                  const userEnrollments = enrollmentsByUser[s.user_id] || [];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-sm font-medium">{s.student_id || "—"}</TableCell>
                      <TableCell className="font-medium">{s.full_name || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.phone || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {userEnrollments.length > 0 ? (
                            userEnrollments.map((e: any) => (
                              <Badge key={e.id} variant="outline" className="text-xs bg-secondary/10 text-secondary border-secondary/30">
                                {e.programs?.title || "Unknown"}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <Users className="mx-auto mb-2 h-8 w-8 opacity-40" />
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminStudents;
