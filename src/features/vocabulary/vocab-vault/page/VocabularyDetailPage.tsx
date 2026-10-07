"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Minimize2 } from "lucide-react";
import { useVocabularyDetail } from "../hooks";
import {
  DetailLoadingSkeleton,
  DetailNotFound,
  DetailMobileHeader,
  WordHeroCard,
  AiEnrichmentBanner,
  CollocationsCard,
  SynonymsAntonymsCard,
  ContextualExamplesCard,
  PersonalNotesCard,
  PracticeSentencesCard,
} from "../components/detail";
import {
  DeleteVocabularyModal,
  EditVocabularyModal,
} from "../components/modals";

interface VocabularyDetailPageProps {
  word: string;
}

export function VocabularyDetailPage({ word }: VocabularyDetailPageProps) {
  const {
    item,
    wordData,
    decodedWord,
    isLoading,
    isLoadingDetails,
    isPlayingAudio,
    // Carousel & Navigation
    vaultList,
    currentIndex,
    displayIndex,
    navigateCarousel,
    handleExit,
    // Actions & Audio
    playPronunciation,
    handleToggleFavorite,
    handleSetMastery,
    // Notes
    notesText,
    setNotesText,
    isSavingNotes,
    notesSavedSuccess,
    handleSaveNotes,
    // Sentences
    newSentence,
    setNewSentence,
    isAddingSentence,
    handleAddSentence,
    handleDeleteSentence,
    // Delete Modal
    itemToDelete,
    setItemToDelete,
    isDeleting,
    handleConfirmDelete,
    // Edit Modal
    editingItem,
    setEditingItem,
    isSavingEdit,
    editStatus,
    setEditStatus,
    editIsFavorite,
    setEditIsFavorite,
    editSentences,
    editNewSentence,
    setEditNewSentence,
    editNotes,
    setEditNotes,
    editFeedback,
    handleOpenEditModal,
    handleRemoveSentence,
    handleAddSentenceToEdit,
    handleSaveEdit,
    totalWordCount,
    currentWordIndex
  } = useVocabularyDetail(word);

  if (isLoading) {
    return <DetailLoadingSkeleton />;
  }
  console.log("totalWordCount", totalWordCount);
  if (!item || !wordData) {
    return <DetailNotFound decodedWord={decodedWord} />;
  }

  return (
    <div className="-mx-3 -mt-3 -mb-3 sm:mx-0 sm:mt-0 sm:mb-0 w-[calc(100%+1.5rem)] sm:w-full min-h-[90vh] bg-slate-50/60 dark:bg-[#0b0c15] text-slate-900 dark:text-white flex flex-col animate-in fade-in duration-200">
      {/* 1. Top Header Bar (Mobile Mode Only: Exit, Carousel, Actions) */}
      <DetailMobileHeader
        handleExit={handleExit}
        navigateCarousel={navigateCarousel}
        currentIndex={currentIndex}
        totalWordCount={totalWordCount}
        displayIndex={currentWordIndex}
        vaultListLength={vaultList.length}
        item={item}
        handleOpenEditModal={handleOpenEditModal}
        setItemToDelete={setItemToDelete}
        handleToggleFavorite={handleToggleFavorite}
      />

      {/* Desktop Top Navigation Bar (Back Link, Carousel Navigation, Exit Button) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-[1600px] mx-auto px-6 lg:px-8 pt-4 pb-1 select-none">
        <button
          type="button"
          onClick={handleExit}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs"
          title="Back to Vocabulary Vault (Esc)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Vocabulary Vault</span>
        </button>

        {/* Center: Carousel Navigation */}
        <div className="flex items-center gap-1.5 bg-purple-500/10 dark:bg-purple-500/15 p-1 rounded-xl border border-purple-500/25">
          <button
            type="button"
            onClick={() => navigateCarousel(-1)}
            disabled={currentWordIndex <= 1}
            title="Previous Word (← Arrow key)"
            className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg hover:bg-purple-500/20 text-purple-800 dark:text-purple-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-bold text-purple-900 dark:text-purple-200 px-2 font-mono whitespace-nowrap min-w-[3.5rem] text-center">
            {currentWordIndex}&nbsp;/&nbsp;{totalWordCount}
          </span>

          <button
            type="button"
            onClick={() => navigateCarousel(1)}
            disabled={currentWordIndex >= totalWordCount}
            title="Next Word (→ Arrow key)"
            className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg hover:bg-purple-500/20 text-purple-800 dark:text-purple-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          onClick={handleExit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs"
          title="Exit to Vocabulary Vault (Esc)"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Left Column (Hero Card, Audio, Meaning, Word Family, Mastery) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-5">

          <WordHeroCard
            item={item}
            isPlayingAudio={isPlayingAudio}
            playPronunciation={playPronunciation}
            handleOpenEditModal={handleOpenEditModal}
            setItemToDelete={setItemToDelete}
            handleToggleFavorite={handleToggleFavorite}
            handleSetMastery={handleSetMastery}
          />
        </div>

        {/* Right Column (Collocations, Synonyms/Antonyms, Examples, Notes, Sentences) */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 pb-8">
          {/* AI Enrichment Header Banner */}
          {isLoadingDetails && <AiEnrichmentBanner />}

          {/* Collocations & Common Phrases */}
          <CollocationsCard
            wordData={wordData}
            playPronunciation={playPronunciation}
          />

          {/* Synonyms & Antonyms Grid */}
          <SynonymsAntonymsCard wordData={wordData} />

          {/* Contextual Examples */}
          <ContextualExamplesCard
            exampleSentences={wordData.exampleSentences}
            playPronunciation={playPronunciation}
          />

          {/* Personal Study Notes */}
          <PersonalNotesCard
            notesText={notesText}
            setNotesText={setNotesText}
            isSavingNotes={isSavingNotes}
            notesSavedSuccess={notesSavedSuccess}
            handleSaveNotes={handleSaveNotes}
          />

          {/* My Practice Sentences */}
          <PracticeSentencesCard
            word={wordData.word}
            sentences={item.mySentences}
            newSentence={newSentence}
            setNewSentence={setNewSentence}
            isAddingSentence={isAddingSentence}
            handleAddSentence={handleAddSentence}
            handleDeleteSentence={handleDeleteSentence}
          />
        </div>
      </div>

      {/* Edit Vocabulary Modal */}
      <EditVocabularyModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        isSavingEdit={isSavingEdit}
        handleSaveEdit={handleSaveEdit}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editIsFavorite={editIsFavorite}
        setEditIsFavorite={setEditIsFavorite}
        editSentences={editSentences}
        handleRemoveSentence={handleRemoveSentence}
        editNewSentence={editNewSentence}
        setEditNewSentence={setEditNewSentence}
        handleAddSentenceToEdit={handleAddSentenceToEdit}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        editFeedback={editFeedback}
      />

      {/* Delete Vocabulary Modal */}
      <DeleteVocabularyModal
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        isDeleting={isDeleting}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default VocabularyDetailPage;
