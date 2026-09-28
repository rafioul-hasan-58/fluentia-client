import { Metadata } from "next";
import { VocabularyDetailPage } from "@/features/vocabulary/page";

interface PageProps {
  params: Promise<{ word: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word } = await params;
  const decoded = decodeURIComponent(word || "").trim();
  const capitalized = decoded ? decoded.charAt(0).toUpperCase() + decoded.slice(1) : "Word";

  return {
    title: `${capitalized} - Vocabulary Details | Fluentia`,
    description: `Detailed definitions, Bengali meanings, audio pronunciation, verb forms, and personal study notes for '${decoded}' on Fluentia.`,
  };
}

export default async function WordDetailPage({ params }: PageProps) {
  const { word } = await params;

  return <VocabularyDetailPage word={word} />;
}
