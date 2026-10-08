import { VocabStoryPage } from "@/features/vocabulary/vocab-story/page/VocabStoryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Vocabulary Stories | Fluentia",
  description:
    "Generate and review immersive bilingual and English stories crafted from your saved vocabulary words.",
};

export default function VocabStoriesRoute() {
  return (
    <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
      <VocabStoryPage />
    </main>
  );
}
