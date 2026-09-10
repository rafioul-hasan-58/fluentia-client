import { Metadata } from "next";
import VocabularyPage from "@/views/VocabularyPage";

export const metadata: Metadata = {
  title: "AI Vocabulary Vault | Fluentia",
  description:
    "Master high-yield English vocabulary with AI definitions, Bengali translations, collocations, word families, and contextual sentences.",
};

export default function VocabularyRoute() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <VocabularyPage />
    </main>
  );
}
