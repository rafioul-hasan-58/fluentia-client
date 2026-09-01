import React from "react";
import ChatPage from "@/views/ChatPage";

export const metadata = {
  title: "AI English Coach - Fluentia",
  description: "Interactive AI-powered English coaching, conversation practice, and live grammar analysis.",
};

export default function ChatRoute() {
  return (
    <main className="w-full">
      <ChatPage />
    </main>
  );
}
