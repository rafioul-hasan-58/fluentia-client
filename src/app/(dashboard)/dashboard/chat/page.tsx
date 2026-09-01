import React from "react";
import ChatPage from "@/views/ChatPage";

export const metadata = {
  title: "AI English Coach - Fluentia",
  description: "Interactive AI-powered English coaching, conversation practice, and live grammar analysis.",
};

export default function ChatRoute() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <ChatPage />
    </main>
  );
}
