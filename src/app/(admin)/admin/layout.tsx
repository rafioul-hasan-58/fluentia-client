import React from "react";
import { AdminGuard, AdminSidebar } from "@/components/admin";

export const metadata = {
  title: "Admin Console | Fluentia AI",
  description: "Administrative control center for Fluentia English Learning Platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-paper text-ink flex flex-col lg:flex-row transition-colors duration-200">
        {/* Admin Sidebar Navigation */}
        <AdminSidebar />

        {/* Admin Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen pt-16 lg:pt-0">
          <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
