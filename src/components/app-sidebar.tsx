import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Building2, Home, Users, Clock, DollarSign, TrendingUp, 
  Heart, GraduationCap, UserPlus, Settings2, BarChart3,
  User, ChevronDown, LogOut
} from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  {
    title: 'Employees', icon: Users, url: '/employees',
    submenu: [
      { title: 'Employee Directory', url: '/employees' },
      { title: 'Add Employee', url: '/employees/add' },
      { title: 'Departments', url: '/departments' },
      { title: 'Designations', url: '/designations' },
    ]
  },
  {
    title: 'Attendance', icon: Clock, url: '/attendance',
    submenu: [
      { title: 'Attendance', url: '/attendance' },
      { title: 'Shifts', url: '/shifts' },
      { title: 'Self Service', url: '/self-service/attendance' },
    ]
  },
  {
    title: 'Payroll', icon: DollarSign, url: '/payroll',
    submenu: [
      { title: 'Payroll', url: '/payroll' },
      { title: 'Payslips', url: '/payroll/payslips' },
      { title: 'Salary Structure', url: '/payroll/salary-structure' },
    ]
  },
  {
    title: 'Performance', icon: TrendingUp, url: '/performance',
    submenu: [
      { title: 'Performance', url: '/performance' },
      { title: 'Goals', url: '/performance/goals' },
      { title: 'Reviews', url: '/performance/reviews' },
    ]
  },
  {
    title: 'Benefits', icon: Heart, url: '/benefits',
    submenu: [
      { title: 'Benefits', url: '/benefits' },
      { title: 'Leave', url: '/benefits/leave' },
      { title: 'Insurance', url: '/benefits/insurance' },
    ]
  },
  {
    title: 'Training', icon: GraduationCap, url: '/training',
    submenu: [
      { title: 'Training', url: '/training' },
      { title: 'Courses', url: '/training/courses' },
      { title: 'Certifications', url: '/training/certifications' },
    ]
  },
  {
    title: 'Admin Tools', icon: Settings2, url: '/admin-tools',
    submenu: [
      { title: 'Admin Tools', url: '/admin-tools' },
      { title: 'User Management', url: '/admin-tools/users' },
      { title: 'System Settings', url: '/admin-tools/settings' },
    ]
  },
  {
    title: 'Reports', icon: BarChart3, url: '/reports',
    submenu: [
      { title: 'Reports', url: '/reports' },
      { title: 'Attendance Reports', url: '/reports/attendance' },
      { title: 'Payroll Reports', url: '/reports/payroll' },
    ]
  },
  {
    title: 'Self Service', icon: Clock, url: '/self-service',
    submenu: [
      { title: 'My Profile', url: '/profile' },
      { title: 'My Attendance', url: '/self-service/attendance' },
    ]
  },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const collapsed = state === 'collapsed';
  const currentPath = location.pathname;
  const handleSignOut = async () => { await signOut(); };
  // Sidebar width
  const sidebarWidth = collapsed ? 84 : 320;
  // Track open submenu
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  return (
    <aside
      className={`flex flex-col justify-between bg-[hsl(var(--sidebar-background))] rounded-tr-[40px] rounded-br-[40px] shadow-lg border-r border-[hsl(var(--sidebar-border))] min-h-screen m-2 relative transition-all duration-300`}
      style={{ width: sidebarWidth, minWidth: sidebarWidth, maxWidth: sidebarWidth, transition: 'width 0.3s' }}
    >
      {/* Top: Logo and user info */}
      <div className="flex flex-col items-center w-full px-4 pt-4">
        {/* Logo area - always visible, reduced height */}
        <div className={`w-full flex flex-col items-center mb-2 bg-white rounded-tl-[32px] rounded-tr-[32px]`} style={{ minHeight: 56, justifyContent: 'center' }}>
          <img src="https://i.postimg.cc/9fkQhqW9/6732e31fc8403c1a709ad1e0-256-1.png" alt="Logo" className="h-10 my-2" />
        </div>
        {/* User info */}
        {!collapsed && (
          <div className="flex flex-col items-center mb-4">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-[hsl(var(--sidebar-primary))] text-white text-xl">
                {user?.user_metadata?.first_name?.[0] || user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <div className="font-semibold text-lg text-[hsl(var(--sidebar-foreground))]">{user?.user_metadata?.first_name || user?.email}</div>
              <div className="text-sm text-[hsl(var(--sidebar-foreground))] opacity-70">Regional HR Manager</div>
            </div>
          </div>
        )}
        {/* Search bar */}
        {!collapsed && (
          <div className="w-full mb-4">
            <div className="flex items-center bg-[hsl(var(--muted))] rounded-full px-3 py-2">
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none flex-1 text-[hsl(var(--sidebar-foreground))] placeholder:text-[hsl(var(--muted-foreground))] text-sm"
              />
              <svg className="h-5 w-5 text-[hsl(var(--muted-foreground))]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
          </div>
        )}
        {/* Menu - dynamic height, no forced scroll */}
        <TooltipProvider delayDuration={0}>
        <div className={`flex flex-col gap-1 w-full ${collapsed ? 'items-center mt-4' : 'mt-2'} text-left`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.url;
            if (collapsed) {
              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.url || '#'}
                      className={`flex items-center justify-center w-12 h-12 transition-colors duration-200 rounded-full ${isActive ? 'bg-[hsl(var(--sidebar-primary))] text-white shadow-md' : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-primary))]'} text-lg`}
                      style={{ borderRadius: '50%' }}
                    >
                      <Icon className="h-7 w-7 flex-shrink-0" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="select-none">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            } else if (item.submenu) {
              // Render collapsible submenu
              return (
                <div key={item.title} className="w-full">
                  <button
                    type="button"
                    className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg transition-colors duration-200 text-lg font-medium whitespace-nowrap justify-start text-left ${isActive ? 'bg-[hsl(var(--sidebar-primary))] text-white shadow-md' : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-primary))]'} focus:outline-none`}
                    style={{ textAlign: 'left' }}
                    onClick={() => setOpenMenu(openMenu === item.title ? null : item.title)}
                  >
                    <Icon className="h-7 w-7 flex-shrink-0" />
                    <span className="font-medium text-base whitespace-nowrap">{item.title}</span>
                    <ChevronDown className={`ml-auto h-5 w-5 transition-transform ${openMenu === item.title ? 'rotate-180' : ''}`} />
                  </button>
                  {openMenu === item.title && (
                    <div className="ml-12 mt-1 flex flex-col gap-1">
                      {item.submenu.map((sub) => (
                        <NavLink
                          key={sub.title}
                          to={sub.url}
                          className={`block px-3 py-1 rounded-md text-base transition-colors duration-200 ${currentPath === sub.url ? 'bg-[hsl(var(--sidebar-primary))] text-white' : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-primary))]'}`}
                        >
                          {sub.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <NavLink
                  key={item.title}
                  to={item.url || '#'}
                  className={`flex items-center gap-3 px-4 py-2 w-full rounded-lg transition-colors duration-200 ${isActive ? 'bg-[hsl(var(--sidebar-primary))] text-white shadow-md' : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-primary))]'} text-lg font-medium whitespace-nowrap justify-start text-left`}
                  style={{ textAlign: 'left' }}
                >
                  <Icon className="h-7 w-7 flex-shrink-0" />
                  <span className="font-medium text-base whitespace-nowrap">{item.title}</span>
                </NavLink>
              );
            }
          })}
        </div>
        </TooltipProvider>
      </div>
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-1/2 right-[-22px] z-20 bg-[hsl(var(--sidebar-primary))] text-white rounded-full shadow-lg w-11 h-11 flex items-center justify-center border-2 border-white hover:bg-[hsl(var(--sidebar-primary),.85)] transition-colors ${collapsed ? '' : ''}`}
        style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)', transform: 'translateY(-50%)' }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
        </svg>
      </button>
      {/* Bottom: User avatar and sign out */}
      <div className="flex flex-col items-center mb-4 w-full">
        {collapsed ? (
          <Avatar className="h-10 w-10 mb-2">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-[hsl(var(--sidebar-primary))] text-white text-xs">
              {user?.user_metadata?.first_name?.[0] || user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : null}
        <button
          onClick={handleSignOut}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] hover:bg-[hsl(var(--sidebar-primary))] hover:text-white transition-colors mt-2"
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}