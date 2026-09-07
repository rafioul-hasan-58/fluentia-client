"use client";

import React, { Suspense } from "react";
import ForgotPasswordPage from "@/views/ForgotPasswordPage";
import { Loader } from "@/components/ui/loader";

export default function ResetPasswordRoute() {
  return (
    <Suspense fallback={<Loader variant="fullScreen" size="md" />}>
      <ForgotPasswordPage initialStep="reset" />
    </Suspense>
  );
}
