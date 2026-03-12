import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const typeIcons: Record<string, any> = {
  public: Info,
  urgent: AlertTriangle,
};

const typeColors: Record<string, string> = {
  public: "bg-blue-100 text-blue-700 border-blue-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

const StudentNotifications = () => {
  const { data: notifications = [] } = useQuery({
    queryKey: ["student-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Bell className="h-12 w-12 mb-4 opacity-30" />
          <p>No notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any, i: number) => {
            const Icon = typeIcons[notification.type] || Info;
            return (
              <motion.div key={notification.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[notification.type] || "bg-muted"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={typeColors[notification.type] || ""}>
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{notification.message}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
