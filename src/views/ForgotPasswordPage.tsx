"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendForgotPasswordOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
} from "@/lib/api/auth";
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
import {
  Mail,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export type ForgotPasswordStep = "email" | "otp" | "reset" | "success";

interface ForgotPasswordPageProps {
  initialStep?: ForgotPasswordStep;
}

export default function ForgotPasswordPage({
  initialStep = "email",
}: ForgotPasswordPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get("email") || "";
  const queryStep = searchParams.get("step") as ForgotPasswordStep | null;

  // Flow State
  const [step, setStep] = useState<ForgotPasswordStep>(
    queryStep && ["email", "otp", "reset", "success"].includes(queryStep)
      ? queryStep
      : initialStep
  );

  // Form Fields
  const [email, setEmail] = useState(queryEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timer & Auto-redirect states
  const [resendCooldown, setResendCooldown] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // References for OTP input fields
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle countdown timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "success" && redirectCountdown > 0) {
      timer = setTimeout(() => setRedirectCountdown((prev) => prev - 1), 1000);
    } else if (step === "success" && redirectCountdown === 0) {
      router.push("/login");
    }
    return () => clearTimeout(timer);
  }, [step, redirectCountdown, router]);

  // Focus the first OTP input when step becomes 'otp'
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Combined OTP String
  const otpCode = otpDigits.join("");

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isPasswordValid = hasMinLength && hasNumberOrSymbol && passwordsMatch;

  // ----------------------------------------------------
  // STEP 1: Request Password Reset OTP
  // ----------------------------------------------------
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await sendForgotPasswordOtp(email);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage(res.message || "Verification code sent to your email!");
        setResendCooldown(60);
        setStep("otp");
      } else {
        setError(res.message || "Failed to send reset code. Please try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Failed to send reset code. Please try again.");
    }
  };

  // ----------------------------------------------------
  // RESEND OTP
  // ----------------------------------------------------
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await sendForgotPasswordOtp(email);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage("A fresh 6-digit code has been sent to your email.");
        setResendCooldown(60);
        // Clear previous input
        setOtpDigits(["", "", "", "", "", ""]);
        otpInputRefs.current[0]?.focus();
      } else {
        setError(res.message || "Failed to resend code.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Failed to resend code.");
    }
  };

  // ----------------------------------------------------
  // OTP INPUT HANDLERS (Paste, Auto-Advance, Backspace)
  // ----------------------------------------------------
  const handleOtpChange = (index: number, value: string) => {
    // Keep only numbers or clean string
    const cleanVal = value.replace(/[^0-9a-zA-Z]/g, "").slice(-1);

    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // If typed a digit, focus next input
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!pastedData) return;

    // Filter alphanumeric characters
    const digits = pastedData.replace(/[^0-9a-zA-Z]/g, "").slice(0, 6).split("");
    const newDigits = [...otpDigits];

    digits.forEach((digit, i) => {
      newDigits[i] = digit;
    });

    setOtpDigits(newDigits);

    // Focus on the next empty box or the last box
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      otpInputRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpInputRefs.current[5]?.focus();
    }
  };

  // ----------------------------------------------------
  // STEP 2: Verify OTP
  // ----------------------------------------------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setError("Please enter the complete verification code.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await verifyPasswordResetOtp(email, otpCode);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMessage("Code verified! Now choose a new password.");
        setStep("reset");
      } else {
        setError(res.message || "Invalid verification code. Please check and try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Invalid or expired verification code.");
    }
  };

  // ----------------------------------------------------
  // STEP 3: Reset Password
  // ----------------------------------------------------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await resetPasswordWithOtp({
        email,
        otp: otpCode,
        newPassword,
        confirmPassword,
      });

      setIsSubmitting(false);
      if (res.success) {
        setStep("success");
      } else {
        setError(res.message || "Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden text-ink transition-colors duration-200">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 dark:bg-blue-600/15 rounded-full blur-[120px] -z-10" />

      {/* Brand Header */}
      <div className="mb-6 text-center">
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
          <span className="font-brand text-3xl font-bold tracking-tight text-ink dark:text-white">
            Fluentia
          </span>
        </Link>
      </div>

      {/* Progress / Step Indicators (Only for Steps 1 - 3) */}
      {step !== "success" && (
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === "email"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "bg-slate-100 dark:bg-white/10 text-ink-soft"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>1. Email</span>
          </div>

          <div className="w-4 h-0.5 bg-slate-200 dark:bg-white/10" />

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === "otp"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "bg-slate-100 dark:bg-white/10 text-ink-soft"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Verify OTP</span>
          </div>

          <div className="w-4 h-0.5 bg-slate-200 dark:bg-white/10" />

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              step === "reset"
                ? "bg-primary text-white shadow-sm shadow-primary/30"
                : "bg-slate-100 dark:bg-white/10 text-ink-soft"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>3. New Password</span>
          </div>
        </div>
      )}

      {/* Main Recovery Card */}
      <Card className="w-full max-w-md backdrop-blur-xl bg-paper-card/90 shadow-xl border border-slate-200/80 dark:border-white/10 transition-all duration-300">
        {/* ========================================================= */}
        {/* STEP 1: EMAIL REQUEST */}
        {/* ========================================================= */}
        {step === "email" && (
          <>
            <CardHeader className="text-center space-y-1.5">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-cyan-400 flex items-center justify-center mb-1">
                <Mail className="w-6 h-6" />
              </div>
              <CardTitle>Forgot Password?</CardTitle>
              <CardDescription>
                Enter your registered email address and we&apos;ll send you a 6-digit verification code to reset your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="e.g. yourname@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="pl-10"
                    />
                    <Mail className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isSubmitting || !email}
                  className="w-full h-11 font-bold text-sm shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Code...</span>
                    </span>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center text-center mt-2 py-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary dark:hover:text-cyan-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </Link>
            </CardFooter>
          </>
        )}

        {/* ========================================================= */}
        {/* STEP 2: OTP VERIFICATION */}
        {/* ========================================================= */}
        {step === "otp" && (
          <>
            <CardHeader className="text-center space-y-1.5">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <CardTitle>Verify Your Code</CardTitle>
              <CardDescription>
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-ink dark:text-white block mt-0.5">
                  {email}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && !error && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* 6-Digit OTP Box Grid */}
                <div className="space-y-2">
                  <Label className="text-center block text-xs uppercase tracking-wider text-ink-soft font-bold">
                    6-Digit Security PIN
                  </Label>
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        disabled={isSubmitting}
                        className={`w-11 sm:w-12 h-13 text-center text-xl font-bold rounded-xl border bg-paper transition-all focus:outline-none focus:ring-2 ${
                          digit
                            ? "border-primary ring-2 ring-primary/20 text-primary dark:text-cyan-300"
                            : "border-slate-200 dark:border-white/10 text-ink focus:border-primary focus:ring-primary/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Timer & Actions */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setStep("email");
                    }}
                    className="text-ink-soft hover:text-primary dark:hover:text-cyan-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Change email
                  </button>

                  <div>
                    {resendCooldown > 0 ? (
                      <span className="text-ink-soft font-medium flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin text-primary" />
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="text-primary dark:text-cyan-300 font-bold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isSubmitting || otpCode.length < 4}
                  className="w-full h-11 font-bold text-sm shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Code...</span>
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center text-center mt-2 py-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
              >
                <span>Back to Sign In</span>
              </Link>
            </CardFooter>
          </>
        )}

        {/* ========================================================= */}
        {/* STEP 3: RESET PASSWORD */}
        {/* ========================================================= */}
        {step === "reset" && (
          <>
            <CardHeader className="text-center space-y-1.5">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                <Lock className="w-6 h-6" />
              </div>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>
                Create a strong, secure password for your Fluentia account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      disabled={isSubmitting}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-ink-soft hover:text-ink transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-type your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-ink-soft hover:text-ink transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Criteria Checklist */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
                  <span className="font-semibold text-ink-soft block mb-1">
                    Password Requirements:
                  </span>
                  <div className="flex items-center gap-2">
                    {hasMinLength ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-ink-soft/40 flex items-center justify-center text-[9px] text-ink-soft" />
                    )}
                    <span
                      className={
                        hasMinLength
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-ink-soft"
                      }
                    >
                      Minimum 8 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasNumberOrSymbol ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-ink-soft/40 flex items-center justify-center text-[9px] text-ink-soft" />
                    )}
                    <span
                      className={
                        hasNumberOrSymbol
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-ink-soft"
                      }
                    >
                      At least one number or special character
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-ink-soft/40 flex items-center justify-center text-[9px] text-ink-soft" />
                    )}
                    <span
                      className={
                        passwordsMatch
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-ink-soft"
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isSubmitting || !isPasswordValid}
                  className="w-full h-11 font-bold text-sm shadow-md"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating Password...</span>
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="justify-center text-center mt-2 py-4">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to verification</span>
              </button>
            </CardFooter>
          </>
        )}

        {/* ========================================================= */}
        {/* STEP 4: SUCCESS CONFIRMATION */}
        {/* ========================================================= */}
        {step === "success" && (
          <>
            <CardHeader className="text-center space-y-2 pt-8">
              <div className="relative mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-500 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
                <Sparkles className="w-5 h-5 absolute -top-1 -right-1 text-amber-400 animate-bounce" />
              </div>
              <CardTitle className="text-2xl font-bold">Password Reset Successful!</CardTitle>
              <CardDescription className="text-sm">
                Your password has been securely updated. You can now use your new password to sign in to Fluentia.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-center text-xs text-ink-soft">
                <span>Automatically redirecting to login in </span>
                <span className="font-bold text-primary dark:text-cyan-300">
                  {redirectCountdown}s
                </span>
                ...
              </div>

              <Button
                type="button"
                variant="gradient"
                onClick={() => router.push("/login")}
                className="w-full h-11 font-bold text-sm shadow-md"
              >
                Continue to Sign In
              </Button>
            </CardContent>

            <CardFooter className="justify-center text-center py-4">
              <p className="text-xs text-ink-soft">
                Need help? Contact{" "}
                <a
                  href="mailto:support@fluentia.ai"
                  className="font-semibold text-primary dark:text-cyan-300 hover:underline"
                >
                  support@fluentia.ai
                </a>
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
