import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Trash2, Upload, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const AdminCertificateTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [programId, setProgramId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: programs = [] } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const { data } = await supabase.from("programs").select("id, title").order("title");
      return data || [];
    },
  });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["admin-certificate-templates"],
    queryFn: async () => {
      const { data } = await supabase
        .from("certificate_templates")
        .select("*, programs(title)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("certificate_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificate-templates"] });
      toast({ title: "Template deleted" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("certificate_templates").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-certificate-templates"] });
    },
  });

  const handleUpload = async () => {
    if (!file || !programId || !templateName) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const filePath = `templates/${programId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("certificates").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);

      const { error } = await supabase.from("certificate_templates").insert({
        program_id: programId,
        template_url: urlData.publicUrl,
        template_name: templateName,
      });
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-certificate-templates"] });
      toast({ title: "Certificate template uploaded" });
      setOpen(false);
      setProgramId("");
      setTemplateName("");
      setFile(null);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // Programs that already have a template
  const usedProgramIds = templates.map((t: any) => t.program_id);
  const availablePrograms = programs.filter((p: any) => !usedProgramIds.includes(p.id));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Certificate Templates</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={availablePrograms.length === 0}>
              <Plus className="mr-2 h-4 w-4" />Add Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload Certificate Template</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Upload a certificate image/PDF template for a program. When a student completes this program, their certificate will be auto-generated from this template.</p>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Program *</Label>
                <Select value={programId} onValueChange={setProgramId}>
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {availablePrograms.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Template Name *</Label>
                <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="e.g. Python Programming Certificate" />
              </div>
              <div>
                <Label>Template File *</Label>
                <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              <Button onClick={handleUpload} disabled={uploading} className="w-full">
                <Upload className="mr-2 h-4 w-4" />{uploading ? "Uploading..." : "Upload Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-primary" />All Certificate Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading...</p>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Award className="h-16 w-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">No Templates Yet</p>
                <p className="mt-2 text-sm text-center max-w-md">Upload certificate templates for each program. Certificates will be auto-generated when students complete their programs.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Preview</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.template_name}</TableCell>
                      <TableCell>{t.programs?.title || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={t.is_active ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => toggleActiveMutation.mutate({ id: t.id, is_active: !t.is_active })}
                        >
                          {t.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a href={t.template_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline text-sm">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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

export default AdminCertificateTemplates;
