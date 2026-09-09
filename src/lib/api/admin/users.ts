import { getApiBaseUrl, resolveImageUrl } from "../config";
import { AdminUserRecord } from "./types";
import { MOCK_ADMIN_USERS } from "./mocks";

/**
 * Format relative ISO timestamp helper
 */
export function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return "Recently";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return isoString || "Recently";
  }
}

/**
 * Normalizes raw backend user item into AdminUserRecord
 */
export function normalizeUserItem(item: any): AdminUserRecord {
  const fName = item.firstName || "";
  const lName = item.lastName || "";
  const fullName =
    item.fullName ||
    (fName || lName ? `${fName} ${lName}`.trim() : item.name || "Learner");

  const proficiency = item.proficiency || {};
  const profLevel = proficiency.level || item.profile?.estimatedCEFR || item.level || "A1";
  const profLabel =
    proficiency.label ||
    (typeof item.level === "string" && item.level.includes(" ")
      ? item.level
      : `${profLevel} Elementary`);

  const testsCount =
    typeof item.testsCount === "number"
      ? item.testsCount
      : typeof item.testsTaken === "number"
        ? item.testsTaken
        : parseInt(String(item.testsTaken || "0"), 10) || 0;

  const authProvider = String(item.authProvider || item.provider || "EMAIL").toLowerCase();
  const profile = item.profile || null;

  const rawAvatar =
    item.profileImage ||
    item.avatar ||
    item.profileImageUrl ||
    item.avatarUrl ||
    item.image ||
    item.imageUrl ||
    item.picture ||
    item.pictureUrl ||
    item.photo ||
    item.photoUrl ||
    item.profile?.profileImage ||
    item.profile?.avatar ||
    item.profile?.profileImageUrl ||
    item.profile?.avatarUrl ||
    item.profile?.image ||
    item.profile?.imageUrl ||
    item.profile?.picture ||
    item.profile?.photo ||
    item.user?.profileImage ||
    item.user?.avatar ||
    null;

  const resolvedAvatar = resolveImageUrl(rawAvatar);

  return {
    id: item.id || `usr-${Date.now()}`,
    name: fullName,
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    email: item.email || "",
    avatar: resolvedAvatar,
    role: item.role === "ADMIN" ? "ADMIN" : "USER",
    level: profLabel,
    proficiencyLevel: profLevel,
    targetLevel: profile?.targetLevel || item.targetLevel || null,
    provider: authProvider === "google" ? "google" : "email",
    testsTaken: testsCount,
    isSuspended: Boolean(item.isSuspended),
    lastActive: formatRelativeTime(item.lastActive || item.updatedAt || item.createdAt),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    profile: profile
      ? {
        id: profile.id,
        userId: profile.userId,
        estimatedCEFR: profile.estimatedCEFR,
        targetLevel: profile.targetLevel,
        nativeLanguage: profile.nativeLanguage,
        learningGoals: Array.isArray(profile.learningGoals) ? profile.learningGoals : [],
        dailyGoalMinutes: profile.dailyGoalMinutes ?? 15,
        streakDays: profile.streakDays ?? 0,
        lastActiveAt: profile.lastActiveAt,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      }
      : null,
  };
}

/**
 * Sorts users so that ADMINs are always at the top of the list
 */
export function sortUsersWithAdminsFirst(users: AdminUserRecord[]): AdminUserRecord[] {
  return [...users].sort((a, b) => {
    // 1. Role priority: ADMIN always first
    const aIsAdmin = a.role?.toUpperCase() === "ADMIN";
    const bIsAdmin = b.role?.toUpperCase() === "ADMIN";
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;

    // 2. Active status priority: active before suspended
    if (!a.isSuspended && b.isSuspended) return -1;
    if (a.isSuspended && !b.isSuspended) return 1;

    // 3. Newest first (createdAt)
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Fetches users directory from backend with fallback
 */
export async function fetchAdminUsers(query?: {
  page?: number;
  limit?: number;
  role?: string;
  isSuspended?: boolean | "ALL";
  search?: string;
}): Promise<{ items: AdminUserRecord[]; total: number; page: number; limit: number; totalPages: number }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.role && query.role !== "ALL") params.append("role", query.role);
    if (typeof query?.isSuspended === "boolean") params.append("isSuspended", String(query.isSuspended));
    if (query?.search) params.append("search", query.search);

    const url = `${getApiBaseUrl()}/users?${params.toString()}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawData = json.data || json;
      const rawItems = rawData.items || (Array.isArray(rawData) ? rawData : []);
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const items = sortUsersWithAdminsFirst(rawItems.map(normalizeUserItem));
        return {
          items,
          total: rawData.total ?? items.length,
          page: rawData.page ?? (query?.page || 1),
          limit: rawData.limit ?? (query?.limit || 10),
          totalPages: rawData.totalPages ?? 1,
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch live users directory, using fallback", err);
  }

  // Filter fallback
  let filtered = sortUsersWithAdminsFirst([...MOCK_ADMIN_USERS]);
  if (query?.role && query.role !== "ALL") {
    filtered = filtered.filter((u) => u.role.toUpperCase() === query.role?.toUpperCase());
  }
  if (typeof query?.isSuspended === "boolean") {
    filtered = filtered.filter((u) => u.isSuspended === query.isSuspended);
  }
  if (query?.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    items: paginated,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Toggles or updates user suspension status
 */
export async function toggleUserSuspensionApi(
  userId: string,
  isSuspended?: boolean
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const body = typeof isSuspended === "boolean" ? JSON.stringify({ isSuspended }) : undefined;

    // First try standard toggle endpoint
    let res = await fetch(`${getApiBaseUrl()}/users/${userId}/toggle-suspend`, {
      method: "PATCH",
      headers,
      body,
    });

    // If 404, fallback to /users/:id
    if (!res.ok && res.status === 404) {
      res = await fetch(`${getApiBaseUrl()}/users/${userId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(typeof isSuspended === "boolean" ? { isSuspended } : {}),
      });
    }

    if (res.ok) {
      const json = await res.json();
      const message = json.message || json.data?.message || "User status updated successfully";
      return { success: true, data: json.data, message };
    }
    const errJson = await res.json().catch(() => ({}));
    return { success: false, message: errJson.message || "Failed to toggle user suspension." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while updating suspension." };
  }
}

/**
 * Updates a user's role (ADMIN | USER)
 */
export async function updateUserRoleApi(
  userId: string,
  role: "ADMIN" | "USER"
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/users/${userId}/role`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      const json = await res.json();
      return { success: true, data: json.data, message: json.message };
    }
    const errJson = await res.json().catch(() => ({}));
    return { success: false, message: errJson.message || "Failed to update user role." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while updating user role." };
  }
}
