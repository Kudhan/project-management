import React from 'react';
import { useForm } from 'react-hook-form';
import type { User } from "@/routes/types";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { signInSchema } from '@/lib/schema';
import { useLoginMutation } from '@/hooks/use-auth';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// routes/types/index.ts

export * from '../types/index';


import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/provider/auth-context';

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useLoginMutation();
  const { login } = useAuth();

  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const handleSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        const { user, token } = data as { user: User; token: string };
        login({ user, token });
        toast.success('Login successful!');
        navigate(returnUrl || '/dashboard'); // 🔁 Change this to your post-login route
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'An unexpected error occurred';
        console.error('Login error:', error);

        if (error?.response?.data?.status === "pending_verification") {
          toast.error("Please verify your email first.");
          navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
        } else {
          toast.error(errorMessage);
        }
      },
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-background relative">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              {/* Simple Zap Icon SVG since we can't import lucide in this scope easily without adding import */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            CollabSphere
          </Link>
        </div>

        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-1 text-center px-0">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input autoFocus placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Forgot Password */}
                <div className="text-right text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to={`/sign-up${location.search}`} className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Branding/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Manage your projects with velocity</h2>
          <p className="text-slate-400 text-lg">
            Join thousands of teams who ship faster with TaskHub. The all-in-one workspace for your next big idea.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

