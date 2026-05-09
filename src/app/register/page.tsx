"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Bookmark, GitCompare, Search } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Registration failed",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created!",
        description: "Please sign in with your new account",
        variant: "success",
      });

      router.push("/login");
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
    <div className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-8 px-4 py-10 lg:grid-cols-[440px_1fr]">
      <Card className="surface-card w-full">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-teal-700 text-white shadow-md shadow-teal-900/20">
              <GraduationCap className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-normal">Create Account</CardTitle>
          <CardDescription>Save, compare, and shortlist colleges</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldIcon icon={<User className="h-4 w-4" />}>
              <Input
                id="name"
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 pl-10"
                required
              />
            </FieldIcon>

            <FieldIcon icon={<Mail className="h-4 w-4" />}>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 pl-10"
                required
              />
            </FieldIcon>

            <PasswordField
              placeholder="Create password"
              show={showPassword}
              setShow={setShowPassword}
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
            />

            <PasswordField
              placeholder="Confirm password"
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
            />

            <Button type="submit" className="h-12 w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-teal-700 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <section className="hidden rounded-lg bg-white p-8 shadow-xl shadow-slate-900/10 lg:block">
        <p className="mb-3 inline-flex rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-950">
          Built for 2026 admissions
        </p>
        <h1 className="max-w-xl text-5xl font-black leading-tight tracking-normal text-slate-950">
          Your college plan starts with a better shortlist.
        </h1>
        <div className="mt-8 grid gap-4">
          {[
            [Search, "Explore colleges by location, fee, and rating."],
            [Bookmark, "Save favorites to review later."],
            [GitCompare, "Compare up to three colleges side by side."],
          ].map(([Icon, text]) => (
            <div key={text as string} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-semibold text-slate-700">{text as string}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FieldIcon({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-700">{icon}</span>
      {children}
    </div>
  );
}

function PasswordField({
  placeholder,
  show,
  setShow,
  value,
  onChange,
}: {
  placeholder: string;
  show: boolean;
  setShow: (show: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-700" />
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-10 pr-10"
        required
        minLength={6}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Toggle password visibility"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
