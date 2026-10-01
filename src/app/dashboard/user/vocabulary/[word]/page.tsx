import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { VocabularyDetailPage } from "@/features/vocabulary/vocab-vault/page/VocabularyDetailPage";
import { DetailLoadingSkeleton } from "@/features/vocabulary/vocab-vault/components/detail";

interface PageProps {
  params: Promise<{ word: string }>;
  searchParams?: Promise<{ page?: string; limit?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word } = await params;
  const decoded = decodeURIComponent(word || "").trim();
  const lowerWord = decoded.toLowerCase();
  const capitalized = lowerWord ? lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1) : "Word";

  return {
    title: `${capitalized} - Vocabulary Details | Fluentia`,
    description: `Detailed definitions, Bengali meanings, audio pronunciation, verb forms, and personal study notes for '${lowerWord}' on Fluentia.`,
  };
}

export default async function WordDetailPage({ params, searchParams }: PageProps) {
  const { word } = await params;
  const sParams = searchParams ? await searchParams : undefined;
  const decoded = decodeURIComponent(word || "").trim();
  const lowerWord = decoded.toLowerCase();

  // The word in URL must always be lowercase (e.g. /dashboard/user/vocabulary/emporium)
  if (word !== lowerWord) {
    const query = new URLSearchParams();
    if (sParams?.page) query.set("page", sParams.page);
    if (sParams?.limit) query.set("limit", sParams.limit);
    const qs = query.toString();
    redirect(`/dashboard/user/vocabulary/${encodeURIComponent(lowerWord)}${qs ? `?${qs}` : ""}`);
  }

  const parsedPage = sParams?.page ? parseInt(sParams.page, 10) : undefined;
  const initialPage = parsedPage && !isNaN(parsedPage) && parsedPage > 0 ? parsedPage : undefined;

  const parsedLimit = sParams?.limit ? parseInt(sParams.limit, 10) : undefined;
  const initialLimit = parsedLimit && !isNaN(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

  return (
    <Suspense fallback={<DetailLoadingSkeleton />}>
      <VocabularyDetailPage
        word={lowerWord}
        initialPage={initialPage}
        initialLimit={initialLimit}
      />
    </Suspense>
  );
}

