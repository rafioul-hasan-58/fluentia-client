"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  MOCK_ADMIN_USERS,
  AdminUserRecord,
  fetchAdminUsers,
  toggleUserSuspensionApi,
  updateUserRoleApi,
  sortUsersWithAdminsFirst,
} from "@/lib/api/admin";

export function AdminUsersView() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUserRecord[]>(sortUsersWithAdminsFirst(MOCK_ADMIN_USERS));
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(MOCK_ADMIN_USERS.length);

  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [editingRoleUser, setEditingRoleUser] = useState<AdminUserRecord | null>(null);
  const [newRole, setNewRole] = useState<"ADMIN" | "USER">("USER");
  const [isUpdatingAction, setIsUpdatingAction] = useState(false);
  const [actionAlert, setActionAlert] = useState<{ message: string; type: "success" | "warn" } | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const isSuspendedParam =
        statusFilter === "ALL" ? undefined : statusFilter === "SUSPENDED";

      const res = await fetchAdminUsers({
        page: currentPage,
        limit: 10,
        role: roleFilter,
        isSuspended: isSuspendedParam,
        search: searchQuery.trim() || undefined,
      });

      setUsers(sortUsersWithAdminsFirst(res.items));
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.warn("Error loading admin users directory", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, roleFilter, statusFilter, searchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reset page to 1 when filters change
  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleUpdateRole = async () => {
    if (!editingRoleUser) return;

    if (
      currentAdmin?.email &&
      editingRoleUser.email.toLowerCase() === currentAdmin.email.toLowerCase() &&
      newRole !== "ADMIN"
    ) {
      setActionAlert({
        message: "You cannot revoke administrative access from your own current account.",
        type: "warn",
      });
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }

    setIsUpdatingAction(true);
    try {
      const res = await updateUserRoleApi(editingRoleUser.id, newRole);
      if (res.success) {
        setUsers((prev) =>
          sortUsersWithAdminsFirst(
            prev.map((u) => (u.id === editingRoleUser.id ? { ...u, role: newRole } : u))
          )
        );
        if (selectedUser && selectedUser.id === editingRoleUser.id) {
          setSelectedUser({ ...selectedUser, role: newRole });
        }
        setActionAlert({
          message: `Role for ${editingRoleUser.name} updated to ${newRole} successfully.`,
          type: "success",
        });
        setEditingRoleUser(null);
      } else {
        setActionAlert({
          message: res.message || "Failed to update user role on server.",
          type: "warn",
        });
      }
    } catch (err: any) {
      setActionAlert({
        message: err.message || "An error occurred while updating role.",
        type: "warn",
      });
    } finally {
      setIsUpdatingAction(false);
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  const handleToggleSuspend = async (targetUser: AdminUserRecord) => {
    if (currentAdmin?.email && targetUser.email.toLowerCase() === currentAdmin.email.toLowerCase()) {
      setActionAlert({
        message: "You cannot suspend your own active administrator account.",
        type: "warn",
      });
      setTimeout(() => setActionAlert(null), 3500);
      return;
    }

    const nextState = !targetUser.isSuspended;
    setIsUpdatingAction(true);

    // Optimistic UI update
    setUsers((prev) =>
      sortUsersWithAdminsFirst(
        prev.map((u) => (u.id === targetUser.id ? { ...u, isSuspended: nextState } : u))
      )
    );
    if (selectedUser && selectedUser.id === targetUser.id) {
      setSelectedUser({ ...selectedUser, isSuspended: nextState });
    }

    try {
      const res = await toggleUserSuspensionApi(targetUser.id, nextState);
      if (res.success) {
        setActionAlert({
          message: nextState
            ? `Account for ${targetUser.name} has been suspended.`
            : `Account for ${targetUser.name} has been reactivated.`,
          type: nextState ? "warn" : "success",
        });
      } else {
        // Revert on failure
        setUsers((prev) =>
          sortUsersWithAdminsFirst(
            prev.map((u) => (u.id === targetUser.id ? { ...u, isSuspended: targetUser.isSuspended } : u))
          )
        );
        if (selectedUser && selectedUser.id === targetUser.id) {
          setSelectedUser({ ...selectedUser, isSuspended: targetUser.isSuspended });
        }
        setActionAlert({
          message: res.message || "Could not update suspension status.",
          type: "warn",
        });
      }
    } catch (err: any) {
      // Revert on failure
      setUsers((prev) =>
        sortUsersWithAdminsFirst(
          prev.map((u) => (u.id === targetUser.id ? { ...u, isSuspended: targetUser.isSuspended } : u))
        )
      );
      setActionAlert({
        message: err.message || "Network error updating suspension status.",
        type: "warn",
      });
    } finally {
      setIsUpdatingAction(false);
      setTimeout(() => setActionAlert(null), 3500);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role?.toUpperCase() === "ADMIN") {
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold";
    }
    return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
  };

  const sortedUsers = sortUsersWithAdminsFirst(users);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Learners & User Directory"
        subtitle="Manage learner profiles, administrative access, and account suspension statuses."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsers}
              disabled={isLoading}
              className="text-xs font-semibold"
              title="Refresh users directory"
            >
              <span className={isLoading ? "animate-spin mr-1.5 inline-block" : "mr-1.5"}>
                🔄
              </span>
              <span>Refresh</span>
            </Button>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-ink-soft">
              {totalCount} Total Accounts
            </span>
          </div>
        }
      />

      {/* Action Notification Alert */}
      {actionAlert && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            actionAlert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          }`}
        >
          <span>{actionAlert.type === "success" ? "✓" : "⚠️"}</span>
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Search learners by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 text-xs h-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/60 dark:border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft px-2">
                Status:
              </span>
              {[
                { key: "ALL", label: "All" },
                { key: "ACTIVE", label: "Active" },
                { key: "SUSPENDED", label: "Suspended" },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => handleStatusFilterChange(st.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === st.key
                      ? "bg-white dark:bg-white/15 text-ink shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-white/10 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
              Role:
            </span>
            {["ALL", "USER", "ADMIN"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleFilterChange(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  roleFilter === r
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
                }`}
              >
                {r === "ALL" ? "All Roles" : r}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-ink-soft">
            Showing <strong className="text-ink">{sortedUsers.length}</strong> of {totalCount} accounts
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-ink-soft text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Proficiency</th>
              <th className="py-3 px-3">Auth Provider</th>
              <th className="py-3 px-3">Tests Taken</th>
              <th className="py-3 px-3">Last Active</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-ink-soft">
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin inline-block">🔄</span>
                    <span>Loading user directory...</span>
                  </div>
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-ink-soft">
                  <p className="text-sm font-semibold text-ink">No users match your filters.</p>
                  <p className="text-xs text-ink-soft mt-1">Try broadening your search or resetting filters.</p>
                </td>
              </tr>
            ) : (
              sortedUsers.map((u) => (
                <tr
                  key={u.id}
                  className={`transition-colors group ${
                    u.role === "ADMIN"
                      ? "bg-amber-500/[0.02] dark:bg-amber-500/[0.03] hover:bg-amber-500/[0.06]"
                      : u.isSuspended
                      ? "bg-rose-500/[0.03] hover:bg-rose-500/[0.06]"
                      : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  {/* User Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={u.avatar || undefined}
                        fallback={u.name.slice(0, 2).toUpperCase()}
                        size="sm"
                        className="w-8 h-8 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-ink truncate group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                            {u.name}
                          </p>
                          {u.role === "ADMIN" && (
                            <span className="text-[10px] text-amber-500 font-bold" title="Administrator">
                              🛡️
                            </span>
                          )}
                          {u.isSuspended && (
                            <span className="text-[10px] text-rose-500 font-bold" title="Suspended Account">
                              🚫
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-soft truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Badge */}
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Suspension Status */}
                  <td className="py-3.5 px-3">
                    {u.isSuspended ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                        <span>🚫</span>
                        <span>Suspended</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <span>🟢</span>
                        <span>Active</span>
                      </span>
                    )}
                  </td>

                  {/* Proficiency */}
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-ink">
                      {u.level}
                    </span>
                  </td>

                  {/* Auth Provider */}
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 font-mono text-ink-soft uppercase">
                      {u.provider}
                    </span>
                  </td>

                  {/* Tests Taken */}
                  <td className="py-3.5 px-3 font-semibold text-ink">
                    {u.testsTaken} tests
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-3 text-ink-soft text-[11px]">
                    {u.lastActive}
                  </td>

                  {/* Actions & Suspend Toggle */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Suspend / Activate Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleSuspend(u)}
                        disabled={isUpdatingAction}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          u.isSuspended
                            ? "bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white dark:text-rose-400 border-rose-500/30"
                        }`}
                        title={u.isSuspended ? "Reactivate account" : "Suspend account"}
                      >
                        {u.isSuspended ? "Activate" : "Suspend"}
                      </button>

                      {/* Change Role */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRoleUser(u);
                          setNewRole(u.role === "ADMIN" ? "ADMIN" : "USER");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-ink text-xs font-semibold transition-colors"
                        title="Change user role"
                      >
                        Role
                      </button>

                      {/* Profile details */}
                      <button
                        type="button"
                        onClick={() => setSelectedUser(u)}
                        className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white dark:text-purple-300 text-xs font-semibold transition-colors"
                        title="View user details"
                      >
                        Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200 dark:border-white/10">
            <span className="text-xs text-ink-soft">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={selectedUser.avatar || undefined}
                  fallback={selectedUser.name.slice(0, 2).toUpperCase()}
                  size="md"
                />
                <div>
                  <h3 className="font-brand text-lg font-bold text-ink">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-ink-soft">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs">
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Assigned Role</span>
                <span className={`inline-block font-bold text-[11px] px-2 py-0.5 rounded-full border uppercase mt-0.5 ${getRoleBadge(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Account Status</span>
                <span className={`font-bold mt-0.5 block ${selectedUser.isSuspended ? "text-rose-500" : "text-emerald-500"}`}>
                  {selectedUser.isSuspended ? "Suspended 🚫" : "Active 🟢"}
                </span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Current Level</span>
                <span className="font-bold text-primary dark:text-purple-300">{selectedUser.level}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Target CEFR</span>
                <span className="font-bold text-ink">{selectedUser.profile?.targetLevel || selectedUser.targetLevel || "Not Specified"}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Native Language</span>
                <span className="font-bold text-ink">{selectedUser.profile?.nativeLanguage || "Not Specified"}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Registered Via</span>
                <span className="font-bold font-mono uppercase text-ink">{selectedUser.provider}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Tests Completed</span>
                <span className="font-bold text-ink">{selectedUser.testsTaken}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Daily Study Goal</span>
                <span className="font-bold text-ink">{selectedUser.profile?.dailyGoalMinutes || 15} min / day</span>
              </div>
            </div>

            {/* Learning Goals */}
            {selectedUser.profile?.learningGoals && selectedUser.profile.learningGoals.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  Learner Goals:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedUser.profile.learningGoals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:text-purple-300 text-xs font-semibold"
                    >
                      🎯 {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => handleToggleSuspend(selectedUser)}
                disabled={isUpdatingAction}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  selectedUser.isSuspended
                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white border-rose-500/30"
                }`}
              >
                {selectedUser.isSuspended ? "Reactivate User" : "Suspend User"}
              </button>

              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRoleUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="font-brand text-lg font-bold text-ink">
                Update User Role
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoleUser(null)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-ink-soft">
              Change permissions for <strong className="text-ink">{editingRoleUser.name}</strong> ({editingRoleUser.email}).
            </p>

            <div className="space-y-2">
              {(["USER", "ADMIN"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    newRole === r
                      ? "bg-primary/10 border-primary/40 text-primary dark:text-purple-300 font-bold"
                      : "bg-paper border-slate-200 dark:border-white/10 text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="roleSelection"
                      value={r}
                      checked={newRole === r}
                      onChange={() => setNewRole(r)}
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase">{r}</span>
                      <p className="text-[10px] text-ink-soft">
                        {r === "ADMIN" ? "Full access to dashboard, questions, attempts & settings" : "Standard learner access"}
                      </p>
                    </div>
                  </div>
                  {r === "ADMIN" && (
                    <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Super Admin
                    </span>
                  )}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingRoleUser(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleUpdateRole}
                disabled={isUpdatingAction}
                className="text-xs font-bold"
              >
                {isUpdatingAction ? "Saving..." : "Save Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
