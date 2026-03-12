import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const FeesStatement = () => {
  const { user } = useAuth();

  const { data: enrollments = [] } = useQuery({
    queryKey: ["student-enrollments-fees", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, enrolled_at, programs(title, cost)")
        .eq("user_id", user!.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["student-payments-statement", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("enrollment_id, amount, paid_at")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Group payments by enrollment
  const paymentsByEnrollment = payments.reduce((acc: Record<string, number>, p: any) => {
    acc[p.enrollment_id] = (acc[p.enrollment_id] || 0) + Number(p.amount);
    return acc;
  }, {});

  const totalFee = enrollments.reduce((sum: number, e: any) => {
    return sum + parseFloat(e.programs?.cost?.replace(/[^0-9.]/g, "") || "0");
  }, 0);
  const totalPaid = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
  const totalBalance = totalFee - totalPaid;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Fees Statement</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Total Fee", value: `KSh ${totalFee.toLocaleString()}`, icon: Wallet, color: "text-amber-500 bg-amber-500/10" },
          { label: "Total Paid", value: `KSh ${totalPaid.toLocaleString()}`, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Balance", value: `KSh ${totalBalance.toLocaleString()}`, icon: AlertCircle, color: totalBalance > 0 ? "text-red-500 bg-red-500/10" : "text-emerald-500 bg-emerald-500/10" },
        ].map((stat, i) => (
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

      {/* Statement Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Statement of Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No Enrollments Yet</p>
                <p className="mt-2 text-sm text-center max-w-md">
                  Your fees statement will appear here once you enroll in a program.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((e: any) => {
                    const fee = parseFloat(e.programs?.cost?.replace(/[^0-9.]/g, "") || "0");
                    const paid = paymentsByEnrollment[e.id] || 0;
                    const balance = fee - paid;
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.programs?.title || "—"}</TableCell>
                        <TableCell>{new Date(e.enrolled_at).toLocaleDateString()}</TableCell>
                        <TableCell>KSh {fee.toLocaleString()}</TableCell>
                        <TableCell>KSh {paid.toLocaleString()}</TableCell>
                        <TableCell className={balance > 0 ? "text-destructive font-medium" : "text-emerald-600 font-medium"}>
                          KSh {balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={balance <= 0 ? "default" : balance < fee ? "secondary" : "destructive"}>
                            {balance <= 0 ? "Cleared" : balance < fee ? "Partial" : "Unpaid"}
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
    </div>
  );
};

export default FeesStatement;
