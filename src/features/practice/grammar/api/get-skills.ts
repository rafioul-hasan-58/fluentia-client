/**
 * Server-side data fetcher for the grammar skills and sub-skills taxonomy.
 *
 * Architectural Note for Maintainers:
 * This fetch deliberately uses Next.js ISR (Incremental Static Regeneration) with
 * `{ next: { revalidate: 3600, tags: ['skills'] } }` within a React Server Component,
 * rather than a client-side hook (such as TanStack Query, SWR, or useEffect).
 *
 * Rationale:
 * 1. Static Reference Data: The curriculum skill tree is stable reference data that
 *    changes very infrequently.
 * 2. Instant First-Paint: Fetching at build/cache time serves pre-rendered HTML without
 *    client-side loading spinners, waterfalls, or layout shifts.
 * 3. Cache Tag Revalidation: The 'skills' tag allows targeted on-demand revalidation
 *    via revalidateTag('skills') whenever curriculum data is updated in the CMS/backend.
 * 4. Zero Bundle Bloat: Keeps client JavaScript bundles lean by avoiding unnecessary
 *    client-side data fetching libraries for static trees.
 */

import { SkillTree } from "../types";

export async function getSkills(): Promise<SkillTree> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const endpoint = `${cleanBase}/skills`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 3600, tags: ["skills"] },
    });

    if (!res.ok) {
      console.error(`[getSkills] Failed to fetch skills: HTTP ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return (Array.isArray(data) ? data : data?.data || []) as SkillTree;
  } catch (error) {
    console.error("[getSkills] Network or server error fetching skills:", error);
    return [];
  }
}

export default getSkills;
