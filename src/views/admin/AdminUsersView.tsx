"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_ADMIN_USERS, AdminUserRecord } from "@/lib/api/admin";

export function AdminUsersView() {
  const [users, setUsers] = useState<AdminUserRecord[]>(MOCK_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [editingRoleUser, setEditingRoleUser] = useState<AdminUserRecord | null>(null);
  const [newRole, setNewRole] = useState<"ADMIN" | "USER" | "STUDENT" | "TEACHER">("USER");

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "ALL" || u.role.toUpperCase() === roleFilter.toUpperCase();
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = () => {
    if (!editingRoleUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingRoleUser.id ? { ...u, role: newRole } : u))
    );
    setEditingRoleUser(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold";
      case "STUDENT":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "TEACHER":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Learners & User Directory"
        subtitle="Manage learner profiles, administrative privileges, and placement test histories."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-ink-soft">
              {users.length} Registered Accounts
            </span>
          </div>
        }
      />

      {/* Filter and Search */}
      <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
            🔍
          </span>
          <Input
            type="text"
            placeholder="Search learners by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-10"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
            Role:
          </span>
          {["ALL", "ADMIN", "USER", "STUDENT"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                roleFilter === r
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-ink-soft text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Proficiency</th>
              <th className="py-3 px-3">Auth Provider</th>
              <th className="py-3 px-3">Tests Taken</th>
              <th className="py-3 px-3">Last Active</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
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
                      <p className="font-semibold text-ink truncate group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                        {u.name}
                      </p>
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

                {/* Actions */}
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoleUser(u);
                        setNewRole(u.role);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-ink text-xs font-semibold transition-colors"
                      title="Change user role"
                    >
                      Role
                    </button>
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
            ))}
          </tbody>
        </table>
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
                <span className="font-bold text-ink">{selectedUser.role}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Current Level</span>
                <span className="font-bold text-primary dark:text-purple-300">{selectedUser.level}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Target CEFR</span>
                <span className="font-bold text-ink">{selectedUser.targetLevel || "C1"}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px] uppercase font-bold">Registered Via</span>
                <span className="font-bold font-mono uppercase text-ink">{selectedUser.provider}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
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
              {(["USER", "STUDENT", "ADMIN", "TEACHER"] as const).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    newRole === r
                      ? "bg-primary/10 border-primary/40 text-primary dark:text-purple-300 font-bold"
                      : "bg-paper border-slate-200 dark:border-white/10 text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="roleSelection"
                      value={r}
                      checked={newRole === r}
                      onChange={() => setNewRole(r)}
                      className="accent-primary"
                    />
                    <span className="text-xs uppercase">{r}</span>
                  </div>
                  {r === "ADMIN" && (
                    <span className="text-[10px] text-amber-500 font-bold">
                      Full Access
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
                className="text-xs font-bold"
              >
                Save Role
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
