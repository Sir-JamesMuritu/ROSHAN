import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderDown, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Resources = () => {
  const { user } = useAuth();

  // Get student's enrolled program IDs
  const { data: enrollments = [] } = useQuery({
    queryKey: ["student-enrolled-programs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("program_id, programs(title)")
        .eq("user_id", user!.id)
        .eq("status", "enrolled");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const programIds = enrollments.map((e: any) => e.program_id);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["student-resources", programIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*, programs(title)")
        .in("program_id", programIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: programIds.length > 0,
  });

  // Group resources by program
  const grouped = resources.reduce((acc: Record<string, { title: string; items: any[] }>, r: any) => {
    const pid = r.program_id;
    if (!acc[pid]) {
      acc[pid] = { title: r.programs?.title || "Unknown Program", items: [] };
    }
    acc[pid].items.push(r);
    return acc;
  }, {});

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Resources</h1>

      {isLoading ? (
        <p className="text-muted-foreground py-8 text-center">Loading...</p>
      ) : enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FolderDown className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No Programs Enrolled</p>
            <p className="mt-2 text-sm text-center max-w-md">
              Enroll in a program to access its learning resources.
            </p>
          </CardContent>
        </Card>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FolderDown className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No Resources Available</p>
            <p className="mt-2 text-sm text-center max-w-md">
              Resources for your enrolled programs will appear here once uploaded by the institution.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([pid, group], i) => (
            <motion.div key={pid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FolderDown className="h-5 w-5 text-primary" />
                    {group.title}
                    <Badge variant="secondary" className="ml-auto">{group.items.length} file{group.items.length !== 1 ? "s" : ""}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-border">
                    {group.items.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{r.title}</p>
                            {r.description && <p className="text-sm text-muted-foreground mt-0.5">{r.description}</p>}
                            <p className="text-xs text-muted-foreground mt-1">
                              {r.file_name} {formatSize(r.file_size) && `· ${formatSize(r.file_size)}`}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />Download
                          </a>
                        </Button>
                      </div>
                    ))}
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

export default Resources;
