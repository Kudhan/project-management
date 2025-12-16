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
import { useNavigate, Link } from 'react-router-dom';
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

  const handleSubmit = (values: SignUpFormData) => {
    const { confirmPassword, ...payload } = values; // ✅ Exclude confirmPassword

    mutate(payload, {
      onSuccess: () => {
        toast.success("Account created successfully", {
          description: "Please sign in with your new credentials.",
        });
        navigate("/sign-in");
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
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-12">
      <Card className="w-full max-w-md rounded-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create an Account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
