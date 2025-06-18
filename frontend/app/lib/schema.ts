import { ProjectStatus } from '@/routes/types';
import {z} from 'zod';

export const signInSchema = z.object({
    email: z.string().email("Invalid email address").min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z
  .object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),

    email: z.string()
      .email('Invalid email address')
      .min(1, 'Email is required'),

    password: z.string()
      .min(8, 'Password must be at least 8 characters long'),

    confirmPassword: z.string()
      .min(8, 'Confirm Password must be at least 8 characters long'),
  })
.refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export const workspaceSchema = z.object({
  name:z.string().min(3,"Must be atleast 3 Character Long"),
  color:z.string().min(3,"Color must be atleast 3 Character Long"),
  description:z.string().optional(),
});


export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(10, "Start date is required"),
  dueDate: z.string().min(10, "Due date is required"),
  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]),
      })
    )
    .optional(),
  tags: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member", "viewer"]),
});