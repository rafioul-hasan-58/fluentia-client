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

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await register({ firstName, lastName, email, password });
    setIsSubmitting(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Failed to create account. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);

    const result = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Google sign up failed. Please try again.");
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

      {/* Main Register Card */}
      <Card className="w-full max-w-lg backdrop-blur-xl bg-paper-card/90">
        <CardHeader className="text-center space-y-1.5">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Join thousands of learners mastering spoken English & IELTS fluency
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full h-11 border-slate-200 dark:border-white/10 hover:border-primary/50 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 shadow-xs bg-paper"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Connecting with Google...</span>
              </span>
            ) : (
              <>
                {/* Official Google G Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-white/10 w-full" />
            <span className="bg-paper-card px-3 text-[11px] text-ink-soft uppercase font-bold tracking-wider relative">
              or create account with email
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="e.g. John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting || isGoogleLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  disabled={isSubmitting || isGoogleLoading}
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
              disabled={isSubmitting || isGoogleLoading}
              className="w-full h-11 font-bold text-sm shadow-md"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </span>
              ) : (
                "Create Free Account →"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-center">
          <p className="text-xs text-ink-soft">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary dark:text-cyan-300 hover:underline ml-1"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
