"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { cn } from "@/lib/utils";

export interface GoogleAuthButtonProps {
  mode?: "signin" | "signup";
  text?: string;
  onError?: (error: string | null) => void;
  onSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

export function GoogleAuthButton({
  mode = "signin",
  onError,
  onSuccess,
  className,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.("No credentials received from Google.");
      return;
    }

    onError?.(null);
    setIsLoading(true);

    const result = await loginWithGoogle(credentialResponse.credential);
    setIsLoading(false);

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } else {
      const defaultErrMsg =
        mode === "signup"
          ? "Google sign up failed. Please try again."
          : "Google login failed. Please try again.";
      onError?.(result.error || defaultErrMsg);
    }
  };

  const handleError = () => {
    setIsLoading(false);
    onError?.("Google sign-in was canceled or failed.");
  };

  return (
    <div className={cn("w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full relative min-h-[44px]", className)}>
      {isLoading ? (
        <div className="w-full h-11 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-ink-soft bg-paper">
          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Authenticating with Google...</span>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          size="large"
          text={mode === "signup" ? "signup_with" : "continue_with"}
          shape="rectangular"
          width="100%"
          useOneTap={false}
        />
      )}
    </div>
  );
}
