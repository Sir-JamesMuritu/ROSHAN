import { LayoutDashboard, BookOpen, Bell, DollarSign, CreditCard, FileText, Receipt, LogOut, Home, Settings, ChevronDown, Download, Award, FolderDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logoImage from "../assets/Roshan_Training_Institute_Logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainLinks = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Programs", url: "/dashboard/programs", icon: BookOpen },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
];

const financialLinks = [
  { title: "Fee Payment", url: "/dashboard/financials/payment", icon: CreditCard },
  { title: "Fees Statement", url: "/dashboard/financials/statement", icon: FileText },
  { title: "Payment Receipts", url: "/dashboard/financials/receipts", icon: Receipt },
];

const downloadLinks = [
  { title: "Certificates", url: "/dashboard/downloads/certificates", icon: Award },
  { title: "Resources", url: "/dashboard/downloads/resources", icon: FolderDown },
];

export function StudentSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ["student-notification-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
  });

  const isFinancialActive = location.pathname.startsWith("/dashboard/financials");
  const isDownloadActive = location.pathname.startsWith("/dashboard/downloads");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col items-center justify-center pt-8 pb-6 px-4">
            <div className="bg-white/10 p-2 rounded-xl mb-3">
              <img
                src={logoImage}
                alt="Roshan Training Institute logo"
                className="h-8 w-8 object-contain"
              />
            </div>
            {!collapsed && (
              <>
                <span className="font-bold text-lg tracking-wide text-sidebar-primary-foreground">ROSHAN</span>
                <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Student Portal</span>
                <div className="w-12 h-0.5 bg-secondary mt-4 rounded-full"></div>
              </>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto w-full p-0">
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-r-lg rounded-l-md transition-all duration-200 group relative overflow-hidden text-slate-300 hover:bg-white/5 hover:text-white"
                      activeClassName="!bg-primary !text-white shadow-lg shadow-primary/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-secondary"
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {!collapsed && <span className="flex-1">{item.title}</span>}
                      {item.title === "Notifications" && notificationCount > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1.5 text-[10px] font-bold">
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Financials collapsible group */}
              <Collapsible defaultOpen={isFinancialActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-auto px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200">
                      <DollarSign className="mr-3 h-5 w-5" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">Financials</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {financialLinks.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild className="h-auto p-0 mt-1">
                              <NavLink
                                to={item.url}
                                className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-r-lg rounded-l-md transition-all duration-200 group relative overflow-hidden text-slate-400 hover:bg-white/5 hover:text-white"
                                activeClassName="!bg-primary !text-white shadow-lg shadow-primary/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-secondary"
                              >
                                <item.icon className="mr-3 h-4 w-4" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>

              {/* Downloads collapsible group */}
              <Collapsible defaultOpen={isDownloadActive} className="group/collapsible-downloads">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="h-auto px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200">
                      <Download className="mr-3 h-5 w-5" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">Downloads</span>
                          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]/collapsible-downloads:rotate-180" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!collapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {downloadLinks.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={item.url}
                                className="hover:bg-sidebar-accent/50"
                                activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                              >
                                <item.icon className="mr-2 h-3.5 w-3.5" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-black/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200">
              <NavLink to="/profile" className="flex items-center w-full" activeClassName="!bg-primary !text-white shadow-lg shadow-primary/50 relative overflow-hidden before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-secondary">
                <Settings className="mr-3 h-5 w-5" />
                {!collapsed && <span>Profile Settings</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200">
              <NavLink to="/" className="" activeClassName="">
                <Home className="mr-3 h-5 w-5" />
                {!collapsed && <span>Back to Site</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} className="h-auto px-4 py-3 text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200 group">
              <LogOut className="mr-3 h-5 w-5 group-hover:text-secondary transition-colors" />
              {!collapsed && <span>Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="truncate text-xs text-sidebar-foreground/60">{profile?.full_name || "Student"}</p>
              <p className="truncate text-xs text-sidebar-foreground/40 font-mono">{profile?.student_id || "ID pending..."}</p>
            </div>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
