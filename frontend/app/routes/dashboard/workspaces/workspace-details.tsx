import { Loader } from "@/components/loader";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/useworkspace";
import type { Project, Workspace } from "@/routes/types";
import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) {
    return <div>No Workspace Found</div>;
  }

  const { data, isLoading, error } = useGetWorkspaceQuery(workspaceId);

  console.log("Workspace Query Debug →", { data, isLoading, error });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error loading workspace</div>;
  }

  if (!data) {
    return <div>Workspace data not available</div>;
  }

  // Here data is the workspace object directly, not wrapped inside a `workspace` key

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace as Workspace}
        members={(data.workspace as Workspace).members || []}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />

    </div>
  );
};

export default WorkspaceDetails;
