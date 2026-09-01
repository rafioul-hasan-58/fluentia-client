"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-ink transition-colors duration-200">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 dark:bg-blue-600/15 rounded-full blur-[120px] -z-10" />

      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="relative w-12 h-12 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="Fluentia Logo"
              width={48}
              height={48}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-display text-3xl font-bold tracking-tight text-ink dark:text-white">
            Fluentia
          </span>
        </Link>
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-md backdrop-blur-xl bg-paper-card/90">
        <CardHeader className="text-center space-y-1.5">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue your personalized AI English coaching
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <GoogleAuthButton
            mode="signin"
            onError={setError}
            disabled={isSubmitting}
          />

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            <span className="bg-paper-card px-3 text-[11px] text-ink-soft uppercase font-bold tracking-wider relative border border-slate-200 dark:border-white/10 text-center rounded-md">
              or sign in with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="eg. peter@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-[11px] font-semibold text-primary dark:text-cyan-300 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-ink-soft hover:text-ink transition-colors text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              disabled={isSubmitting}
              className="w-full h-11 font-bold text-sm shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-center mt-2 py-4">
          <p className="text-sm text-ink-soft">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-primary dark:text-cyan-300 hover:underline ml-1"
            >
              Create free account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
