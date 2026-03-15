import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CreditCard, Phone, Loader2, CheckCircle2, AlertCircle, Smartphone, History, Download, Receipt } from "lucide-react";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const paymentSchema = z.object({
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(?:254|\+254|0)?[17]\d{8}$/, "Enter a valid Safaricom number (e.g., 0712345678)"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, "Minimum amount is KES 1")
    .refine((val) => Number(val) <= 150000, "Maximum amount is KES 150,000"),
  enrollment_id: z.string().min(1, "Please select a program"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const ITEMS_PER_PAGE = 5;

const FeePayment = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      phone_number: "",
      amount: "",
      enrollment_id: "",
    },
  });

  // Fetch user's enrollments
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["user-enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          status,
          programs (
            id,
            title,
            cost
          )
        `)
        .eq("user_id", user?.id)
        .eq("status", "enrolled");

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch user's payment history with count
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ["user-payments", user?.id, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("payments")
        .select(`
          id,
          amount,
          paid_at,
          reference,
          payment_method,
          notes,
          enrollments (
            programs (
              title
            )
          )
        `, { count: "exact" })
        .eq("user_id", user?.id)
        .order("paid_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { payments: data, totalCount: count || 0 };
    },
    enabled: !!user?.id,
  });

  const payments = paymentsData?.payments;
  const totalCount = paymentsData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    setPaymentStatus("pending");
    setStatusMessage("Initiating M-Pesa payment...");

    try {
      const { data: response, error } = await supabase.functions.invoke("intasend-stk-push", {
        body: {
          phone_number: data.phone_number,
          amount: Number(data.amount),
          enrollment_id: data.enrollment_id,
          narrative: "Fee Payment - RTI",
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to initiate payment");
      }

      if (response?.success) {
        setPaymentStatus("success");
        setStatusMessage(response.message || "Please check your phone and enter your M-Pesa PIN to complete the payment.");
        toast({
          title: "Payment Initiated",
          description: "Check your phone for the M-Pesa prompt.",
        });
        // Refresh payments after a short delay to allow webhook processing
        setTimeout(() => {
          setCurrentPage(1);
          queryClient.invalidateQueries({ queryKey: ["user-payments", user?.id] });
        }, 5000);
      } else {
        throw new Error(response?.error || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setStatusMessage(error.message || "Failed to initiate payment. Please try again.");
      toast({
        title: "Payment Failed",
        description: error.message || "Could not initiate payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPayment = () => {
    setPaymentStatus("idle");
    setStatusMessage("");
    form.reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const generateReceiptPDF = (payment: any) => {
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
    doc.text("RTI", 20, 22);
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

    doc.save(`RTI-Receipt-${payment.id.slice(0, 8).toUpperCase()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Fee Payment</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="h-5 w-5 text-primary" />
              Pay via M-Pesa
            </CardTitle>
            <CardDescription>
              Enter your Safaricom number to receive an STK push prompt
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paymentStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Payment Initiated!</h3>
                <p className="mb-6 max-w-sm text-sm text-muted-foreground">{statusMessage}</p>
                <Button onClick={resetPayment} variant="outline">
                  Make Another Payment
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="enrollment_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select program to pay for" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {enrollmentsLoading ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : enrollments && enrollments.length > 0 ? (
                              enrollments.map((enrollment: any) => (
                                <SelectItem key={enrollment.id} value={enrollment.id}>
                                  {enrollment.programs?.title} - {enrollment.programs?.cost || "N/A"}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No active enrollments
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>M-Pesa Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="0712345678"
                              className="pl-10"
                              {...field}
                              disabled={isProcessing}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Enter your Safaricom number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (KES)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              KES
                            </span>
                            <Input
                              type="number"
                              placeholder="1000"
                              className="pl-12"
                              {...field}
                              disabled={isProcessing}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Enter amount between KES 1 - 150,000</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentStatus === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Payment Failed</AlertTitle>
                      <AlertDescription>{statusMessage}</AlertDescription>
                    </Alert>
                  )}

                  {paymentStatus === "pending" && (
                    <Alert>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <AlertTitle>Processing</AlertTitle>
                      <AlertDescription>{statusMessage}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing || !enrollments?.length}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay with M-Pesa
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Pay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  1
                </span>
                <p>Select the program you want to pay for from the dropdown</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  2
                </span>
                <p>Enter your Safaricom M-Pesa registered phone number</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  3
                </span>
                <p>Enter the amount you wish to pay</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  4
                </span>
                <p>Click "Pay with M-Pesa" and wait for the STK push on your phone</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  5
                </span>
                <p>Enter your M-Pesa PIN to complete the payment</p>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sandbox Mode</AlertTitle>
              <AlertDescription>
                This is a test environment. No real money will be charged. Use test phone numbers like 254708374149.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Payment History
          </CardTitle>
          <CardDescription>
            Your recent M-Pesa transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : payments && payments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="w-20">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(payment.paid_at), "MMM d, yyyy")}
                          <span className="block text-xs text-muted-foreground">
                            {format(new Date(payment.paid_at), "h:mm a")}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {payment.enrollments?.programs?.title || "N/A"}
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {payment.payment_method || "manual"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.reference || "—"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => generateReceiptPDF(payment)}
                            title="Download PDF Receipt"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} payments
                  </p>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          if (totalPages <= 5) return true;
                          if (page === 1 || page === totalPages) return true;
                          return Math.abs(page - currentPage) <= 1;
                        })
                        .map((page, idx, arr) => (
                          <PaginationItem key={page}>
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span className="px-2 text-muted-foreground">...</span>
                            )}
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Receipt className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-sm font-medium">No payments yet</p>
              <p className="mt-1 text-xs">Your payment history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeePayment;
