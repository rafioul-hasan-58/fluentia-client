import { Metadata } from "next";
import { redirect } from "next/navigation";
import { VocabularyDetailPage } from "@/features/vocabulary/page";

interface PageProps {
  params: Promise<{ word: string }>;
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

export default async function WordDetailPage({ params }: PageProps) {
  const { word } = await params;
  const decoded = decodeURIComponent(word || "").trim();
  const lowerWord = decoded.toLowerCase();

  // The word in URL must always be lowercase (e.g. /dashboard/user/vocabulary/emporium)
  if (word !== lowerWord) {
    redirect(`/dashboard/user/vocabulary/${encodeURIComponent(lowerWord)}`);
  }

  return <VocabularyDetailPage word={lowerWord} />;
}

