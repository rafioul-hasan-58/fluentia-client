"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/admin";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getApiBaseUrl } from "@/lib/api/config";

interface LearnerPermissions {
  retakePolicy: "immediate" | "daily" | "weekly" | "once";
  allowAiExplanations: boolean;
  allowSectionBreakdown: boolean;
  allowPdfDownload: boolean;
  allowAudioPronunciation: boolean;
  allowCustomGoals: boolean;
  allowCommunityDiscussions: boolean;
  requireEmailVerification: boolean;
  allowGoogleAuth: boolean;
  allowAccountDeletion: boolean;
}

const DEFAULT_PERMISSIONS: LearnerPermissions = {
  retakePolicy: "immediate",
  allowAiExplanations: true,
  allowSectionBreakdown: true,
  allowPdfDownload: true,
  allowAudioPronunciation: true,
  allowCustomGoals: true,
  allowCommunityDiscussions: true,
  requireEmailVerification: false,
  allowGoogleAuth: true,
  allowAccountDeletion: true,
};

export function AdminSettingsView() {
  const { user, updateProfile, uploadAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"preferences" | "permissions" | "platform">("preferences");

  // --- TAB 1: User Preferences State ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [timezone, setTimezone] = useState("Asia/Dhaka");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // --- TAB 2: Learner Permissions ("What is Allowed to User") ---
  const [permissions, setPermissions] = useState<LearnerPermissions>(DEFAULT_PERMISSIONS);
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  // --- TAB 3: Platform Engine State ---
  const [apiEndpoint, setApiEndpoint] = useState(getApiBaseUrl());
  const [questionsPerTest, setQuestionsPerTest] = useState(20);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  const [isSavingPlatform, setIsSavingPlatform] = useState(false);

  // Global Alert State
  const [statusAlert, setStatusAlert] = useState<{ message: string; type: "success" | "warn" } | null>(null);

  // Sync user state on mount / update
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || (user.name ? user.name.split(" ")[0] : "Fluentia"));
      setLastName(user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : "Admin"));
      setBio(user.bio || "Platform Administrator & Academic Evaluation Director");
      setPhoneNumber(user.phoneNumber || "");
      setCountry(user.country || "Bangladesh");
      setTimezone(user.timezone || "Asia/Dhaka");
      setAvatarUrl(user.profileImage || user.avatar || "");
    }
  }, [user]);

  // Load permissions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fluentia_user_permissions");
      if (stored) {
        setPermissions(JSON.parse(stored));
      }
      const storedPlatform = localStorage.getItem("fluentia_platform_settings");
      if (storedPlatform) {
        const parsed = JSON.parse(storedPlatform);
        if (parsed.questionsPerTest) setQuestionsPerTest(parsed.questionsPerTest);
        if (parsed.timeLimitMinutes) setTimeLimitMinutes(parsed.timeLimitMinutes);
        if (parsed.aiModel) setAiModel(parsed.aiModel);
      }
    } catch {
      // ignore
    }
  }, []);

  const triggerAlert = (message: string, type: "success" | "warn" = "success") => {
    setStatusAlert({ message, type });
    setTimeout(() => setStatusAlert(null), 3500);
  };

  // --- Handlers: Profile & Preferences ---
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerAlert("Please select a valid image file (PNG, JPG, WebP).", "warn");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerAlert("Image size exceeds 5MB limit.", "warn");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const res = await uploadAvatar(file);
      if (res.success && res.profileImageUrl) {
        setAvatarUrl(res.profileImageUrl);
        triggerAlert("Profile photo uploaded and updated successfully!", "success");
      } else {
        triggerAlert(res.error || "Failed to upload photo.", "warn");
      }
    } catch (err: any) {
      triggerAlert(err.message || "An error occurred while uploading.", "warn");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      triggerAlert("First name cannot be empty.", "warn");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        phoneNumber: phoneNumber.trim(),
        country: country.trim(),
        timezone: timezone.trim(),
        profileImage: avatarUrl.trim() || undefined,
      });

      if (res.success) {
        triggerAlert("Administrator profile & preferences saved successfully!", "success");
      } else {
        triggerAlert(res.error || "Could not save profile preferences.", "warn");
      }
    } catch (err: any) {
      triggerAlert(err.message || "Failed to save profile.", "warn");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // --- Handlers: Learner Permissions ---
  const togglePermission = (key: keyof LearnerPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePermissions = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPermissions(true);
    try {
      localStorage.setItem("fluentia_user_permissions", JSON.stringify(permissions));
      triggerAlert("Learner feature access & policy controls updated successfully!", "success");
    } catch (err: any) {
      triggerAlert("Failed to save learner permissions.", "warn");
    } finally {
      setIsSavingPermissions(false);
    }
  };

  // --- Handlers: Platform Engine ---
  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPlatform(true);
    try {
      const payload = {
        apiEndpoint,
        questionsPerTest,
        timeLimitMinutes,
        aiModel,
      };
      localStorage.setItem("fluentia_platform_settings", JSON.stringify(payload));
      triggerAlert("Platform & diagnostic evaluation engine configuration updated!", "success");
    } catch (err: any) {
      triggerAlert("Failed to save platform configuration.", "warn");
    } finally {
      setIsSavingPlatform(false);
    }
  };

  const initials = `${firstName[0] || "A"}${lastName[0] || "D"}`.toUpperCase();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Platform & Profile Settings"
        subtitle="Manage administrator profile preferences, learner feature permissions, and AI evaluation engine rules."
      />

      {/* Global Action Status Alert */}
      {statusAlert && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            statusAlert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          }`}
        >
          <span>{statusAlert.type === "success" ? "✓" : "⚠️"}</span>
          <span>{statusAlert.message}</span>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs flex-wrap">
        {[
          {
            id: "preferences",
            label: "Admin Profile & Preferences",
            icon: "👤",
            desc: "Name, photo & account info",
          },
          {
            id: "permissions",
            label: "Learner Permissions",
            icon: "🔒",
            desc: "What is allowed to users",
          },
          {
            id: "platform",
            label: "Platform & Evaluation Engine",
            icon: "⚙️",
            desc: "API, AI models & timer rules",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-sm dark:shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <div className="text-left">
              <span className="block leading-tight">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: User Preferences (Name, Photo, Bio, Details)                      */}
      {/* ========================================================================= */}
      {activeTab === "preferences" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-fadeIn">
          {/* Profile Photo & Identity Card */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Administrator Profile Photo
              </h2>
              <p className="text-xs text-ink-soft">
                Upload a portrait avatar or specify an image URL for your administrator identity.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative group">
                <Avatar
                  src={avatarUrl || undefined}
                  fallback={initials}
                  size="lg"
                  className="w-24 h-24 text-xl border-2 border-primary/40 shadow-md ring-4 ring-primary/10"
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    <span className="animate-spin">🔄</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div>
                  <h3 className="font-bold text-sm text-ink">{firstName} {lastName}</h3>
                  <p className="text-xs text-ink-soft">{user?.email || "admin@fluentia.ai"}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    🛡️ Super Administrator
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="text-xs font-bold shadow-xs"
                  >
                    <span>📷</span>
                    <span className="ml-1.5">Upload Photo</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                    className="text-xs font-semibold"
                  >
                    <span>🔗</span>
                    <span className="ml-1.5">{showAvatarUrlInput ? "Hide URL" : "Paste Image URL"}</span>
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAvatarUrl("")}
                      className="text-xs text-rose-500 hover:text-rose-600 border-rose-500/20 hover:bg-rose-500/10"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {showAvatarUrlInput && (
                  <div className="pt-2 animate-fadeIn max-w-md">
                    <Label htmlFor="avatarUrlInput" className="text-[11px]">Direct Image Link</Label>
                    <Input
                      id="avatarUrlInput"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="text-xs mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information & Names */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Admin Details & Preferences
              </h2>
              <p className="text-xs text-ink-soft">
                Manage your name, professional title, and contact coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="adminFirstName">First Name</Label>
                <Input
                  id="adminFirstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Fluentia"
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminLastName">Last Name</Label>
                <Input
                  id="adminLastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Admin"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="adminBio">Professional Bio & Admin Title</Label>
                <Input
                  id="adminBio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Evaluation Coordinator & System Administrator"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminEmail">Email Address</Label>
                <div className="relative">
                  <Input
                    id="adminEmail"
                    type="email"
                    value={user?.email || "admin@fluentia.ai"}
                    disabled
                    className="text-xs bg-slate-100 dark:bg-white/5 opacity-80 cursor-not-allowed pr-20"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Verified ✓
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminPhone">Phone Number</Label>
                <Input
                  id="adminPhone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+880 1700-000000"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminCountry">Country</Label>
                <Input
                  id="adminCountry"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="adminTimezone">Timezone</Label>
                <Input
                  id="adminTimezone"
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="Asia/Dhaka (GMT+6)"
                  className="text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="gradient"
              disabled={isSavingProfile}
              className="px-6 h-11 text-xs font-bold shadow-md"
            >
              {isSavingProfile ? "Saving Changes..." : "Save Profile Preferences"}
            </Button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Learner Permissions ("What is Allowed to User")                    */}
      {/* ========================================================================= */}
      {activeTab === "permissions" && (
        <form onSubmit={handleSavePermissions} className="space-y-6 animate-fadeIn">
          {/* Test Retake & Evaluation Rules */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Placement Test Retake Policy
              </h2>
              <p className="text-xs text-ink-soft">
                Define how frequently learners are permitted to retake diagnostic placement evaluations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: "immediate",
                  title: "Immediate Retake",
                  desc: "Learners can retake tests anytime without cooldown.",
                  badge: "Recommended",
                },
                {
                  id: "daily",
                  title: "Once per 24h",
                  desc: "Enforces 24-hour interval between test attempts.",
                  badge: "Standard",
                },
                {
                  id: "weekly",
                  title: "Once per Week",
                  desc: "7-day cooldown to assess long-term learning growth.",
                  badge: "Rigorous",
                },
                {
                  id: "once",
                  title: "Single Diagnostic",
                  desc: "Locked after first attempt unless unlocked by admin.",
                  badge: "Strict",
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setPermissions({ ...permissions, retakePolicy: opt.id as any })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    permissions.retakePolicy === opt.id
                      ? "bg-primary/10 border-primary/50 text-primary dark:text-purple-300 ring-2 ring-primary/20 shadow-xs"
                      : "bg-paper border-slate-200 dark:border-white/10 text-ink hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{opt.title}</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-ink-soft">
                      {opt.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-soft">{opt.desc}</p>
                  <div className="flex items-center gap-2 pt-1 text-xs font-semibold">
                    <input
                      type="radio"
                      name="retakePolicy"
                      checked={permissions.retakePolicy === opt.id}
                      onChange={() => {}}
                      className="accent-primary w-4 h-4"
                    />
                    <span>Select</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Feature Access Toggles */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Learner Feature Access & Permissions
              </h2>
              <p className="text-xs text-ink-soft">
                Control which interactive learning features, AI analysis, and exports are accessible to standard learners.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "allowAiExplanations",
                  title: "AI In-Depth Diagnostic Analysis & Explanations",
                  desc: "Allow learners to receive AI-generated error breakdowns, rule summaries, and personalized study roadmaps.",
                  icon: "🤖",
                  category: "AI Intelligence",
                },
                {
                  key: "allowSectionBreakdown",
                  title: "Section-wise Accuracy Breakdown (Grammar, Vocab, Reading)",
                  desc: "Display quantitative scores per section on learner test completion cards.",
                  icon: "📊",
                  category: "Evaluation",
                },
                {
                  key: "allowPdfDownload",
                  title: "CEFR Official Diagnostic PDF Scorecard Download",
                  desc: "Allow learners to export verified certificate PDF summary cards of their language rating.",
                  icon: "📄",
                  category: "Export",
                },
                {
                  key: "allowAudioPronunciation",
                  title: "Audio Speech Synthesis & Pronunciation Player",
                  desc: "Enable text-to-speech audio playback for reading comprehension and vocabulary phrases.",
                  icon: "🔊",
                  category: "Practice",
                },
                {
                  key: "allowCustomGoals",
                  title: "Custom Study Goals & Daily Streak Tracking",
                  desc: "Allow learners to configure target CEFR levels, native language, and daily commitment goals.",
                  icon: "🎯",
                  category: "Personalization",
                },
                {
                  key: "allowCommunityDiscussions",
                  title: "Community Peer Discussions & Question Forum",
                  desc: "Enable learners to share insights, post questions, and interact on grammar challenge topics.",
                  icon: "💬",
                  category: "Social",
                },
                {
                  key: "requireEmailVerification",
                  title: "Mandatory Email Verification Before Level Test",
                  desc: "Requires learners to confirm their email address before initiating an evaluation session.",
                  icon: "✉️",
                  category: "Security",
                },
                {
                  key: "allowGoogleAuth",
                  title: "Google One-Click Social Authentication",
                  desc: "Allow learners to register and sign in seamlessly via Google OAuth 2.0.",
                  icon: "🌐",
                  category: "Authentication",
                },
                {
                  key: "allowAccountDeletion",
                  title: "Self-Service Account & Data Deletion",
                  desc: "Permit learners to permanently delete their account and wipe stored attempt histories.",
                  icon: "🗑️",
                  category: "Compliance",
                },
              ].map((item) => {
                const isEnabled = permissions[item.key as keyof LearnerPermissions];
                return (
                  <div
                    key={item.key}
                    onClick={() => togglePermission(item.key as keyof LearnerPermissions)}
                    className="p-3.5 sm:p-4 rounded-2xl bg-paper hover:bg-slate-50 dark:hover:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                        {item.icon}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-ink">{item.title}</span>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-ink-soft">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-soft max-w-2xl">{item.desc}</p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="shrink-0 flex items-center">
                      <div
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                          isEnabled ? "bg-primary" : "bg-slate-300 dark:bg-white/20"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                            isEnabled ? "translate-x-5.5" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="gradient"
              disabled={isSavingPermissions}
              className="px-6 h-11 text-xs font-bold shadow-md"
            >
              {isSavingPermissions ? "Updating Policy..." : "Save Learner Permissions"}
            </Button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Platform & Evaluation Engine (API, Models, Timer)                  */}
      {/* ========================================================================= */}
      {activeTab === "platform" && (
        <form onSubmit={handleSavePlatform} className="space-y-6 animate-fadeIn">
          {/* System Health & Endpoints */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="space-y-0.5">
                <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                  Backend API & System Connection
                </h2>
                <p className="text-xs text-ink-soft">
                  Core REST API URL and connection health
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational (14ms)</span>
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiBase">Primary Backend API URL</Label>
              <Input
                id="apiBase"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-ink-soft">
                Configured: <code className="text-primary dark:text-purple-300">{apiEndpoint}</code>
              </p>
            </div>
          </div>

          {/* Placement Test Rules */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Placement Test Engine Configuration
              </h2>
              <p className="text-xs text-ink-soft">
                Control the number of items and timer rules for the general English placement test
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="qCount">Questions Per Test Session</Label>
                <Input
                  id="qCount"
                  type="number"
                  min={4}
                  max={60}
                  value={questionsPerTest}
                  onChange={(e) => setQuestionsPerTest(Number(e.target.value))}
                  className="text-xs"
                />
                <p className="text-[11px] text-ink-soft">Currently configured: <strong>{questionsPerTest} questions</strong> per session</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="timeLim">Test Time Limit (Minutes)</Label>
                <Input
                  id="timeLim"
                  type="number"
                  min={5}
                  max={60}
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                  className="text-xs"
                />
                <p className="text-[11px] text-ink-soft">Recommended timer: <strong>{timeLimitMinutes} minutes</strong></p>
              </div>
            </div>
          </div>

          {/* AI Evaluation Engine */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-white/10 pb-3">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                AI Analysis & Diagnostic Models
              </h2>
              <p className="text-xs text-ink-soft">
                Configure generative reasoning parameters for personalized roadmaps and strengths/weaknesses
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="model">Evaluation AI Model</Label>
                <select
                  id="model"
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost Efficient)</option>
                  <option value="gpt-4o">gpt-4o (High Precision Syntactic Analysis)</option>
                  <option value="claude-3-5-sonnet">claude-3-5-sonnet (Pedagogical Deep Reasoning)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Multimodal & Long Context)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Sampling Temperature Setting</Label>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs text-ink font-mono flex items-center justify-between">
                  <span>0.2 (Deterministic / Academic)</span>
                  <span className="text-[10px] text-emerald-500 font-bold">Standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="submit"
              variant="gradient"
              disabled={isSavingPlatform}
              className="px-6 h-11 text-xs font-bold shadow-md"
            >
              {isSavingPlatform ? "Saving Engine Config..." : "Save Platform Settings"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
