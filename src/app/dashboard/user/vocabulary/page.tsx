import { Suspense } from "react";
import { Metadata } from "next";
import { VocabularyPage } from "@/features/vocabulary/vocab-vault/page/VocabularyPage";

export const metadata: Metadata = {
  title: "AI Vocabulary Vault | Fluentia",
  description:
    "Master high-yield English vocabulary with AI definitions, Bengali translations, collocations, word families, and contextual sentences.",
};

interface VocabularyRouteProps {
  searchParams?: Promise<{ page?: string; limit?: string }>;
}

export default async function VocabularyRoute({ searchParams }: VocabularyRouteProps) {
  const sParams = searchParams ? await searchParams : undefined;
  const parsedPage = sParams?.page ? parseInt(sParams.page, 10) : undefined;
  const initialPage = parsedPage && !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : undefined;

  const parsedLimit = sParams?.limit ? parseInt(sParams.limit, 10) : undefined;
  const initialLimit = parsedLimit && !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Suspense fallback={null}>
        <VocabularyPage initialPage={initialPage} initialLimit={initialLimit} />
      </Suspense>
    </main>
  );
}

