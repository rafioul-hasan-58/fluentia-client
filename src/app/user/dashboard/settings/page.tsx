import React from "react";
import SettingsPage from "@/views/SettingsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account & Profile Settings | Fluentia",
  description: "View and update your personal profile, fluency goals, and account preferences on Fluentia.",
};

export default function Settings() {
  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 w-full">
      <SettingsPage />
    </main>
  );
}
