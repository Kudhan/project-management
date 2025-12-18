import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus, User } from "@/routes/types";
import { useSocket } from "@/context/socket-context";
import { useAuth } from "@/provider/auth-context";
import { useQueryClient } from "@tanstack/react-query";

import { format } from "date-fns";
import { AlertCircle, Calendar, CheckCircle, Clock, Users as UsersIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  // Real-time connection and events
  useEffect(() => {
    if (!socket || !projectId || !user) return;

    // Join the project room
    socket.emit("join-project", projectId);

    // Announce presence
    socket.emit("user-active", { projectId, user });

    // Listen for task updates
    socket.on("task-updated", (updatedTask) => {
      // Invalidate query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    });

    socket.on("task-created", (newTask) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    });

    // Listen for other users joining
    socket.on("user-joined", (joinedUser: User) => {
      setActiveUsers(prev => {
        if (prev.find(u => u._id === joinedUser._id)) return prev;
        return [...prev, joinedUser];
      });
    });

    return () => {
      socket.emit("leave-project", projectId);
      socket.off("task-updated");
      socket.off("task-created");
      socket.off("user-joined");
    };
  }, [socket, projectId, user, queryClient]);


  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <BackButton />
            {/* Active Users Indicator */}
            {activeUsers.length > 0 && (
              <div className="flex -space-x-2 items-center">
                {activeUsers.slice(0, 3).map(u => (
                  <TooltipProvider key={u._id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="size-6 border-2 border-background ring-2 ring-green-500/50">
                          <AvatarImage src={u.profilePicture} />
                          <AvatarFallback className="text-[10px]">{u.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{u.name} is viewing</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {activeUsers.length > 3 && (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background font-medium">
                    +{activeUsers.length - 3}
                  </div>
                )}
                <span className="text-xs text-muted-foreground ml-3 hidden sm:inline-block animate-pulse">
                  ● {activeUsers.length} viewing now
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
            {isConnected && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px] uppercase">Live</Badge>}
          </div>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* create    task dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "h-full flex flex-col bg-muted/30 rounded-lg p-4 min-h-[500px]"
      }
    >
      <div
        className={cn(
          "space-y-4",
          !isFullWidth ? "h-full" : "col-span-full mb-4"
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{title}</h3>
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-normal">{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
              <p>No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-all duration-300 hover:ring-2 hover:ring-primary/20 border-l-4"
      style={{
        borderLeftColor: task.priority === 'High' ? '#ef4444' : task.priority === 'Medium' ? '#f59e0b' : '#3b82f6'
      }}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
          <div className="flex items-center gap-1 shrink-0">
            {/* Actions could go here, visible on hover if needed */}
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2 overflow-hidden">
            {task.assignees && task.assignees.length > 0 ? (
              <>
                {task.assignees.slice(0, 3).map((member) => (
                  <Avatar
                    key={member._id}
                    className="size-6 border-2 border-background ring-1 ring-muted"
                    title={member.name}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback className="text-[10px]">{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background font-medium">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </>
            ) : (
              <div className="size-6 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <span className="sr-only">Unassigned</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="flex items-center text-xs text-muted-foreground gap-1" title="Subtasks">
                <CheckCircle className="size-3" />
                <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
              </div>
            )}

            {task.dueDate && (
              <div className={cn("text-xs flex items-center gap-1", new Date(task.dueDate) < new Date() ? "text-red-500 font-medium" : "text-muted-foreground")}>
                <Calendar className="size-3" />
                {format(new Date(task.dueDate), "MMM d")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};