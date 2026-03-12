import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const NotificationTicker = () => {
  const { data: notifications = [] } = useQuery({
    queryKey: ["public-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("message")
        .eq("type", "public")
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
  });

  if (notifications.length === 0) return null;

  const tickerText = notifications.map((n) => n.message).join("     •     ");

  return (
    <div className="overflow-hidden bg-ticker py-2">
      <div className="animate-ticker whitespace-nowrap text-sm font-medium text-secondary-foreground">
        {tickerText}     •     {tickerText}
      </div>
    </div>
  );
};

export default NotificationTicker;
