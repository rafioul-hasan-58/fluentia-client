import React from "react";

// Helper to underline target vocabulary keywords within story text (pure underline, no background color)
export function renderHighlightedStory(text: string, keywords: string[]) {
  if (!text) return null;
  if (!keywords || keywords.length === 0) {
    return text.split("\n\n").map((para, i) => (
      <p key={i} className="mb-4 last:mb-0 leading-relaxed sm:leading-8">
        {para}
      </p>
    ));
  }

  // Filter and sort keywords by length descending so multi-word or longer keywords match first
  const validKeywords = keywords
    .map((k) => k.replace(/^['"‘’“”]+|['"‘’“”]+$/g, "").trim())
    .filter((k) => k.length > 0)
    .sort((a, b) => b.length - a.length);

  if (validKeywords.length === 0) {
    return text.split("\n\n").map((para, i) => (
      <p key={i} className="mb-4 last:mb-0 leading-relaxed sm:leading-8">
        {para}
      </p>
    ));
  }

  const escaped = validKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // Match keyword with optional surrounding quotes ('word' or "word") and possible inflectional variations
  const regex = new RegExp(`['"‘’“”]?\\b(${escaped.join("|")}(?:s|es|ed|d|ing|ly)?)\\b['"‘’“”]?`, "gi");

  // Split into paragraphs for editorial reading rhythm
  const paragraphs = text.split(/\n+/);

  return paragraphs.map((paragraph, pIdx) => {
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Reset regex index for each paragraph
    regex.lastIndex = 0;

    while ((match = regex.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        parts.push(paragraph.substring(lastIndex, match.index));
      }
      // Extract the clean word without surrounding quotes
      const matchedWord = match[1] || match[0].replace(/^['"‘’“”]+|['"‘’“”]+$/g, "");
      parts.push(
        <span
          key={`match-${pIdx}-${match.index}-${matchedWord}`}
          className="font-bold underline dark:decoration-amber-400 decoration-2 underline-offset-2 transition-colors"
          title={`Target Keyword: ${matchedWord}`}
        >
          {matchedWord}
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < paragraph.length) {
      parts.push(paragraph.substring(lastIndex));
    }

    return (
      <p key={`p-${pIdx}`} className="mb-4 sm:mb-5 last:mb-0 leading-relaxed sm:leading-8 text-slate-800 dark:text-slate-200">
        {parts}
      </p>
    );
  });
}
