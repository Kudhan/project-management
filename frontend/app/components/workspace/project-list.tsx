import type { Project } from "@/routes/types";
import { NoDataFound } from "../no-data-found";
import { ProjectCard } from "../project/project-card";

interface ProjectListProps {
  workspaceId: string;
  projects: Project[];
  onCreateProject: () => void;
}

export const ProjectList = ({
  workspaceId,
  projects,
  onCreateProject,
}: ProjectListProps) => {
  return (
    <div>
      <h3 className="text-xl font-medium mb-4">Projects</h3>

      {projects.length === 0 ? (
        <NoDataFound
          title="No Project Found"
          description="Create a Project to get Started"
          buttonText="Create Project"
          buttonAction={onCreateProject}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projectProgress = 0; // You can calculate real progress later

            return (
              <ProjectCard
                key={project._id}
                project={project}
                progress={projectProgress}
                workspaceId={workspaceId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
