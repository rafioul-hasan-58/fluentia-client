import React from "react";
import { Sidebar } from "@/components/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area (Offset for sidebar width on large screens) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
