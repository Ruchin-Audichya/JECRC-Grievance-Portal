import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Home, 
  Plus, 
  Ticket, 
  Users, 
  Settings, 
  FileText,
  MessageSquare,
  Book,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react';

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["student", "staff", "resolver", "admin"]
  },
  {
    title: "File Grievance",
    url: "/create-ticket",
    icon: Plus,
    roles: ["student", "staff", "admin"]
  },
  {
    title: "My Grievances",
    url: "/dashboard",
    icon: Ticket,
    roles: ["student", "staff"]
  },
  {
    title: "Ticket Queue",
    url: "/dashboard",
    icon: Users,
    roles: ["resolver"]
  },
  {
    title: "Admin Portal",
    url: "/admin",
    icon: Shield,
    roles: ["admin"]
  },
  {
    title: "System Logs",
    url: "/logs",
    icon: FileText,
    roles: ["admin"]
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    roles: ["admin"]
  }
];

const supportItems = [
  {
    title: "Knowledge Base",
    url: "/knowledge-base",
    icon: Book,
    roles: ["student", "staff", "resolver", "admin"]
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: Book,
    roles: ["student", "staff", "resolver", "admin"]
  },
  {
    title: "Live Chat",
    url: "/faq-chat",
    icon: MessageSquare,
    roles: ["student", "staff", "resolver", "admin"]
  },
  {
    title: "Tutorial",
    url: "/tutorial",
    icon: Settings,
    roles: ["student", "staff", "resolver", "admin"]
  },
  {
    title: "Demo Portal",
    url: "/demo",
    icon: Users,
    roles: ["admin"]
  }
];

export function AppSidebar() {
  const { user, profile, signOut } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const filteredSupportItems = supportItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <div>
                <h2 className="font-bold text-sm">JECRC IT Support</h2>
                <p className="text-xs text-muted-foreground">Support Portal</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-6 w-6"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${collapsed ? 'mx-auto' : 'mr-2'}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support & Help */}
        <SidebarGroup>
          <SidebarGroupLabel>Support & Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${collapsed ? 'mx-auto' : 'mr-2'}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {user && (
          <div className="space-y-3">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {profile?.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{profile?.name || user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'student'}</p>
                </div>
              </div>
            )}
            
            <Button
              variant="outline"
              size={collapsed ? "icon" : "sm"}
              onClick={signOut}
              className="w-full"
            >
              <LogOut className={`h-4 w-4 ${collapsed ? '' : 'mr-2'}`} />
              {!collapsed && "Logout"}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}