"use client";

import React, { Suspense } from "react";
import ForgotPasswordPage from "@/views/ForgotPasswordPage";

export default function ResetPasswordRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ForgotPasswordPage initialStep="reset" />
    </Suspense>
  );
}
