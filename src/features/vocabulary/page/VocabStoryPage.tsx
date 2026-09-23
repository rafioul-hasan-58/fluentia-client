"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import {
  useVocabStories,
  VocabStoryHeader,
  VocabStoryFilterBar,
  VocabStoryCard,
  VocabStoryEmptyState,
  VocabStoryFullscreenModal,
  DeleteStoryModal,
  EditStoryTitleModal,
  GenerateNewStoryModal,
  renderHighlightedStory,
} from "../vocab-story";

const VocabStoryPage = () => {
  const router = useRouter();

  const {
    stories,
    filteredStories,
    isLoading,
    error,
    loadStories,

    // Filters
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    todayOnly,
    setTodayOnly,
    storyDateCounts,
    todayCount,

    // Active Story / Reader Modal
    activeStory,
    activeStoryIndex,
    setActiveStoryId,
    viewTab,
    setViewTab,
    navigateStory,

    // Copying
    copiedState,
    handleCopy,

    // Deleting
    storyToDelete,
    setStoryToDelete,
    isDeleting,
    handleConfirmDelete,

    // Editing Title
    storyToEditTitle,
    setStoryToEditTitle,
    editedTitleInput,
    setEditedTitleInput,
    isUpdatingTitle,
    titleUpdateError,
    handleOpenEditTitle,
    handleSaveTitle,

    // Generation Modal
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    vaultWords,
    isLoadingVault,
    selectedWordIds,
    setSelectedWordIds,
    storyContext,
    setStoryContext,
    isGenerating,
    generationError,
    newlyCreatedStory,
    setNewlyCreatedStory,
    handleToggleWord,
    handleExecuteGenerate,
  } = useVocabStories();

  const totalTargetWords = useMemo(
    () => stories.reduce((acc, s) => acc + (s.usedVocabulary?.length || 0), 0),
    [stories]
  );

  const isFiltered = Boolean(selectedDate || todayOnly || searchQuery);

  const handleResetFilters = () => {
    setSelectedDate(null);
    setTodayOnly(false);
    setSearchQuery("");
  };

  const handleNavigateToCreate = () => {
    router.push("/dashboard/user/vocabulary?mode=create-story");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Quick Stats */}
      <VocabStoryHeader
        totalStories={stories.length}
        totalTargetWords={totalTargetWords}
        onCreateStory={handleNavigateToCreate}
      />

      {/* 2. Search & Filter Bar */}
      <VocabStoryFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        todayOnly={todayOnly}
        setTodayOnly={setTodayOnly}
        storyDateCounts={storyDateCounts}
        todayCount={todayCount}
        totalFiltered={filteredStories.length}
        isLoading={isLoading}
        onRefresh={loadStories}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Main Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={loadStories}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold mt-2 hover:bg-rose-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredStories.length === 0 ? (
        <VocabStoryEmptyState
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
          onCreateStory={handleNavigateToCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredStories.map((story, index) => (
            <VocabStoryCard
              key={story.id}
              story={story}
              index={index}
              onOpenEditTitle={handleOpenEditTitle}
              onDelete={setStoryToDelete}
              onViewDetails={setActiveStoryId}
            />
          ))}
        </div>
      )}

      {/* 4. Fullscreen Reader Modal */}
      <VocabStoryFullscreenModal
        isOpen={Boolean(activeStory)}
        activeStory={activeStory}
        activeStoryIndex={activeStoryIndex}
        totalStories={stories.length}
        onClose={() => setActiveStoryId(null)}
        onNavigateStory={navigateStory}
        viewTab={viewTab}
        setViewTab={setViewTab}
        copiedState={copiedState}
        onCopy={handleCopy}
        onDelete={setStoryToDelete}
      />

      {/* 5. Delete Confirmation Modal */}
      <DeleteStoryModal
        isOpen={Boolean(storyToDelete)}
        story={storyToDelete}
        isDeleting={isDeleting}
        onClose={() => setStoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* 6. Edit Story Title Modal */}
      <EditStoryTitleModal
        isOpen={Boolean(storyToEditTitle)}
        story={storyToEditTitle}
        titleInput={editedTitleInput}
        setTitleInput={setEditedTitleInput}
        isUpdating={isUpdatingTitle}
        error={titleUpdateError}
        onClose={() => setStoryToEditTitle(null)}
        onSave={handleSaveTitle}
      />

      {/* 7. Generate New Story Modal */}
      {isGenerateModalOpen && (
        <GenerateNewStoryModal
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          newlyCreatedStory={newlyCreatedStory}
          setNewlyCreatedStory={setNewlyCreatedStory}
          copiedState={copiedState}
          handleCopy={handleCopy}
          renderHighlightedStory={renderHighlightedStory}
          selectedWordIds={selectedWordIds}
          setSelectedWordIds={setSelectedWordIds}
          setActiveStoryId={setActiveStoryId}
          isLoadingVault={isLoadingVault}
          vaultWords={vaultWords}
          handleToggleWord={handleToggleWord}
          storyContext={storyContext}
          setStoryContext={setStoryContext}
          generationError={generationError}
          handleExecuteGenerate={handleExecuteGenerate}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};

export default VocabStoryPage;