import { Metadata } from "next";
import VocabStoryPage from "@/views/VocabStoryPage";

export const metadata: Metadata = {
  title: "AI Vocabulary Stories | Fluentia",
  description:
    "Generate and review immersive bilingual and English stories crafted from your saved vocabulary words.",
};

export default function VocabStoriesRoute() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <VocabStoryPage />
    </main>
  );
}
