import { useState } from 'react';
import { useAuth } from '@/provider/auth-context';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '@/components/loader';
import Header from '@/components/layout/header';
import { SidebarComponent } from '@/components/layout/sidebar-component';
import type { Workspace } from '@/routes/types';

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex flex-col flex-1">
        <Header
          selectedWorkspace={currentWorkspace}
          onWorkspaceSelected={setCurrentWorkspace}
          onCreateWorkspace={() => {
            // logic to show create workspace modal if needed
          }}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
