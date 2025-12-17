import React from 'react';
import type { Route } from "../../+types/root";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layout, Users, Zap, Shield, BarChart3, Globe } from 'lucide-react';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "CollabSphere - Manage Projects with Velocity" },
    { name: "description", content: "The modern project management tool for high-performance teams. Collaborate, track, and ship faster." },
  ]
}

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            CollabSphere
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background opacity-40 dark:from-blue-900/20"></div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent pb-2">
            Manage Projects with <br className="hidden md:block" /> Unmatched Velocity
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            CollabSphere brings your tasks, teammates, and tools together. Simple enough for personal use, powerful enough for the enterprise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Start for free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-16 mx-auto max-w-5xl rounded-xl border bg-background/50 shadow-2xl p-2 backdrop-blur-sm">
            <div className="rounded-lg bg-slate-50 border h-[300px] md:h-[500px] flex items-center justify-center text-slate-300">
              {/* This would be a real screenshot in production */}
              <div className="text-center">
                <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features built for modern product teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-none shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <Layout className="w-6 h-6" />
                </div>
                <CardTitle>Flexible Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create dedicated workspaces for different teams or projects. Organize tasks with ease using our intuitive board view.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 text-green-600">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle>Seamless Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Work together efficiently. Assign tasks, track progress, share comments, and keep everyone aligned.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <CardTitle>Insightful Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track productivity with detailed charts. Monitor project progress, invite limits, and team performance.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof / Security */}
      <section className="py-20 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Built for Security</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <span className="text-muted-foreground">Secure Data Transmission</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <span className="text-muted-foreground">Secure OTP Authentication</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                  <span className="text-muted-foreground">Role-based Access Control</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 flex items-center justify-center">
              <Shield className="w-32 h-32 text-slate-300 dark:text-slate-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl text-white mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                CollabSphere
              </div>
              <p className="text-sm text-slate-400">
                Making project management delightful for teams of all sizes.
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <p>© 2024 CollabSphere. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
