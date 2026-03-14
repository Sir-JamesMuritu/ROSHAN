import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Download } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const PaymentReceipts = () => {
  const { user, profile } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["student-payment-receipts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, enrollments(programs(title))")
        .eq("user_id", user!.id)
        .order("paid_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const generatePDF = (payment: any) => {
    const doc = new jsPDF();
    const programTitle = payment.enrollments?.programs?.title || "N/A";
    const date = new Date(payment.paid_at).toLocaleDateString("en-KE", {
      year: "numeric", month: "long", day: "numeric",
    });
    const amount = `KSh ${Number(payment.amount).toLocaleString()}`;
    const method = (payment.payment_method || "manual").replace("_", " ");
    const ref = payment.reference || "N/A";
    const studentName = profile?.full_name || "Student";
    const studentId = profile?.student_id || "—";

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("RDTI", 20, 22);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Rwanda Data and Technology Institute", 20, 30);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT RECEIPT", 190, 25, { align: "right" });

    // Receipt details
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: ${payment.id.slice(0, 8).toUpperCase()}`, 190, 55, { align: "right" });
    doc.text(`Date: ${date}`, 190, 61, { align: "right" });

    // Student info
    let y = 70;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Received From:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(studentName, 20, y + 7);
    doc.text(`Student ID: ${studentId}`, 20, y + 14);

    // Divider
    y = 100;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);

    // Payment details table
    y = 112;
    doc.setFillColor(241, 245, 249);
    doc.rect(20, y - 6, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("Description", 25, y);
    doc.text("Amount", 165, y, { align: "right" });

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(`Program: ${programTitle}`, 25, y);
    doc.setFont("helvetica", "bold");
    doc.text(amount, 165, y, { align: "right" });

    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);

    // Total
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total Paid:", 25, y);
    doc.text(amount, 165, y, { align: "right" });

    // Additional info
    y += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Payment Method: ${method.charAt(0).toUpperCase() + method.slice(1)}`, 25, y);
    doc.text(`Reference: ${ref}`, 25, y + 7);

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 260, 190, 260);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an electronically generated receipt and does not require a signature.", 105, 268, { align: "center" });
    doc.text("RTI— Rwanda Data and Technology Institute", 105, 274, { align: "center" });

    doc.save(`RDTI-Receipt-${payment.id.slice(0, 8).toUpperCase()}.pdf`);
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Payment Receipts</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5 text-primary" />
              Your Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading...</p>
            ) : payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Receipt className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No Receipts Yet</p>
                <p className="mt-2 text-sm text-center max-w-md">
                  Payment receipts will appear here after payments are recorded by the institution.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="w-24">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{new Date(p.paid_at).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{p.enrollments?.programs?.title || "—"}</TableCell>
                      <TableCell>KSh {Number(p.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {p.payment_method?.replace("_", " ") || "Manual"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{p.reference || "—"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => generatePDF(p)} title="Download PDF Receipt">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
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

export default PaymentReceipts;
