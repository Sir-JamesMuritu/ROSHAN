import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const Certificates = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState<string | null>(null);

  // Fetch completed enrollments with program info
  const { data: completedEnrollments = [] } = useQuery({
    queryKey: ["completed-enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, program_id, enrolled_at, programs(title, duration)")
        .eq("user_id", user!.id)
        .eq("status", "completed");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch already issued certificates
  const { data: issuedCerts = [] } = useQuery({
    queryKey: ["student-certificates", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_certificates")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const generateCertNumber = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `RTI-${year}-${rand}`;
  };

  const generatePDF = (
    studentName: string,
    studentId: string,
    programTitle: string,
    certNumber: string,
    issuedDate: Date
  ) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, w, h, "F");

    // Inner border
    doc.setDrawColor(234, 179, 8);
    doc.setLineWidth(1.5);
    doc.roundedRect(12, 12, w - 24, h - 24, 4, 4, "S");
    doc.setLineWidth(0.5);
    doc.roundedRect(16, 16, w - 32, h - 32, 3, 3, "S");

    // Header decoration
    doc.setFillColor(234, 179, 8);
    doc.rect(w / 2 - 30, 20, 60, 1.5, "F");

    // Institution name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(234, 179, 8);
    doc.text("ROSHAN TRAINING INSTITUTE", w / 2, 35, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("RTI— Excellence in Data & AI Training", w / 2, 42, { align: "center" });

    // Certificate title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text("CERTIFICATE", w / 2, 62, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(148, 163, 184);
    doc.text("OF COMPLETION", w / 2, 70, { align: "center" });

    // Divider
    doc.setFillColor(234, 179, 8);
    doc.rect(w / 2 - 25, 76, 50, 0.8, "F");

    // "This is to certify that"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(148, 163, 184);
    doc.text("This is to certify that", w / 2, 88, { align: "center" });

    // Student name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(studentName, w / 2, 102, { align: "center" });

    // Student ID
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Student ID: ${studentId}`, w / 2, 110, { align: "center" });

    // Completion text
    doc.setFontSize(11);
    doc.text("has successfully completed the program", w / 2, 122, { align: "center" });

    // Program title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(234, 179, 8);
    doc.text(programTitle, w / 2, 136, { align: "center" });

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Issued on ${issuedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      w / 2,
      148,
      { align: "center" }
    );

    // Footer section with cert number and signatures
    const footerY = 168;

    // Principal signature
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(50, footerY, 110, footerY);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Christopher", 80, footerY + 5, { align: "center" });
    doc.setFontSize(8);
    doc.text("Principal", 80, footerY + 10, { align: "center" });

    // Certificate number
    doc.setFontSize(8);
    doc.text(`Certificate No: ${certNumber}`, w / 2, footerY + 10, { align: "center" });

    // Counselor signature
    doc.line(w - 110, footerY, w - 50, footerY);
    doc.setFontSize(9);
    doc.text("Mr. Isaac", w - 80, footerY + 5, { align: "center" });
    doc.setFontSize(8);
    doc.text("Career Counselor", w - 80, footerY + 10, { align: "center" });

    // Bottom decoration
    doc.setFillColor(234, 179, 8);
    doc.rect(w / 2 - 30, h - 22, 60, 1, "F");

    return doc;
  };

  const handleGenerate = async (enrollment: any) => {
    const enrollmentId = enrollment.id;
    setGenerating(enrollmentId);
    try {
      const certNumber = generateCertNumber();
      const issuedAt = new Date();
      const programTitle = enrollment.programs?.title || "Program";
      const studentName = profile?.full_name || "Student";
      const studentId = profile?.student_id || "N/A";

      // Save certificate record
      const { error } = await supabase.from("student_certificates").insert({
        user_id: user!.id,
        enrollment_id: enrollmentId,
        program_id: enrollment.program_id,
        certificate_number: certNumber,
        issued_at: issuedAt.toISOString(),
      });
      if (error) throw error;

      // Generate and download PDF
      const doc = generatePDF(studentName, studentId, programTitle, certNumber, issuedAt);
      doc.save(`RTI-Certificate-${programTitle.replace(/\s+/g, "-")}.pdf`);

      queryClient.invalidateQueries({ queryKey: ["student-certificates"] });
      toast({ title: "Certificate generated!", description: `Certificate #${certNumber}` });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(null);
    }
  };

  const handleRedownload = (enrollment: any, cert: any) => {
    const programTitle = enrollment.programs?.title || "Program";
    const studentName = profile?.full_name || "Student";
    const studentId = profile?.student_id || "N/A";
    const doc = generatePDF(studentName, studentId, programTitle, cert.certificate_number, new Date(cert.issued_at));
    doc.save(`RTI-Certificate-${programTitle.replace(/\s+/g, "-")}.pdf`);
  };

  const issuedMap = new Map(issuedCerts.map((c: any) => [c.enrollment_id, c]));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Certificates</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedEnrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Award className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No Certificates Yet</p>
              <p className="mt-2 text-sm text-center max-w-md">
                Certificates will appear here once you complete your enrolled programs. Keep up the great work!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedEnrollments.map((enrollment: any, i: number) => {
                const cert = issuedMap.get(enrollment.id);
                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{enrollment.programs?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {cert
                            ? `Cert #${cert.certificate_number} • Issued ${new Date(cert.issued_at).toLocaleDateString()}`
                            : `Completed • ${enrollment.programs?.duration || ""}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cert ? (
                        <>
                          <Badge variant="default" className="bg-green-600">Issued</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleRedownload(enrollment, cert)}>
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            Download
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGenerate(enrollment)}
                          disabled={generating === enrollment.id}
                        >
                          {generating === enrollment.id ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Award className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Generate Certificate
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;
