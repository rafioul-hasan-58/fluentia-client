import React from "react";
import { Sidebar } from "@/components/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col lg:flex-row transition-colors duration-200">
      {/* Sidebar Navigation (Desktop fixed + Mobile App bar & drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pt-16 lg:pt-0">
        <div className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
