import { MyVocabularyItem } from "@/features/vocabulary/types/vocabulary";
import { Sparkles } from "lucide-react";

interface VocabularyStoryBannerProps {
    isStorySelectMode: boolean;
    selectedStoryItems: MyVocabularyItem[];
    setIsStorySelectMode: (mode: boolean) => void;
    setSelectedStoryItems: (items: MyVocabularyItem[]) => void;
}

const VocabularyStoryBanner = ({
    isStorySelectMode,
    selectedStoryItems,
    setIsStorySelectMode,
    setSelectedStoryItems,
}: VocabularyStoryBannerProps) => {
    return (
        <div>
            {isStorySelectMode && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                                <span>AI Story Selection Mode</span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-extrabold">
                                    {selectedStoryItems.length} selected
                                </span>
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Click the square radio button on the top-left of any card to choose words (5–10 recommended). Then click &quot;Create Story&quot; at the bottom right.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {selectedStoryItems.length > 0 && (
                            <button
                                onClick={() => setSelectedStoryItems([])}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setIsStorySelectMode(false);
                                setSelectedStoryItems([]);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                        >
                            Exit Story Mode
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VocabularyStoryBanner;