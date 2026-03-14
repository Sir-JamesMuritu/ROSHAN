import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Outlet } from "react-router-dom";
import { Bell, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentLayout = () => {
  const { profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 shadow-sm z-10 w-full">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-bold text-primary hidden md:block">Student Portal</h1>
              <span className="md:hidden font-bold text-foreground">RTIStudent</span>
            </div>

            <div className="flex items-center gap-4 relative">
              <button className="p-2 text-muted-foreground hover:text-secondary transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
              </button>

              <div className="h-8 w-[1px] bg-border mx-2 hidden md:block"></div>

              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-foreground leading-none">{profile?.full_name || "Student User"}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">STUDENT</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md border-2 border-white">
                      {(profile?.full_name || "S").charAt(0)}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground hidden md:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-xl mt-2 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-bold text-foreground">{profile?.full_name || "Student User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile?.id ? "student@rdti.com" : "student"}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors py-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
