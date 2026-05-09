"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in",
          variant: "success",
        });
        router.push("/colleges");
        router.refresh();
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-8 px-4 py-10 lg:grid-cols-[1fr_440px]">
      <section className="hidden rounded-lg bg-teal-900 p-10 text-white shadow-2xl shadow-teal-950/20 lg:block">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-400 text-slate-950">
          <GraduationCap className="h-8 w-8" />
        </div>
        <p className="mb-3 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-sm font-bold text-amber-100">
          <ShieldCheck className="h-4 w-4" />
          Secure student workspace
        </p>
        <h1 className="max-w-xl text-5xl font-black leading-tight tracking-normal">
          Continue building your college shortlist.
        </h1>
        <p className="mt-5 max-w-xl leading-8 text-teal-50">
          Sign in to save colleges, compare options, and keep your admission
          research in one place.
        </p>
      </section>

      <Card className="surface-card w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-teal-700 text-white shadow-md shadow-teal-900/20">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-normal">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your college search</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@collegefinder.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="h-12 w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Do not have an account?{" "}
            <Link href="/register" className="font-bold text-teal-700 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-center text-sm font-black text-amber-950">
              Demo Credentials
            </p>
            <p className="text-center text-xs leading-6 text-amber-900">
              Email: demo@collegefinder.com<br />
              Password: demo123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
