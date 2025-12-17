import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CommentSection } from "@/components/task/comment-section";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { TaskActivity } from "@/components/task/task-activity";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskTitle } from "@/components/task/task-title";
import { Watchers } from "@/components/task/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAchievedTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
//import type { Project, Task } from "@/types";
import type { Project, Task } from "@/routes/types";
import { format, formatDistanceToNow } from "date-fns";
import { Archive, Clock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };
  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } =
    useAchievedTaskMutation();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Task not found</div>
      </div>
    );
  }

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const goBack = () => navigate(-1);

  const members = task?.assignees || [];

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task watched");
        },
        onError: () => {
          toast.error("Failed to watch task");
        },
      }
    );
  };

  const handleAchievedTask = () => {
    achievedTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task achieved");
        },
        onError: () => {
          toast.error("Failed to achieve task");
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-0 py-4 md:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">

            <div className="p-6 border-b bg-muted/30 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}
                    className="capitalize px-3 py-1"
                  >
                    {task.priority}
                  </Badge>
                  <Badge variant="outline" className="capitalize px-3 py-1">
                    {task.status}
                  </Badge>
                  {task.isArchived && <Badge variant="secondary">Archived</Badge>}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{task.title}</h1>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWatchTask}
                  disabled={isWatching}
                  title={isUserWatching ? "Unwatch" : "Watch"}
                >
                  {isUserWatching ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAchievedTask}
                  disabled={isAchieved}
                  title={task.isArchived ? "Unarchive" : "Archive"}
                >
                  <Archive className="size-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/10 rounded-lg border">
                <TaskStatusSelector status={task.status} taskId={task._id} />
                <TaskPrioritySelector priority={task.priority} taskId={task._id} />
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Description</h3>
                <TaskDescription description={task.description || ""} taskId={task._id} />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Assignees</h3>
                <TaskAssigneesSelector task={task} assignees={task.assignees} projectMembers={project.members as any} />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Subtasks</h3>
                <SubTasksDetails subTasks={task.subtasks || []} taskId={task._id} />
              </div>
            </div>
          </div>

          <CommentSection taskId={task._id} members={project.members as any} />
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-xl border shadow-sm p-4">
            <h3 className="font-semibold mb-4">Activity & Watchers</h3>
            <Watchers watchers={task.watchers || []} />
            <div className="my-4 border-t" />
            <TaskActivity resourceId={task._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;