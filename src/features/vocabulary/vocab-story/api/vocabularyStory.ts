import { getApiBaseUrl } from "@/lib/api";
import { getAuthToken } from "@/features/vocabulary/vocab-vault/hooks/utilFn";
import { VocabStoryItem } from "@/types";

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
export interface FetchVocabStoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  date?: string | null;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FetchVocabStoriesResult {
  items: VocabStoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch Paginated and Filtered Vocabulary Stories
 * Endpoint: GET /api/v1/vocab-stories/find-all
 * Supports query params: date, limit, page, search, sortBy, sortOrder
 */
export async function fetchVocabStoriesApi(
  query?: FetchVocabStoriesQuery
): Promise<FetchVocabStoriesResult> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const params = new URLSearchParams();
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search && query.search.trim()) params.append("search", query.search.trim());
  if (query?.date && query.date.trim()) params.append("date", query.date.trim());
  if (query?.sortBy) params.append("sortBy", query.sortBy);
  if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const primaryUrl = `${baseUrl}/vocab-stories/find-all${queryString}`;

  try {
    let res = await fetch(primaryUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // Fallback if /find-all is not registered
    if (res.status === 404) {
      const fallbackUrl = `${baseUrl}/vocab-stories${queryString}`;
      res = await fetch(fallbackUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch vocabulary stories (${res.status})`);
    }

    const json = await res.json();

    let rawList: any[] = [];
    let page = query?.page || 1;
    let limit = query?.limit || 10;
    let total = 0;
    let totalPages = 1;

    // Handle new format: { success, statusCode, message, meta: { page, limit, total, totalPages }, data: [...] }
    if (Array.isArray(json.data)) {
      rawList = json.data;
      if (json.meta) {
        page = json.meta.page ?? page;
        limit = json.meta.limit ?? limit;
        total = json.meta.total ?? rawList.length;
        totalPages = json.meta.totalPages ?? Math.ceil(total / (limit || 1)) ?? 1;
      } else {
        total = rawList.length;
      }
    } else if (json.data && Array.isArray(json.data.items)) {
      // Legacy wrapper format
      rawList = json.data.items;
      total = json.data.total ?? rawList.length;
      page = json.data.page ?? page;
      limit = json.data.limit ?? limit;
      totalPages = json.data.totalPages ?? Math.ceil(total / (limit || 1)) ?? 1;
    } else if (Array.isArray(json)) {
      rawList = json;
      total = rawList.length;
    }

    const items: VocabStoryItem[] = rawList.map((item: any) => ({
      ...item,
      id: item.id || item._id,
      title: item.title || "Vocabulary Story",
      userId: item.userId || "",
      storyEnglish: item.storyEnglish || "",
      storyBangla: item.storyBangla || "",
      usedVocabulary: Array.isArray(item.usedVocabulary) ? item.usedVocabulary : [],
      keywordExplanations: item.keywordExplanations || null,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      meta: json.meta,
    };
  } catch (err: any) {
    console.warn("fetchVocabStoriesApi error:", err);
    return {
      items: [],
      total: 0,
      page: query?.page || 1,
      limit: query?.limit || 10,
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