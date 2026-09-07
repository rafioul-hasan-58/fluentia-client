import React from "react";
import { Navbar, Footer } from "@/components/landing";
import { LevelTestSelectionView } from "@/views/LevelTestSelectionView";

export const metadata = {
  title: "English Level Test & Diagnostic Assessment | Fluentia",
  description:
    "Take our AI-powered General English or IELTS Benchmark Level Test. Discover your CEFR level, Band estimation, strengths, and weaknesses with instant feedback.",
};

export default function LevelTestPage() {
  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-primary-light selection:text-primary-dark">
      <Navbar />
      <main className="flex-grow">
        <LevelTestSelectionView />
      </main>
      <Footer />
    </div>
  );
}
