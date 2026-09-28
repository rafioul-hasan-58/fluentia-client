import { Metadata } from "next";
import { VocabularyDetailPage } from "@/features/vocabulary/page";

interface PageProps {
  params: Promise<{ word: string }> | { word: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const word = resolvedParams?.word || "";
  const decoded = decodeURIComponent(word).trim();
  const capitalized = decoded ? decoded.charAt(0).toUpperCase() + decoded.slice(1) : "Word";

  return {
    title: `${capitalized} - Vocabulary Details | Fluentia`,
    description: `Detailed definitions, Bengali meanings, audio pronunciation, verb forms, and personal study notes for '${decoded}' on Fluentia.`,
  };
}

export default async function WordDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const word = resolvedParams?.word || "";

  return <VocabularyDetailPage word={word} />;
}
