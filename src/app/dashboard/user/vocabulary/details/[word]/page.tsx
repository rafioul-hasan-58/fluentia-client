import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ word: string }>;
}

export default async function WordDetailsLegacyRedirectPage({ params }: PageProps) {
  const { word } = await params;
  const decoded = decodeURIComponent(word || "").trim().toLowerCase();
  redirect(`/dashboard/user/vocabulary/${encodeURIComponent(decoded)}`);
}

