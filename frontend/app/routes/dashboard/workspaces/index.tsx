import { Loader } from "@/components/loader";
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/useworkspace";
import type { Workspace } from "@/routes/types";
import { PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { format } from "date-fns";

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {workspaces.length === 0 && (
            <NoDataFound
              title="No workspaces found"
              description="Create a new workspace to get started"
              buttonText="Create Workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="group transition-all hover:shadow-lg hover:-translate-y-1 border-s-[6px]" style={{ borderLeftColor: workspace.color || '#3b82f6' }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} className="h-10 w-10 text-lg shadow-sm" />
              <div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground block">
                  Created {format(workspace.createdAt, "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          <CardDescription className="line-clamp-2 min-h-[40px]">
            {workspace.description || "No description provided."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t mt-2">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{workspace.members.length} member{workspace.members.length !== 1 ? 's' : ''}</span>
            </div>
            <span className="text-xs bg-secondary px-2 py-1 rounded">
              Click to view
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;