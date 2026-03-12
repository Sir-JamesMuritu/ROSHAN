import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Intake {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
}

const statusOptions = [
  { value: "open", label: "Registration Open" },
  { value: "closed", label: "Registration Closed" },
  { value: "upcoming", label: "Upcoming" },
  { value: "full", label: "Full" },
];

const statusColors: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-700 border-emerald-200",
  closed: "bg-red-100 text-red-700 border-red-200",
  upcoming: "bg-amber-100 text-amber-700 border-amber-200",
  full: "bg-muted text-muted-foreground border-border",
};

const AdminIntakes = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIntake, setEditingIntake] = useState<Intake | null>(null);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", status: "open" });

  const { data: intakes = [], isLoading } = useQuery({
    queryKey: ["admin-intakes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Intake[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (intake: typeof form & { id?: string }) => {
      const payload = {
        name: intake.name,
        start_date: intake.start_date || null,
        end_date: intake.end_date || null,
        status: intake.status,
      };
      if (intake.id) {
        const { error } = await supabase.from("intakes").update(payload).eq("id", intake.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("intakes").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-intakes"] });
      toast.success(editingIntake ? "Intake updated" : "Intake created");
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("intakes").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-intakes"] });
      toast.success("Intake status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("intakes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-intakes"] });
      toast.success("Intake deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setEditingIntake(null);
    setForm({ name: "", start_date: "", end_date: "", status: "open" });
    setDialogOpen(true);
  };

  const openEdit = (intake: Intake) => {
    setEditingIntake(intake);
    setForm({
      name: intake.name,
      start_date: intake.start_date || "",
      end_date: intake.end_date || "",
      status: intake.status,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingIntake(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, id: editingIntake?.id });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Intake Management</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" /> New Intake
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingIntake ? "Edit Intake" : "Create Intake"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Intake Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. March 2026 Intake"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : editingIntake ? "Update Intake" : "Create Intake"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Only one intake can be active at a time. The active intake is displayed in the site banner.
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : intakes.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No intakes created yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {intakes.map((intake, i) => (
            <motion.div key={intake.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={intake.is_active ? "border-secondary/50 bg-secondary/5" : ""}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <CalendarDays className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{intake.name}</span>
                        <Badge variant="outline" className={statusColors[intake.status] || ""}>
                          {statusOptions.find((s) => s.value === intake.status)?.label || intake.status}
                        </Badge>
                        {intake.is_active && (
                          <Badge className="bg-secondary text-secondary-foreground">Active</Badge>
                        )}
                      </div>
                      {(intake.start_date || intake.end_date) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {intake.start_date && new Date(intake.start_date).toLocaleDateString()}{" "}
                          {intake.start_date && intake.end_date && "–"}{" "}
                          {intake.end_date && new Date(intake.end_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${intake.id}`} className="text-xs text-muted-foreground">Active</Label>
                      <Switch
                        id={`active-${intake.id}`}
                        checked={intake.is_active}
                        onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: intake.id, is_active: checked })}
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(intake)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(intake.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminIntakes;
