"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UpdateUserProfileDto } from "@/types/user";

// Sample preset avatar choices for quick learner customization
const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
];

const COUNTRIES = [
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
];

const TIMEZONES = [
  { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka, Astana" },
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "Europe/London", label: "(UTC+00:00) London, Edinburgh, Dublin" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Berlin, Rome, Madrid" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Dubai, Abu Dhabi, Muscat" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Mumbai, New Delhi, Kolkata" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore, Kuala Lumpur, Beijing" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo, Osaka, Seoul" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne, Brisbane" },
];

const FLUENCY_LEVELS = [
  { value: "Beginner A1", label: "A1 - Beginner", desc: "Basic phrases and everyday expressions" },
  { value: "Elementary A2", label: "A2 - Elementary", desc: "Routine exchanges and simple sentences" },
  { value: "Intermediate B1", label: "B1 - Intermediate", desc: "Work, school, leisure discussions" },
  { value: "Intermediate B2", label: "B2 - Upper Intermediate", desc: "Fluent, spontaneous conversations" },
  { value: "Advanced C1", label: "C1 - Advanced", desc: "Complex academic & professional communication" },
  { value: "Proficient C2", label: "C2 - Mastery", desc: "Near-native precision & expression" },
];

export default function SettingsPage() {
  const { user, updateProfile, uploadAvatar, refreshProfile } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "preferences">("profile");

  // Form State
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [country, setCountry] = useState(user?.country || "Bangladesh");
  const [timezone, setTimezone] = useState(user?.timezone || "Asia/Dhaka");
  const [profileImage, setProfileImage] = useState(user?.profileImage || user?.avatar || "");
  const [level, setLevel] = useState(user?.level || "Intermediate B2");

  // Custom avatar URL input toggle
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Status feedback & image uploading state
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync state when user context is updated or refreshed
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || (user.name ? user.name.split(" ")[0] : ""));
      setLastName(user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""));
      setBio(user.bio || "");
      setPhoneNumber(user.phoneNumber || "");
      setCountry(user.country || "Bangladesh");
      setTimezone(user.timezone || "Asia/Dhaka");
      setProfileImage(user.profileImage || user.avatar || "");
      setLevel(user.level || "Intermediate B2");
    }
  }, [user]);

  // Attempt background refresh once on mount
  useEffect(() => {
    refreshProfile();
  }, []);

  // Compute if form has dirty / unsaved changes
  const isDirty = useMemo(() => {
    const origFirst = user?.firstName || (user?.name ? user.name.split(" ")[0] : "");
    const origLast = user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : "");
    const origBio = user?.bio || "";
    const origPhone = user?.phoneNumber || "";
    const origCountry = user?.country || "Bangladesh";
    const origTimezone = user?.timezone || "Asia/Dhaka";
    const origAvatar = user?.profileImage || user?.avatar || "";
    const origLevel = user?.level || "Intermediate B2";

    return (
      firstName !== origFirst ||
      lastName !== origLast ||
      bio !== origBio ||
      phoneNumber !== origPhone ||
      country !== origCountry ||
      timezone !== origTimezone ||
      profileImage !== origAvatar ||
      level !== origLevel
    );
  }, [user, firstName, lastName, bio, phoneNumber, country, timezone, profileImage, level]);

  const initials = useMemo(() => {
    const f = firstName.trim() ? firstName.trim()[0] : "";
    const l = lastName.trim() ? lastName.trim()[0] : "";
    if (f || l) return (f + l).toUpperCase();
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "FL";
  }, [firstName, lastName, user?.name]);

  const handleCopyId = () => {
    const idToCopy = user?.id || "6a96da820a2010ee88950305";
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const dto: UpdateUserProfileDto = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bio: bio.trim() || null,
      phoneNumber: phoneNumber.trim() || null,
      country: country.trim() || null,
      timezone: timezone.trim() || null,
      profileImage: profileImage || null,
      level,
    };

    try {
      const result = await updateProfile(dto);
      if (result.success) {
        setStatusMessage({
          type: "success",
          text: "Profile updated successfully! All changes have been saved.",
        });
        setTimeout(() => {
          setStatusMessage(null);
        }, 4000);
      } else {
        setStatusMessage({
          type: "error",
          text: result.error || "Failed to update profile. Please try again.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFirstName(user.firstName || (user.name ? user.name.split(" ")[0] : ""));
      setLastName(user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""));
      setBio(user.bio || "");
      setPhoneNumber(user.phoneNumber || "");
      setCountry(user.country || "Bangladesh");
      setTimezone(user.timezone || "Asia/Dhaka");
      setProfileImage(user.profileImage || user.avatar || "");
      setLevel(user.level || "Intermediate B2");
      setStatusMessage(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingImage(true);
    setStatusMessage(null);

    try {
      const result = await uploadAvatar(file);
      if (result.success && result.profileImageUrl) {
        setProfileImage(result.profileImageUrl);
        setStatusMessage({
          type: "success",
          text: "Profile picture uploaded and saved successfully!",
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({
          type: "error",
          text: result.error || "Failed to upload image to server.",
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to upload image file.",
      });
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const formattedCreatedAt = useMemo(() => {
    if (!user?.createdAt) return "September 2026";
    try {
      return new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return user.createdAt;
    }
  }, [user?.createdAt]);

  const formattedUpdatedAt = useMemo(() => {
    if (!user?.updatedAt) return "Just now";
    try {
      return new Date(user.updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return user.updatedAt;
    }
  }, [user?.updatedAt]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary dark:text-cyan-400 mb-1">
            <span>⚙️ Account Settings</span>
            <span>•</span>
            <span>Personal Profile</span>
          </div>
          <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Manage your personal profile details, fluency goals, and account security preferences.
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-2xs"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Alert Notifications */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-3 animate-fadeIn ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">
              {statusMessage.type === "success" ? "✅" : "⚠️"}
            </span>
            <p className="text-xs sm:text-sm font-semibold">{statusMessage.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Profile Overview Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-600/10 via-primary/5 to-indigo-600/10 dark:from-[#0B132B] dark:via-[#101d42] dark:to-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="relative group shrink-0">
              <Avatar
                src={profileImage || user?.avatar}
                fallback={initials}
                size="lg"
                className="w-20 h-20 sm:w-24 sm:h-24 min-w-[5rem] min-h-[5rem] sm:min-w-[6rem] sm:min-h-[6rem] max-w-[5rem] max-h-[5rem] sm:max-w-[6rem] sm:max-h-[6rem] aspect-square shrink-0 rounded-2xl ring-4 ring-white dark:ring-white/10 shadow-md text-2xl font-bold"
              />

              {/* Uploading Spinner Overlay */}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center backdrop-blur-2xs z-20">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                </div>
              )}

              <label
                htmlFor="avatar-file-top"
                className={`absolute -bottom-1 -right-1 p-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg cursor-pointer shadow-md transition-transform hover:scale-110 active:scale-95 z-20 ${
                  isUploadingImage ? "opacity-50 pointer-events-none" : ""
                }`}
                title="Upload profile picture"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  id="avatar-file-top"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-brand font-bold text-ink">
                  {firstName || lastName
                    ? `${firstName} ${lastName}`.trim()
                    : user?.name || "Learner"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary dark:bg-cyan-500/20 dark:text-cyan-300 border border-primary/20 dark:border-cyan-500/30">
                  {user?.role || "STUDENT"}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {user?.registrationMethod || (user?.provider === "google" ? "GOOGLE" : "EMAIL")}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-ink-soft flex items-center justify-center sm:justify-start gap-2">
                <span>📧 {user?.email || "user@fluentia.ai"}</span>
                {phoneNumber && (
                  <>
                    <span>•</span>
                    <span>📞 {phoneNumber}</span>
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-ink-soft">
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{country || "Global"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span>🎯</span>
                  <span className="font-semibold text-ink">{level}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span>Member since:</span>
                  <span className="font-medium text-ink-soft">{formattedCreatedAt}</span>
                </span>
              </div>
            </div>
          </div>

          {/* User ID Pill */}
          <div className="flex flex-col items-center md:items-end justify-center gap-1.5 bg-white/60 dark:bg-white/[0.04] p-3 rounded-2xl border border-slate-200 dark:border-white/5 backdrop-blur-xs">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
              User Identifier (UID)
            </span>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono font-semibold text-primary dark:text-cyan-300 bg-primary/10 dark:bg-cyan-500/10 px-2 py-1 rounded-lg">
                {user?.id ? `${user.id.slice(0, 10)}...${user.id.slice(-6)}` : "6a96da820a2010ee88950305"}
              </code>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1.5 text-xs text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                title="Copy full UID"
              >
                {copiedId ? "✓ Copied" : "📋"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === "profile"
              ? "bg-primary text-white shadow-sm"
              : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <span>👤</span>
          <span>Edit Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === "account"
              ? "bg-primary text-white shadow-sm"
              : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <span>🛡️</span>
          <span>Account & Security</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            activeTab === "preferences"
              ? "bg-primary text-white shadow-sm"
              : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <span>🎓</span>
          <span>Fluency & Learning Goals</span>
        </button>
      </div>

      {/* TAB 1: Edit Profile Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Personal Information</CardTitle>
              <CardDescription>
                Update your name, bio, contact details, and location. These will reflect across your Fluentia dashboard and AI conversations.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Avatar Selector Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
                <Label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Profile Photo & Avatar
                </Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative group shrink-0">
                    <Avatar
                      src={profileImage || user?.avatar}
                      fallback={initials}
                      size="md"
                      className="w-16 h-16 min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] aspect-square rounded-xl border border-slate-200 dark:border-white/10 shrink-0"
                    />
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-2xs z-20">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor="avatar-file-input"
                        className={`px-3 py-1.5 rounded-lg bg-paper-card border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-ink cursor-pointer transition-colors ${
                          isUploadingImage ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        {isUploadingImage ? "⏳ Uploading Image..." : "📁 Choose Image File"}
                        <input
                          id="avatar-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-3 py-1.5 rounded-lg bg-paper-card border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-semibold text-ink transition-colors"
                      >
                        🔗 Image URL
                      </button>

                      {profileImage && (
                        <button
                          type="button"
                          onClick={() => setProfileImage("")}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {showUrlInput && (
                      <div className="flex items-center gap-2 pt-1 animate-fadeIn">
                        <Input
                          placeholder="https://example.com/avatar.jpg"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          className="text-xs h-9"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (customAvatarUrl.trim()) {
                              setProfileImage(customAvatarUrl.trim());
                              setCustomAvatarUrl("");
                              setShowUrlInput(false);
                            }
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    )}

                    {/* Quick Preset Avatars */}
                    <div className="pt-2">
                      <p className="text-[11px] text-ink-soft mb-1.5 font-medium">
                        Or pick a featured avatar:
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProfileImage(preset)}
                            className={`w-9 h-9 min-w-[2.25rem] min-h-[2.25rem] max-w-[2.25rem] max-h-[2.25rem] aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 hover:scale-105 ${
                              profileImage === preset
                                ? "border-primary ring-2 ring-primary/30"
                                : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={preset}
                              alt={`Preset avatar ${idx + 1}`}
                              className="w-full h-full object-cover object-center aspect-square"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Name Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-ink">
                    First Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="e.g. Rafioul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-ink">
                    Last Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="e.g. Hasan Sourob"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email" className="text-xs font-semibold text-ink">
                      Email Address
                    </Label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Primary Verified
                    </span>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || "user@fluentia.ai"}
                    disabled
                    className="bg-slate-100 dark:bg-white/[0.03] text-ink-soft cursor-not-allowed border-dashed"
                  />
                  <p className="text-[10px] text-ink-soft">
                    Email is linked to your authentication provider ({user?.registrationMethod || "EMAIL"}).
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-xs font-semibold text-ink">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="e.g. +880 1700-000000 or +1 555 019-2834"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-[10px] text-ink-soft">
                    Used for optional SMS study streak reminders and 2FA notifications.
                  </p>
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className="text-xs font-semibold text-ink">
                    Bio / Learning Objective
                  </Label>
                  <span className="text-[10px] text-ink-soft">
                    {bio.length} / 300 characters
                  </span>
                </div>
                <textarea
                  id="bio"
                  rows={3}
                  maxLength={300}
                  placeholder="Share a short bio or your specific English learning goal (e.g., preparing for IELTS Academic Band 8.0, job interviews, or business presentations)..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex w-full rounded-xl border border-slate-200 dark:border-white/10 bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-xs resize-y"
                />
              </div>

              {/* Location & Timezone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold text-ink">
                    Country / Region
                  </Label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-paper px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-xs cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="timezone" className="text-xs font-semibold text-ink">
                    Timezone
                  </Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-paper px-3.5 py-2 text-sm text-ink focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-xs cursor-pointer"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sticky Form Save Footer */}
          <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              {isDirty ? (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
                  <span>●</span> You have unsaved changes
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>✓</span> Profile information is up to date
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={!isDirty || isSaving}
                className="w-full sm:w-auto text-xs"
              >
                Discard Changes
              </Button>

              <Button
                type="submit"
                variant="gradient"
                disabled={!isDirty || isSaving}
                className="w-full sm:w-auto text-xs min-w-[140px]"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Account & Security */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Account Details & Security</CardTitle>
              <CardDescription>
                System identifiers, role permissions, registration source, and timestamp records.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">
                    Account Role
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary dark:bg-cyan-500/20 dark:text-cyan-300 border border-primary/20">
                      {user?.role || "USER"}
                    </span>
                    <span className="text-xs text-ink-soft">Standard Student</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">
                    Registration Method
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-base">
                      {user?.registrationMethod === "GOOGLE" || user?.provider === "google" ? "🌐" : "✉️"}
                    </span>
                    <span className="text-xs font-bold text-ink">
                      {user?.registrationMethod || (user?.provider === "google" ? "GOOGLE OAUTH" : "EMAIL PASSWORD")}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">
                    Registration Date
                  </span>
                  <p className="text-xs font-semibold text-ink pt-1">{formattedCreatedAt}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">
                    Last Profile Update
                  </span>
                  <p className="text-xs font-semibold text-ink pt-1">{formattedUpdatedAt}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1 sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-ink-soft tracking-wider">
                    Database Unique ID
                  </span>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <code className="text-xs font-mono text-ink-soft bg-paper px-2 py-1 rounded-md border border-slate-200 dark:border-white/10 truncate">
                      {user?.id || "6a96da820a2010ee88950305"}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-paper border border-slate-200 dark:border-white/10 text-ink-soft hover:text-ink transition-colors shrink-0"
                    >
                      {copiedId ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected Accounts & Security Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-ink">Connected Services & Security</h4>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-paper">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg">
                      🔒
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">Two-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-ink-soft">Enhance your Fluentia learning account security</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-primary dark:text-cyan-400 bg-primary/10 px-2.5 py-1 rounded-lg">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Fluency & Learning Goals */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">CEFR Fluency Target</CardTitle>
              <CardDescription>
                Customize your English target level. Fluentia AI will adapt vocabulary complexity, grammar exercises, and conversational responses to your chosen goal.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FLUENCY_LEVELS.map((fl) => (
                  <div
                    key={fl.value}
                    onClick={async () => {
                      setLevel(fl.value);
                      await updateProfile({ level: fl.value });
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      level === fl.value
                        ? "border-primary bg-primary/10 dark:bg-cyan-500/10 shadow-sm"
                        : "border-slate-200 dark:border-white/10 hover:border-primary/50 bg-paper-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-ink">{fl.label}</span>
                      {level === fl.value && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-cyan-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-ink-soft leading-relaxed">{fl.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
