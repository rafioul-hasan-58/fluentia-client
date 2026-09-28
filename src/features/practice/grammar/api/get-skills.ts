import { SkillTree } from "../types";

/**
 * Server-side data fetcher for the grammar skills and sub-skills taxonomy.
 *
 * Endpoint: GET ${NEXT_PUBLIC_API_URL}/skills/find-all (public, no auth)
 * Response type: SkillTree from features/practice/grammar/types.ts
 * Caching: { next: { revalidate: 3600, tags: ['skills'] } }
 * Error handling: Throws an Error if !res.ok so route's error.tsx handles it.
 */
export async function getSkills(): Promise<SkillTree> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL environment variable is not defined. Please set it in your environment configuration."
    );
  }

  const cleanBase = baseUrl.replace(/\/+$/, "");
  const endpoint = `${cleanBase}/skills/find-all`;

  const res = await fetch(endpoint, {
    next: { revalidate: 3600, tags: ["skills"] },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch skills from ${endpoint}: HTTP ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();
  const data = Array.isArray(json) ? json : json?.data;

  if (!data || !Array.isArray(data)) {
    throw new Error(
      `Invalid skills payload structure received from ${endpoint}`
    );
  }

  return data as SkillTree;
}

export default getSkills;

