import {
  AddVocabularyDto,
  GenerateVocabularyDto,
  MyVocabularyItem,
} from "@/features/vocabulary/types/vocabulary";
import { generateVocabularyApi, normalizeVocabularyItem } from "./vocabulary";
import { getApiBaseUrl } from "@/lib/api";
import { getAuthToken, getLocalVault, saveLocalVault } from "./utilFn";

/**
 * Add Single Vocabulary Word using AI Generation
 */
export async function addSingleVocabulary(
  dto: GenerateVocabularyDto
): Promise<{ success: boolean; message: string; item: MyVocabularyItem }> {
  const cleanWord = (dto.word || "").trim();
  if (!cleanWord) {
    throw new Error("Please enter a vocabulary word.");
  }

  // 1. Call AI generation endpoint
  const wordInfo = await generateVocabularyApi(cleanWord);

  // 2. Try calling backend addToMyVocabulary if authenticated
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  if (token && wordInfo.id) {
    try {
      const saveRes = await fetch(`${baseUrl}/my-vocabularies/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wordId: wordInfo.id,
          notes: dto.notes,
          mySentences: dto.mySentences,
        }),
      });

      if (!saveRes.ok) {
        // Fallback endpoint if route differs
        await fetch(`${baseUrl}/vocabularies/my`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            wordId: wordInfo.id,
            notes: dto.notes,
            mySentences: dto.mySentences,
          }),
        });
      }
    } catch (err) {
      console.warn("Could not save to remote collection:", err);
    }
  }

  // 3. Persist in local vault for instant responsiveness
  const currentVault = getLocalVault();
  const existingIndex = currentVault.findIndex(
    (v) => v.word.word.toLowerCase() === wordInfo.word.toLowerCase()
  );

  const now = new Date().toISOString();
  const newItem: MyVocabularyItem = {
    id: `my-vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    wordId: wordInfo.id,
    userId: "user-current",
    word: wordInfo,
    mySentences: dto.mySentences || [],
    notes: dto.notes || null,
    status: "LEARNING",
    masteryLevel: 1,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    currentVault[existingIndex] = {
      ...currentVault[existingIndex],
      ...newItem,
      id: currentVault[existingIndex].id,
    };
    saveLocalVault(currentVault);
    return {
      success: true,
      message: `Updated '${wordInfo.word}' in your vocabulary vault!`,
      item: currentVault[existingIndex],
    };
  } else {
    currentVault.unshift(newItem);
    saveLocalVault(currentVault);
    return {
      success: true,
      message: `Successfully generated and added '${wordInfo.word}' to your vault!`,
      item: newItem,
    };
  }
}

/**
 * Backward-compatible addVocabularyWithAi
 */
export async function addVocabularyWithAi(dto: AddVocabularyDto) {
  const targetWord = dto.word || (dto.words && dto.words[0]) || "";
  const result = await addSingleVocabulary({
    word: targetWord,
    notes: dto.notes,
    mySentences: dto.mySentences,
  });

  return {
    success: result.success,
    message: result.message,
    data: {
      processed: 1,
      items: [result.item],
    },
  };
}


// /**
//  * Update personal notes, practice sentences, favorite status or mastery
//  * Endpoint: PATCH /api/v1/my-vocabularies/:id/update
//  */
export async function updateMyVocabulary(
  id: string,
  updates: Partial<MyVocabularyItem> & { vocabularyStatus?: string }
): Promise<MyVocabularyItem> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  const payload: Record<string, any> = {};
  if (updates.mySentences !== undefined) payload.mySentences = updates.mySentences;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.masteryLevel !== undefined) {
    payload.masteryLevel = updates.masteryLevel;
  }
  if (updates.status !== undefined || updates.vocabularyStatus !== undefined) {
    payload.vocabularyStatus = updates.vocabularyStatus || updates.status;
  }
  if (updates.isFavourate !== undefined || updates.isFavorite !== undefined) {
    payload.isFavourate = updates.isFavourate ?? updates.isFavorite;
  }

  try {
    // 1. Primary endpoint: PATCH /my-vocabularies/:id/update
    let res = await fetch(`${baseUrl}/my-vocabularies/${id}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Fallback 1: PATCH /my-vocabularies/:id
      res = await fetch(`${baseUrl}/my-vocabularies/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      // Fallback 2: PATCH /vocabularies/my/:id
      res = await fetch(`${baseUrl}/vocabularies/my/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      const data = await res.json();
      if (data?.data) {
        const vault = getLocalVault();
        const idx = vault.findIndex((item) => item.id === id);
        if (idx !== -1) {
          vault[idx] = {
            ...vault[idx],
            ...updates,
            ...data.data,
            updatedAt: new Date().toISOString(),
          };
          saveLocalVault(vault);
        }
        return data.data;
      }
    }
  } catch (err) {
    console.warn("Could not sync remote update:", err);
  }

  const vault = getLocalVault();
  const idx = vault.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Vocabulary item not found.");
  }

  vault[idx] = {
    ...vault[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveLocalVault(vault);
  return vault[idx];
}

/**
 * Delete word from user vault
 * Endpoint: DELETE /api/v1/my-vocabularies/:id/remove
 */
export async function deleteMyVocabulary(id: string): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    // 1. Primary backend endpoint: DELETE /my-vocabularies/:id/remove
    let res = await fetch(`${baseUrl}/my-vocabularies/${id}/remove`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // 2. Fallback to direct DELETE /my-vocabularies/:id if /remove returned 404
    if (!res.ok && res.status === 404) {
      res = await fetch(`${baseUrl}/my-vocabularies/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }

    // 3. Fallback to DELETE /vocabularies/my/:id if route is different
    if (!res.ok && res.status === 404) {
      res = await fetch(`${baseUrl}/vocabularies/my/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }

    if (!res.ok && res.status !== 404) {
      const errData = await res.json().catch(() => null);
      console.warn("Failed to remove vocabulary from vault:", errData?.message || res.statusText);
    }
  } catch (err) {
    console.warn("Network error removing vocabulary from vault:", err);
  }

  // Update local vault cache
  const vault = getLocalVault();
  const updated = vault.filter((item) => item.id !== id && (item as any)._id !== id);
  saveLocalVault(updated);
  return true;
}

/**
 * Fetch full details for a single personal vocabulary word.
 * Enriches collocations, example sentences, word family, synonyms, antonyms, notes, sentences.
 */
export async function fetchMyVocabularyDetails(
  item: MyVocabularyItem
): Promise<MyVocabularyItem> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    // 1. Primary: GET /my-vocabularies/:id (includes full word definition and personal notes/sentences)
    if (token && item.id && !item.id.startsWith("my-vocab-")) {
      const res = await fetch(`${baseUrl}/my-vocabularies/${item.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data && (data.word || data.collocations || data.exampleSentences)) {
          const rawWord = data.word || data;
          const fullWord = normalizeVocabularyItem(rawWord);
          const updatedItem: MyVocabularyItem = {
            ...item,
            ...data,
            id: item.id,
            word: fullWord,
            mySentences: Array.isArray(data.mySentences) ? data.mySentences : item.mySentences,
            notes: data.notes !== undefined ? data.notes : item.notes,
          };

          const vault = getLocalVault();
          const idx = vault.findIndex((v) => v.id === item.id);
          if (idx !== -1) {
            vault[idx] = updatedItem;
            saveLocalVault(vault);
          }
          return updatedItem;
        }
      }
    }

    // 2. Secondary: GET /vocabularies/:wordId
    const wordId = item.wordId || item.word?.id;
    if (token && wordId && !wordId.startsWith("word-")) {
      const res = await fetch(`${baseUrl}/vocabularies/${wordId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const wordData = json.data || json;
        if (wordData && (wordData.word || wordData.meaning)) {
          const fullWord = normalizeVocabularyItem(wordData);
          const updatedItem: MyVocabularyItem = {
            ...item,
            word: fullWord,
          };

          const vault = getLocalVault();
          const idx = vault.findIndex((v) => v.id === item.id);
          if (idx !== -1) {
            vault[idx] = updatedItem;
            saveLocalVault(vault);
          }
          return updatedItem;
        }
      }
    }

    // 3. Fallback: POST /vocabularies/generate for the word text
    const wordText = item.word?.word;
    if (wordText) {
      const fullWord = await generateVocabularyApi(wordText);
      if (fullWord && (fullWord.collocations?.length || fullWord.exampleSentences?.length || fullWord.meaning)) {
        const updatedItem: MyVocabularyItem = {
          ...item,
          word: fullWord,
        };

        const vault = getLocalVault();
        const idx = vault.findIndex((v) => v.id === item.id);
        if (idx !== -1) {
          vault[idx] = updatedItem;
          saveLocalVault(vault);
        }
        return updatedItem;
      }
    }
  } catch (err) {
    console.warn("Could not fetch full vocabulary details:", err);
  }

  return item;
}