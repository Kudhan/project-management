import { useState } from 'react';
import { useAuth } from '@/provider/auth-context';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, ListCheck, CheckCircle2, Settings, LogOut, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workspace } from '@/routes/types';

export const SidebarComponent = ({ currentWorkspace }: { currentWorkspace: Workspace | null }) => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Workspace', href: '/workspaces', icon: Users },
    { title: 'My Tasks', href: '/my-tasks', icon: ListCheck },
    { title: 'Members', href: '/members', icon: CheckCircle2 },
    { title: 'Settings', href: '/user/profile', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  return (
    <div className={cn('flex flex-col border-r bg-background transition-all duration-300 relative group h-screen', isCollapsed ? 'w-16 md:w-[70px]' : 'w-16 md:w-[240px]')}>

      {/* Sidebar Toggle Button - Optional: could be absolute or part of header */}
      <div className="flex h-16 items-center px-4 mb-2 border-b">
        <Link to={currentWorkspace ? `/dashboard?workspaceId=${currentWorkspace._id}` : "/dashboard"} className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center min-w-[32px] h-8 bg-primary rounded-lg text-primary-foreground">
            <Zap className="size-5 fill-current" />
          </div>
          <span className={cn("font-bold text-lg tracking-tight transition-opacity duration-200", isCollapsed ? "opacity-0 w-0" : "opacity-100")}>
            CollabSphere
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-2 py-2 flex-1">
        {navItems.map(({ href, title, icon: Icon }) => {
          const linkTo = currentWorkspace ? `${href}?workspaceId=${currentWorkspace._id}` : href;
          const active = isActive(href);

          return (
            <Link
              key={href}
              to={linkTo}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 group-hover:justify-start",
                active
                  ? "bg-primary/10 text-primary border-r-2 border-primary rounded-r-none -mr-2"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
              title={isCollapsed ? title : undefined}
            >
              <Icon className={cn("w-5 h-5 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span className={cn("truncate transition-all duration-200", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                {title}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3 flex flex-col gap-1 bg-muted/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors w-full"
        >
          {isCollapsed ? (
            <span className="w-5 h-5 flex items-center justify-center">»</span>
          ) : (
            <>
              <span className="w-5 h-5 flex items-center justify-center transform rotate-180">»</span>
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors w-full mt-1"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={cn("truncate transition-all duration-200", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
};
