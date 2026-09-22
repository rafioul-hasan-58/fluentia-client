"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MyVocabularyItem,
  PartOfSpeech,
} from "@/features/vocabulary/types/vocabulary";
import {
  fetchMyVocabularyDetails,
  addSingleVocabulary,
  updateMyVocabulary,
  generateVocabStoryApi,
} from "@/features/vocabulary/api";
import { useVocabularies, useLegacyCalendarCounts } from "../hooks";
import {
  BookOpen,
  Plus,
  RefreshCw,
} from "lucide-react";
import VocabularyHeader from "./VocabularyHeader";
import VocabularyFilterBar from "./VocabularyFilterBar";
import VocabularyStoryBanner from "./VocabularyStoryBanner";
import VocabularyPagination from "./VocabularyPagination";
import VocabularyCard from "./VocabularyCard";
import VocabularyTableView from "./VocabularyTableView";
import VocabularyFullscreenModal from "./modals/VocabularyFullscreenModal";
import AddVocabularyModal from "./modals/AddVocabularyModal";
import EditVocabularyModal from "./modals/EditVocabularyModal";
import DeleteVocabularyModal from "./modals/DeleteVocabularyModal";
import StoryContextModal from "./modals/StoryContextModal";


const VocabularyPage = () => {
  const {
    vocabularies,
    meta,
    stats,
    isLoading,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filters,
    setters,
    loadVocabularies,
    handleToggleFavorite,
    handleSetStatus,
    handleSetMastery,
    handleAddSentence,
    handleSaveNotes,
    handleConfirmDelete,
    itemToDelete,
    setItemToDelete,
    isDeleting,
    editingNotes,
    setEditingNotes,
    savingNoteId,
    newSentenceInputs,
    setNewSentenceInputs,
  } = useVocabularies();

  const { calendarWordCounts, reloadCalendarCounts } = useLegacyCalendarCounts();

  const {
    searchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
  } = filters;

  const {
    setSearchQuery,
    setSelectedPos,
    setSelectedStatus,
    setSelectedLevel,
    setSelectedSort,
    setFavoritesOnly,
    setTodayOnly,
    setSelectedDate,
    setVocabularies,
  } = setters;

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Fullscreen Single Vocab View State
  const [fullscreenVocabId, setFullscreenVocabId] = useState<string | null>(null);

  // Modal State (Single Word Focused)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputWordText, setInputWordText] = useState<string>("");
  const [userNote, setUserNote] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);


  // Update/Edit Modal State
  const [editingItem, setEditingItem] = useState<MyVocabularyItem | null>(null);

  const router = useRouter();

  // Story Creation Mode State
  const [isStorySelectMode, setIsStorySelectMode] = useState<boolean>(false);
  const [selectedStoryItems, setSelectedStoryItems] = useState<MyVocabularyItem[]>([]);
  const [isStoryContextModalOpen, setIsStoryContextModalOpen] = useState<boolean>(false);
  const [storyContext, setStoryContext] = useState<string>("");
  const [isCreatingStory, setIsCreatingStory] = useState<boolean>(false);
  const [storyCreationError, setStoryCreationError] = useState<string | null>(null);

  // Check URL query parameters for mode=create-story on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "create-story") {
        setIsStorySelectMode(true);
      }
    }
  }, []);

  const handleToggleStoryWord = (item: MyVocabularyItem) => {
    setSelectedStoryItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      }
      if (prev.length >= 15) {
        alert("You can select up to 10 vocabulary words for a story.");
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleExecuteStoryGeneration = async () => {
    if (selectedStoryItems.length === 0) {
      setStoryCreationError("Please select at least 1 vocabulary word (recommended 10 to 15.");
      return;
    }
    setIsCreatingStory(true);
    setStoryCreationError(null);
    try {
      const vocabularyIds = selectedStoryItems.map(
        (item) => item.word?.id || item.wordId || item.id
      );
      await generateVocabStoryApi({
        vocabularyIds,
        context: storyContext.trim() || undefined,
      });
      setIsStoryContextModalOpen(false);
      setSelectedStoryItems([]);
      setIsStorySelectMode(false);
      router.push("/dashboard/user/vocabulary/stories");
    } catch (err: any) {
      setStoryCreationError(err.message || "Failed to generate vocabulary story. Please try again.");
    } finally {
      setIsCreatingStory(false);
    }
  };
  const [editNotes, setEditNotes] = useState<string>("");
  const [editSentences, setEditSentences] = useState<string[]>([]);
  const [editNewSentence, setEditNewSentence] = useState<string>("");
  const [editMastery, setEditMastery] = useState<number>(60);
  const [editStatus, setEditStatus] = useState<string>("LEARNED");
  const [editIsFavorite, setEditIsFavorite] = useState<boolean>(false);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [editFeedback, setEditFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Fullscreen Scroll Lock & Keyboard Navigation
  useEffect(() => {
    if (fullscreenVocabId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenVocabId) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (e.key === "Escape") {
          target.blur();
        }
        return;
      }

      if (e.key === "Escape") {
        setFullscreenVocabId(null);
      } else if (e.key === "ArrowLeft") {
        navigateFullscreen(-1);
      } else if (e.key === "ArrowRight") {
        navigateFullscreen(1);
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        const currentItem = vocabularies.find((v) => v.id === fullscreenVocabId);
        if (currentItem) {
          playPronunciation(currentItem.word.word);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenVocabId, vocabularies]);

  const [isLoadingFullscreenDetails, setIsLoadingFullscreenDetails] = useState(false);

  // Auto-enrich details when viewing in fullscreen if collocations/sentences are missing
  useEffect(() => {
    if (!fullscreenVocabId) return;
    const currentItem = vocabularies.find((v) => v.id === fullscreenVocabId);
    if (!currentItem) return;

    const hasCollocations =
      currentItem.word?.collocations && currentItem.word.collocations.length > 0;
    const hasExamples =
      currentItem.word?.exampleSentences && currentItem.word.exampleSentences.length > 0;
    const hasSynonyms =
      currentItem.word?.synonyms && currentItem.word.synonyms.length > 0;

    // If details are sparse, fetch complete details from backend
    if (!hasCollocations || !hasExamples || !hasSynonyms) {
      setIsLoadingFullscreenDetails(true);
      fetchMyVocabularyDetails(currentItem)
        .then((enriched) => {
          if (enriched && enriched !== currentItem) {
            setVocabularies((prev) =>
              prev.map((v) => (v.id === enriched.id ? enriched : v))
            );
          }
        })
        .finally(() => {
          setIsLoadingFullscreenDetails(false);
        });
    }
  }, [fullscreenVocabId]);



  // Voice caching state for speech synthesis
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Preload and register SpeechSynthesis voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  /**
   * Helper to retrieve the best high-quality female English voice available on device
   */
  const getFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voiceList = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    if (!voiceList || voiceList.length === 0) return null;

    // Prioritized list of known high-quality female voice identifiers across Chrome, Edge, Safari, iOS, macOS, and Windows
    const preferredFemalePatterns = [
      "microsoft jenny online (natural)",
      "microsoft aria online (natural)",
      "microsoft ava online (natural)",
      "microsoft emma online (natural)",
      "microsoft zira",
      "google us english",
      "google uk english female",
      "samantha",
      "victoria",
      "karen",
      "moira",
      "fiona",
      "serena",
      "tessa",
      "allison",
      "ava",
      "nora",
      "susan",
      "female",
    ];

    // 1. Search for preferred natural female voices in English
    for (const pattern of preferredFemalePatterns) {
      const match = voiceList.find((v) => {
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase();
        return langLower.startsWith("en") && nameLower.includes(pattern);
      });
      if (match) return match;
    }

    // 2. Search for any English voice explicitly tagged or named 'female' or 'woman'
    const anyFemaleEnglish = voiceList.find((v) => {
      const nameLower = v.name.toLowerCase();
      const langLower = v.lang.toLowerCase();
      return (
        langLower.startsWith("en") &&
        (nameLower.includes("female") || nameLower.includes("woman") || nameLower.includes("girl"))
      );
    });
    if (anyFemaleEnglish) return anyFemaleEnglish;

    // 3. Fallback to standard US/UK English voices
    const fallbackEn = voiceList.find(
      (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en")
    );
    return fallbackEn || voiceList[0] || null;
  };

  // Pronounce word using Web Speech API with female voice
  const playPronunciation = (word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.88; // clear natural pace
    utterance.pitch = 1.08; // clear female pitch

    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    setPlayingWord(word);
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    window.speechSynthesis.speak(utterance);
  };




  // Fullscreen Navigation (Prev / Next)
  const navigateFullscreen = (direction: -1 | 1) => {
    if (!fullscreenVocabId || vocabularies.length === 0) return;
    const currentIndex = vocabularies.findIndex((v) => v.id === fullscreenVocabId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = vocabularies.length - 1;
    if (nextIndex >= vocabularies.length) nextIndex = 0;

    setFullscreenVocabId(vocabularies[nextIndex].id);
  };

  // Execute Single Word AI generation & addition
  const handleExecuteAddSingleWord = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const targetWord = inputWordText.trim();
    if (!targetWord) {
      setFeedbackMessage({
        type: "error",
        text: "Please enter a vocabulary word to generate with AI.",
      });
      return;
    }

    setIsGenerating(true);
    setFeedbackMessage(null);

    try {
      const response = await addSingleVocabulary({
        word: targetWord,
        notes: userNote.trim() || undefined,
      });

      setFeedbackMessage({
        type: "success",
        text: response.message || `Successfully generated '${response.item.word.word}' with AI!`,
      });

      // Reload list & calendar counts
      await loadVocabularies();
      reloadCalendarCounts();

      // Reset modal inputs after brief delay
      setTimeout(() => {
        setInputWordText("");
        setUserNote("");
        setIsModalOpen(false);
        setIsGenerating(false);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      setIsGenerating(false);
      setFeedbackMessage({
        type: "error",
        text: err.message || "Failed to generate vocabulary with AI. Please try again.",
      });
    }
  };

  // Open Update Modal
  const handleOpenEditModal = (item: MyVocabularyItem) => {
    setEditingItem(item);
    setEditNotes(item.notes || "");
    setEditSentences(item.mySentences ? [...item.mySentences] : []);
    setEditNewSentence("");
    setEditMastery(
      item.masteryLevel !== undefined
        ? item.masteryLevel > 5
          ? item.masteryLevel
          : item.masteryLevel * 20
        : 60
    );
    setEditStatus(item.vocabularyStatus || "LEARNING");
    setEditIsFavorite(item.isFavorite || false);
    setEditFeedback(null);
  };

  // Remove sentence from edit modal list
  const handleRemoveSentence = (index: number) => {
    setEditSentences((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add new sentence in edit modal list
  const handleAddSentenceToEdit = () => {
    const s = editNewSentence.trim();
    if (!s) return;
    setEditSentences((prev) => [...prev, s]);
    setEditNewSentence("");
  };

  // Save changes from Update Modal (calls PATCH /api/v1/my-vocabularies/:id/update)
  const handleSaveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingItem) return;

    setIsSavingEdit(true);
    setEditFeedback(null);

    let finalSentences = [...editSentences];
    if (editNewSentence.trim()) {
      finalSentences.push(editNewSentence.trim());
    }

    try {
      await updateMyVocabulary(editingItem.id, {
        notes: editNotes.trim() || null,
        mySentences: finalSentences,
        masteryLevel: editMastery,
        vocabularyStatus: editStatus,
        isFavorite: editIsFavorite,
      });

      setVocabularies((prev) =>
        prev.map((v) =>
          v.id === editingItem.id
            ? {
              ...v,
              notes: editNotes.trim() || null,
              mySentences: finalSentences,
              masteryLevel: Math.round(editMastery / 20) || 1,
              vocabularyStatus: editStatus as any,
              isFavorite: editIsFavorite,
            }
            : v
        )
      );

      setEditFeedback({
        type: "success",
        text: `Updated '${editingItem.word.word}' successfully!`,
      });

      setTimeout(() => {
        setIsSavingEdit(false);
        setEditingItem(null);
        setEditFeedback(null);
      }, 700);
    } catch (err: any) {
      setIsSavingEdit(false);
      setEditFeedback({
        type: "error",
        text: err.message || "Failed to update vocabulary. Please try again.",
      });
    }
  };

  // Metrics computation mapped from server-side stats endpoint
  const headerStats = useMemo(() => {
    return {
      total: stats?.totalWords ?? meta?.total ?? vocabularies.length,
      favorites: stats?.favoriteCount ?? 0,
      todayCount: stats?.todaysVocab ?? 0,
      masteredCount: stats?.masteredCount ?? 0,
    };
  }, [stats, meta, vocabularies.length]);

  const filterBarStats = useMemo(() => {
    return {
      total: stats?.totalWords ?? meta?.total ?? vocabularies.length,
      todayCount: stats?.todaysVocab ?? 0,
      posCounts: (stats?.partOfSpeeches as any) ?? {},
    };
  }, [stats, meta, vocabularies.length]);

  // Active fullscreen vocabulary object & index
  const activeFullscreenVocab = useMemo(() => {
    if (!fullscreenVocabId) return null;
    return vocabularies.find((v) => v.id === fullscreenVocabId) || null;
  }, [fullscreenVocabId, vocabularies]);

  const activeFullscreenIndex = useMemo(() => {
    if (!fullscreenVocabId) return -1;
    return vocabularies.findIndex((v) => v.id === fullscreenVocabId);
  }, [fullscreenVocabId, vocabularies]);

  // Pagination calculations straight from server-side meta
  const totalCount = meta?.total ?? vocabularies.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize));

  // Keep currentPage valid when totalPages changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord =
    totalCount === 0 ? 0 : Math.min(startRecord + vocabularies.length - 1, totalCount);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Action */}
      <VocabularyHeader
        stats={headerStats}
        todayOnly={todayOnly}
        setTodayOnly={setTodayOnly}
        setSelectedDate={setSelectedDate}
        setIsModalOpen={setIsModalOpen}
      />

      {/* 2. Search, Filter & Controls */}
      <VocabularyFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPos={selectedPos}
        setSelectedPos={setSelectedPos}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        favoritesOnly={favoritesOnly}
        setFavoritesOnly={setFavoritesOnly}
        todayOnly={todayOnly}
        setTodayOnly={setTodayOnly}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        calendarWordCounts={calendarWordCounts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        loadVocabularies={loadVocabularies}
        isLoading={isLoading}
        isStorySelectMode={isStorySelectMode}
        setIsStorySelectMode={setIsStorySelectMode}
        selectedStoryItems={selectedStoryItems}
        setSelectedStoryItems={setSelectedStoryItems}
        stats={filterBarStats}
        totalFoundCount={totalCount}
      />

      {/* Story Selection Mode Banner */}
      <VocabularyStoryBanner
        isStorySelectMode={isStorySelectMode}
        selectedStoryItems={selectedStoryItems}
        setIsStorySelectMode={setIsStorySelectMode}
        setSelectedStoryItems={setSelectedStoryItems}
      />

      {/* 3. Vocabulary Cards Section */}
      <div className="space-y-4">
        {/* TOP PAGINATION BAR */}
        <VocabularyPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          startRecord={startRecord}
          endRecord={endRecord}
          pageSize={pageSize}
          setPageSize={setPageSize}
          isLoading={isLoading}
          isTopPosition={true}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : vocabularies.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                No Vocabulary Found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                {selectedDate
                  ? `No vocabulary words found for ${new Date(
                    selectedDate + "T00:00:00"
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}. Try selecting another date with activity dots or reset filters.`
                  : searchQuery ||
                    selectedPos !== "ALL" ||
                    selectedStatus !== "ALL" ||
                    selectedLevel !== "ALL" ||
                    favoritesOnly ||
                    todayOnly
                    ? "No words matched your current search or filter criteria. Try resetting filters."
                    : "You haven't added any words to your vault yet. Add a word to generate with AI!"}
              </p>
            </div>
            <button
              onClick={() => {
                if (
                  selectedDate ||
                  searchQuery ||
                  selectedPos !== "ALL" ||
                  selectedStatus !== "ALL" ||
                  selectedLevel !== "ALL" ||
                  favoritesOnly ||
                  todayOnly
                ) {
                  setSearchQuery("");
                  setSelectedPos("ALL");
                  setSelectedStatus("ALL");
                  setSelectedLevel("ALL");
                  setFavoritesOnly(false);
                  setTodayOnly(false);
                  setSelectedDate(null);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition-colors cursor-pointer"
            >
              {selectedDate ||
                searchQuery ||
                selectedPos !== "ALL" ||
                selectedStatus !== "ALL" ||
                selectedLevel !== "ALL" ||
                favoritesOnly ||
                todayOnly ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Reset Filters
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Your First Word
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {vocabularies.map((item) => (
                  <VocabularyCard
                    key={item.id}
                    item={item}
                    isStorySelectMode={isStorySelectMode}
                    isSelectedForStory={selectedStoryItems.some((s) => s.id === item.id)}
                    handleToggleStoryWord={handleToggleStoryWord}
                    playingWord={playingWord}
                    playPronunciation={playPronunciation}
                    handleToggleFavorite={handleToggleFavorite}
                    handleOpenEditModal={handleOpenEditModal}
                    setItemToDelete={setItemToDelete}
                    handleSetMastery={handleSetMastery}
                    setFullscreenVocabId={setFullscreenVocabId}
                  />
                ))}
              </div>
            ) : (
              <VocabularyTableView
                items={vocabularies}
                isStorySelectMode={isStorySelectMode}
                selectedStoryItems={selectedStoryItems}
                handleToggleStoryWord={handleToggleStoryWord}
                playingWord={playingWord}
                playPronunciation={playPronunciation}
                handleToggleFavorite={handleToggleFavorite}
                handleOpenEditModal={handleOpenEditModal}
                setItemToDelete={setItemToDelete}
                handleSetMastery={handleSetMastery}
                setFullscreenVocabId={setFullscreenVocabId}
              />
            )}

            <VocabularyPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              startRecord={startRecord}
              endRecord={endRecord}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isLoading}
              isTopPosition={false}
            />
          </>
        )
        }
      </div >

      {/* 4. Fullscreen Single Vocabulary Portal View */}
      <VocabularyFullscreenModal
        isMounted={isMounted}
        activeFullscreenVocab={activeFullscreenVocab}
        activeFullscreenIndex={activeFullscreenIndex}
        vocabularies={vocabularies}
        setFullscreenVocabId={setFullscreenVocabId}
        navigateFullscreen={navigateFullscreen}
        handleSetStatus={handleSetStatus}
        handleOpenEditModal={handleOpenEditModal}
        handleToggleFavorite={handleToggleFavorite}
        playPronunciation={playPronunciation}
        playingWord={playingWord}
        handleSetMastery={handleSetMastery}
        newSentenceInputs={newSentenceInputs}
        setNewSentenceInputs={setNewSentenceInputs}
        handleAddSentence={handleAddSentence}
        editingNotes={editingNotes}
        setEditingNotes={setEditingNotes}
        handleSaveNotes={handleSaveNotes}
        savingNoteId={savingNoteId}
        setItemToDelete={setItemToDelete}
        isLoadingDetails={isLoadingFullscreenDetails}
      />

      {/* 5. Add Vocabulary Modal */}
      <AddVocabularyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleExecuteAddSingleWord={handleExecuteAddSingleWord}
        inputWordText={inputWordText}
        setInputWordText={setInputWordText}
        userNote={userNote}
        setUserNote={setUserNote}
        isGenerating={isGenerating}
        feedbackMessage={feedbackMessage}
      />

      {/* 6. Update / Edit Vocabulary Modal */}
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

      {/* 7. Sweet Custom Delete Confirmation Modal */}
      <DeleteVocabularyModal
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        isDeleting={isDeleting}
        handleConfirmDelete={() => {
          handleConfirmDelete((id) => {
            if (fullscreenVocabId === id) {
              setFullscreenVocabId(null);
            }
          });
        }}
      />

      {/* 8 & 9. Floating Create Story Button & Story Context Modal */}
      <StoryContextModal
        isStorySelectMode={isStorySelectMode}
        selectedStoryItems={selectedStoryItems}
        isStoryContextModalOpen={isStoryContextModalOpen}
        setIsStoryContextModalOpen={setIsStoryContextModalOpen}
        storyContext={storyContext}
        setStoryContext={setStoryContext}
        isCreatingStory={isCreatingStory}
        storyCreationError={storyCreationError}
        setStoryCreationError={setStoryCreationError}
        handleToggleStoryWord={handleToggleStoryWord}
        handleExecuteStoryGeneration={handleExecuteStoryGeneration}
      />
    </div >
  );
}

export default VocabularyPage;