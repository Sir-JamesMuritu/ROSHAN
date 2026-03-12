import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Users, TrendingUp, AlertTriangle, Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AdminFinancials = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("manual");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyStudentId, setNotifyStudentId] = useState("");
  const [recording, setRecording] = useState(false);

  // Fetch all enrollments with program info
  const { data: enrollments = [] } = useQuery({
    queryKey: ["admin-all-enrollments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*, programs(title, cost)")
        .order("enrolled_at", { ascending: false });
      return data || [];
    },
  });

  // Fetch profiles separately
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles-list"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, full_name, student_id").order("full_name");
      return data || [];
    },
  });

  const profileMap = profiles.reduce((acc: any, p: any) => {
    acc[p.user_id] = p;
    return acc;
  }, {} as Record<string, any>);

  // Fetch all payments
  const { data: payments = [] } = useQuery({
    queryKey: ["admin-all-payments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("payments")
        .select("*, enrollments(programs(title))")
        .order("paid_at", { ascending: false });
      return data || [];
    },
  });

  // (profiles already fetched above)

  // Calculate financial summary
  const totalExpectedRevenue = enrollments.reduce((sum: number, e: any) => {
    const cost = parseFloat(e.programs?.cost?.replace(/[^0-9.]/g, "") || "0");
    return sum + cost;
  }, 0);

  const totalCollected = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const totalOutstanding = totalExpectedRevenue - totalCollected;
  const studentsPaid = new Set(payments.map((p: any) => p.user_id)).size;
  const totalStudents = new Set(enrollments.map((e: any) => e.user_id)).size;

  // Build per-student summary
  const studentSummary = enrollments.reduce((acc: any, e: any) => {
    const userId = e.user_id;
    if (!acc[userId]) {
      acc[userId] = {
        userId,
        name: profileMap[userId]?.full_name || "Unknown",
        studentId: profileMap[userId]?.student_id || "—",
        totalFee: 0,
        totalPaid: 0,
        enrollments: [],
      };
    }
    const cost = parseFloat(e.programs?.cost?.replace(/[^0-9.]/g, "") || "0");
    acc[userId].totalFee += cost;
    acc[userId].enrollments.push({ id: e.id, program: e.programs?.title, cost });
    return acc;
  }, {} as Record<string, any>);

  // Add payments to student summary
  payments.forEach((p: any) => {
    if (studentSummary[p.user_id]) {
      studentSummary[p.user_id].totalPaid += Number(p.amount);
    }
  });

  const studentList = Object.values(studentSummary) as any[];

  // Record payment mutation
  const recordPaymentMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("payments").insert({
        user_id: selectedStudentId,
        enrollment_id: selectedEnrollmentId,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        reference,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-all-payments"] });
      toast({ title: "Payment recorded successfully" });
      setPaymentOpen(false);
      setSelectedStudentId("");
      setSelectedEnrollmentId("");
      setAmount("");
      setReference("");
    },
    onError: (err: any) => {
      toast({ title: "Failed to record payment", description: err.message, variant: "destructive" });
    },
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notifications").insert({
        message: notifyMessage,
        type: "public",
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Notification sent" });
      setNotifyOpen(false);
      setNotifyMessage("");
      setNotifyStudentId("");
    },
    onError: (err: any) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const selectedStudentEnrollments = selectedStudentId
    ? studentSummary[selectedStudentId]?.enrollments || []
    : [];

  const stats = [
    { label: "Total Expected Revenue", value: `$${totalExpectedRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Total Collected", value: `$${totalCollected.toLocaleString()}`, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
    { label: "Outstanding Balance", value: `$${totalOutstanding.toLocaleString()}`, icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10" },
    { label: "Students Paid", value: `${studentsPaid} / ${totalStudents}`, icon: Users, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Financials</h1>
        <div className="flex gap-2">
          <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Student Payment</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student *</Label>
                  <Select value={selectedStudentId} onValueChange={(v) => { setSelectedStudentId(v); setSelectedEnrollmentId(""); }}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {studentList.map((s: any) => (
                        <SelectItem key={s.userId} value={s.userId}>{s.name} ({s.studentId})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedStudentId && (
                  <div>
                    <Label>Program / Enrollment *</Label>
                    <Select value={selectedEnrollmentId} onValueChange={setSelectedEnrollmentId}>
                      <SelectTrigger><SelectValue placeholder="Select enrollment" /></SelectTrigger>
                      <SelectContent>
                        {selectedStudentEnrollments.map((e: any) => (
                          <SelectItem key={e.id} value={e.id}>{e.program} (${e.cost})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label>Amount ($) *</Label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual / Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reference</Label>
                  <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Receipt or reference number" />
                </div>
                <Button onClick={() => recordPaymentMutation.mutate()} disabled={!selectedStudentId || !selectedEnrollmentId || !amount} className="w-full">
                  Record Payment
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Send className="mr-2 h-4 w-4" />Send Reminder</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Send Fee Reminder</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Message *</Label>
                  <Textarea value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} placeholder="e.g. Please settle your outstanding fee balance..." rows={4} />
                </div>
                <Button onClick={() => sendNotificationMutation.mutate()} disabled={!notifyMessage} className="w-full">
                  <Send className="mr-2 h-4 w-4" />Send Notification
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
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

      {/* Student Financial Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />Student Fee Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentList.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No enrolled students yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Total Fee</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentList.map((s: any) => {
                    const balance = s.totalFee - s.totalPaid;
                    return (
                      <TableRow key={s.userId}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="font-mono text-sm">{s.studentId}</TableCell>
                        <TableCell>${s.totalFee.toLocaleString()}</TableCell>
                        <TableCell>${s.totalPaid.toLocaleString()}</TableCell>
                        <TableCell className={balance > 0 ? "text-destructive font-medium" : "text-emerald-600 font-medium"}>
                          ${balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={balance <= 0 ? "default" : balance < s.totalFee ? "secondary" : "destructive"}>
                            {balance <= 0 ? "Cleared" : balance < s.totalFee ? "Partial" : "Unpaid"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Payments */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" />Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No payments recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.slice(0, 20).map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{profileMap[p.user_id]?.full_name || "—"}</TableCell>
                      <TableCell>{p.enrollments?.programs?.title || "—"}</TableCell>
                      <TableCell>${Number(p.amount).toLocaleString()}</TableCell>
                      <TableCell className="capitalize">{p.payment_method?.replace("_", " ")}</TableCell>
                      <TableCell className="font-mono text-sm">{p.reference || "—"}</TableCell>
                      <TableCell>{new Date(p.paid_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminFinancials;
