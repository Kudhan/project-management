import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpSchema } from '@/lib/schema';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useSignUpMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useSignUpMutation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const handleSubmit = (values: SignUpFormData) => {
    const { confirmPassword, ...payload } = values; // ✅ Exclude confirmPassword

    mutate(payload, {
      onSuccess: (data: any) => {
        if (data?.status === "pending_verification") {
          toast.success("Account created! Please verify your email.", {
            description: "We've sent a verification code to your email.",
          });
          let redirectUrl = `/verify-otp?email=${encodeURIComponent(payload.email)}`;
          if (returnUrl) {
            redirectUrl += `&returnUrl=${encodeURIComponent(returnUrl)}`;
          }
          navigate(redirectUrl);
        } else {
          toast.success("Account created successfully", {
            description: "Please sign in with your new credentials.",
          });
          navigate(`/sign-in${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`);
        }
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(message);
        console.error("Sign up error:", error);
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-current"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            CollabSphere
          </Link>
        </div>

        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-1 text-center px-0">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create an Account
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Re-enter password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                  {isPending ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to={`/sign-in${window.location.search}`} className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                Sign in
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
          <h2 className="text-3xl font-bold mb-4">Join 20,000+ teams</h2>
          <p className="text-slate-400 text-lg">
            Start collaborating today. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
