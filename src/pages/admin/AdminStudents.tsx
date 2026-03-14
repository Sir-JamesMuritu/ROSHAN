import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Users, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "enrolled", label: "Accepted", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "under_review", label: "Under Review", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "not_applied", label: "Not Applied", color: "bg-muted text-muted-foreground border-border" },
];

const getStatusBadge = (status: string) => {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  if (!found) return { label: status, color: "bg-muted text-muted-foreground border-border" };
  return found;
};

const AdminStudents = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ enrollmentId, newStatus }: { enrollmentId: string; newStatus: string }) => {
      const { error } = await supabase
        .from("enrollments")
        .update({ status: newStatus })
        .eq("id", enrollmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-enrollments"] });
      toast.success("Enrollment status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update enrollment status");
    },
  });

  const deleteEnrollmentMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase
        .from("enrollments")
        .delete()
        .eq("id", enrollmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast.success("Enrollment removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove enrollment");
    },
  });

  const enrollmentsByUser = enrollments.reduce((acc: Record<string, any[]>, e: any) => {
    if (!acc[e.user_id]) acc[e.user_id] = [];
    acc[e.user_id].push(e);
    return acc;
  }, {});

  const filtered = students.filter((s: any) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (s.full_name || "").toLowerCase().includes(q) ||
      (s.student_id || "").toLowerCase().includes(q);
    
    if (statusFilter === "all") return matchesSearch;
    
    const userEnrolls = enrollmentsByUser[s.user_id] || [];
    if (statusFilter === "not_applied") return matchesSearch && userEnrolls.length === 0;
    return matchesSearch && userEnrolls.some((e: any) => e.status === statusFilter);
  });

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Student Enrollment Overview</h1>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or student ID..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <TableHead>Profile</TableHead>
                  <TableHead>Enrolled Programs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s: any) => {
                  const userEnrollments = enrollmentsByUser[s.user_id] || [];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-sm font-medium">{s.student_id || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={s.avatar_url || ""} alt={s.full_name || "Student"} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                              {getInitials(s.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm leading-tight">{s.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{s.phone || "No phone"}</p>
                          </div>
                        </div>
                      </TableCell>
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
                      <TableCell>
                        <div className="flex flex-col gap-2 max-w-[180px]">
                          {userEnrollments.length > 0 ? (
                            userEnrollments.map((e: any) => {
                              const statusInfo = getStatusBadge(e.status);
                              return (
                                <Select
                                  key={e.id}
                                  value={e.status}
                                  onValueChange={(val) =>
                                    updateStatusMutation.mutate({ enrollmentId: e.id, newStatus: val })
                                  }
                                >
                                  <SelectTrigger className="h-7 text-xs w-[140px]">
                                    <SelectValue>
                                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                                        {statusInfo.label}
                                      </span>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {STATUS_OPTIONS.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${opt.color}`}>
                                          {opt.label}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            })
                          ) : (
                            <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                              Not Applied
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          {userEnrollments.length > 0 ? (
                            userEnrollments.map((e: any) => (
                              <AlertDialog key={e.id}>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Enrollment</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Remove <strong>{s.full_name || "this student"}</strong> from <strong>{e.programs?.title || "this program"}</strong>? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => deleteEnrollmentMutation.mutate(e.id)}
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
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
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
