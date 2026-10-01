import { Metadata } from "next";
import { VocabStoryDetailPage } from "@/features/vocabulary/vocab-story/page/VocabStoryDetailPage";

interface PageProps {
  params: Promise<{ storyId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { storyId } = await params;
  return {
    title: "Vocabulary Story Details | Fluentia",
    description:
      "Explore contextual AI bilingual and full English stories generated from high-yield vocabulary words on Fluentia.",
  };
}

export default async function StoryDetailsRoute({ params }: PageProps) {
  const { storyId } = await params;
  const decodedStoryId = decodeURIComponent(storyId || "").trim();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <VocabStoryDetailPage storyId={decodedStoryId} />
    </main>
  );
}
