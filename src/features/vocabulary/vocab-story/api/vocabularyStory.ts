import { getApiBaseUrl } from "@/lib/api";
import { VocabStoryItem } from "@/features/vocabulary/types/vocabulary";
import { getAuthToken } from "@/features/vocabulary/vocab-vault/hooks/utilFn";

/**
 * Generate Bilingual and Full English Vocabulary Story via AI
 * Endpoint: POST /api/v1/vocab-stories/generate
 */
export async function generateVocabStoryApi(
  dto: { vocabularyIds: string[]; context?: string }
): Promise<any> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const res = await fetch(`${baseUrl}/vocab-stories/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || "Failed to generate vocabulary story.");
  }

  const json = await res.json();
  return json.data || json;
}
/**
 * Fetch Paginated Vocabulary Stories
 * Endpoint: GET /api/v1/vocab-stories
 */
export async function fetchVocabStoriesApi(query?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  items: VocabStoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const params = new URLSearchParams();
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);

  const url = `${baseUrl}/vocab-stories?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch vocabulary stories");
    }

    const json = await res.json();
    return (
      json.data ||
      json || {
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      }
    );
  } catch (err: any) {
    console.warn("fetchVocabStoriesApi error:", err);
    return {
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    };
  }
}
/**
 * Fetch Single Vocabulary Story by ID
 * Endpoint: GET /api/v1/vocab-stories/:id
 */
export async function fetchVocabStoryByIdApi(id: string): Promise<VocabStoryItem | null> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const res = await fetch(`${baseUrl}/vocab-stories/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch story details");
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Update Vocabulary Story Title
 * Endpoint: PATCH /api/v1/vocab-stories/:id
 */
export async function updateVocabStoryTitleApi(
  id: string,
  title: string
): Promise<VocabStoryItem> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const res = await fetch(`${baseUrl}/vocab-stories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || "Failed to update vocabulary story title");
  }

  const json = await res.json();
  return json.data || json;
}
/**
 * Delete Vocabulary Story
 * Endpoint: DELETE /api/v1/vocab-stories/:id
 */
export async function deleteVocabStoryApi(id: string): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const res = await fetch(`${baseUrl}/vocab-stories/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete vocabulary story");
  }

  return true;
}