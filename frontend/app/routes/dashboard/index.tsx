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
    skip: !workspaceId,
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

  // Don't render anything if workspaceId is missing
  if (!workspaceId) {
    return null;
  }

  // Show loader while fetching
  if (isPending || !data) {
    return (
      <div>
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
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
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
