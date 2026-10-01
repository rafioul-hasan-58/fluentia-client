import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ word: string }>;
  searchParams?: Promise<{ page?: string; limit?: string }>;
}

export default async function WordDetailsLegacyRedirectPage({ params, searchParams }: PageProps) {
  const { word } = await params;
  const sParams = searchParams ? await searchParams : undefined;
  const decoded = decodeURIComponent(word || "").trim().toLowerCase();
  const query = new URLSearchParams();
  if (sParams?.page) query.set("page", sParams.page);
  if (sParams?.limit) query.set("limit", sParams.limit);
  const qs = query.toString();
  redirect(`/dashboard/user/vocabulary/${encodeURIComponent(decoded)}${qs ? `?${qs}` : ""}`);
}

