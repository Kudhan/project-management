import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

import { RecentProjects } from "@/components/dashboard/recent-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/useworkspace";

import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/routes/types";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  // Show toast once if workspaceId is not present
  useEffect(() => {
    if (!workspaceId) {
      toast.error("Please select a workspace to view the dashboard.");
    }
  }, [workspaceId]);

  // Skip query execution if no workspaceId
  const {
    data,
    isFetching: isPending,
  } = useGetWorkspaceStatsQuery(workspaceId!, {
    enabled: !!workspaceId,
  }) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isFetching: boolean;
  };

  // Render Empty State if no workspaceId
  if (!workspaceId) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-6 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome to CollabSphere</h2>
          <p className="text-muted-foreground text-lg">
            Select a workspace from the top menu or create a new one to get started with your projects.
          </p>
        </div>
      </div>
    );
  }

  // Show loader while fetching
  if (isPending || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Render the dashboard content
  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
