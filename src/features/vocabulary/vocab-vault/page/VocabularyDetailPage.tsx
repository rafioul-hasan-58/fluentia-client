"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
    totalCount,
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
  } = useVocabularyDetail(word);

  if (isLoading) {
    return <DetailLoadingSkeleton />;
  }

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
        totalCount={totalCount}
        displayIndex={displayIndex}
        vaultListLength={vaultList.length}
        item={item}
        handleOpenEditModal={handleOpenEditModal}
        setItemToDelete={setItemToDelete}
        handleToggleFavorite={handleToggleFavorite}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Left Column (Hero Card, Audio, Meaning, Word Family, Mastery) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-5">
          {/* Desktop Back Link */}
          {/* <div className="hidden lg:flex items-center justify-between pb-1">
            <Link
              href="/dashboard/user/vocabulary"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Vocabulary Vault</span>
            </Link>
          </div> */}

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
