import { useState } from 'react';
import { useAuth } from '@/provider/auth-context';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, ListCheck, CheckCircle2, Settings, LogOut, Wrench } from 'lucide-react';
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

  return (
    <div className={cn('flex flex-col border-r bg-sidebar transition-all duration-300', isCollapsed ? 'w-16 md:w-[80px]' : 'w-16 md:w-[240px]')}>
      <div className="flex h-14 items-center border-b px-4 mb-4">
        <Link to={currentWorkspace ? `/dashboard?workspaceId=${currentWorkspace._id}` : "/dashboard"} className="flex items-center">
          {isCollapsed ? (
            <Wrench className="size-6 text-blue-600" />
          ) : (
            <div className="flex items-center gap-2">
              <Wrench className="size-6 text-blue-600" />
              <span className="font-semibold text-lg hidden md:block">Taskhub</span>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {navItems.map(({ href, title, icon: Icon }) => {
          const linkTo = currentWorkspace ? `${href}?workspaceId=${currentWorkspace._id}` : href;
          return (
            <Link
              key={href}
              to={linkTo}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span>{title}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t mt-auto p-2 flex flex-col gap-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs text-muted-foreground hover:underline text-left"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-500 hover:underline mt-2"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};
