"use client";

import React, { createContext, useContext, useState } from "react";
import { NormalizedGame } from "@/lib/normalizer";
import { useLibrary } from "./library-context";
import { useToast } from "./toast-context";
import { loadGameCache, saveToGameCache } from "@/lib/cache";
import { BGGCollectionItem } from "@/lib/bgg";

interface PrintContextType {
  printQueue: NormalizedGame[];
  bulkLoading: boolean;
  toggleQueueItem: (e: React.MouseEvent | null, item: BGGCollectionItem) => Promise<void>;
  addToQueue: (game: NormalizedGame | null) => void;
  removeFromQueue: (game: NormalizedGame | null) => void;
  addAllToQueue: (filteredItems: BGGCollectionItem[]) => Promise<void>;
  clearQueue: () => void;
  setPrintQueue: React.Dispatch<React.SetStateAction<NormalizedGame[]>>;
}

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export function PrintProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const { loadGameDetails } = useLibrary();
  const [printQueue, setPrintQueue] = useState<NormalizedGame[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const toggleQueueItem = async (e: React.MouseEvent | null, item: BGGCollectionItem) => {
    if (e) e.stopPropagation();
    const existing = printQueue.find(g => g.id === item.id);
    if (existing) {
      setPrintQueue(prev => prev.filter(g => g.id !== item.id));
    } else {
      const details = await loadGameDetails(item.id);
      if (details) {
        setPrintQueue(prev => [...prev, details]);
      }
    }
  };

  const addToQueue = (game: NormalizedGame | null) => {
    if (game && !printQueue.find(g => g.id === game.id)) {
      setPrintQueue(prev => [...prev, game]);
    }
  };

  const removeFromQueue = (game: NormalizedGame | null) => {
    if (game) {
      setPrintQueue(prev => prev.filter(g => g.id !== game.id));
    }
  };

  const addAllToQueue = async (filteredItems: BGGCollectionItem[]) => {
    if (filteredItems.length === 0) return;
    setBulkLoading(true);
    const promise = async () => {
      try {
        const cache = loadGameCache();
        const allToFetchIds: string[] = [];
        const cachedItems: NormalizedGame[] = [];

        filteredItems.forEach(item => {
          if (cache[item.id]) {
            cachedItems.push(cache[item.id]);
          } else {
            allToFetchIds.push(item.id);
          }
        });

        const fetchedItems: NormalizedGame[] = [];
        const batchSize = 20;

        for (let i = 0; i < allToFetchIds.length; i += batchSize) {
          const batch = allToFetchIds.slice(i, i + batchSize);
          const ids = batch.join(",");
          const res = await fetch(`/api/bgg/game/${ids}`);
          const data = await res.json();

          if (Array.isArray(data)) {
            fetchedItems.push(...data);
          } else {
            fetchedItems.push(data);
          }
        }

        if (fetchedItems.length > 0) {
          saveToGameCache(fetchedItems);
        }

        const allNormalized = [...cachedItems, ...fetchedItems];

        setPrintQueue(prev => {
          const existingIds = new Set(prev.map(g => g.id));
          const newItems = allNormalized.filter(g => !existingIds.has(g.id));
          return [...prev, ...newItems];
        });
        return `Added ${allNormalized.length} items to queue`;
      } catch (e) {
        console.error("Bulk add error:", e);
        throw e;
      }
    };

    toast.promise(promise(), {
      loading: 'Fetching game details...',
      success: (data: string) => data,
      error: 'Failed to add all items to queue',
    }).finally(() => {
      setBulkLoading(false);
    });
  };

  const clearQueue = () => setPrintQueue([]);

  return (
    <PrintContext.Provider
      value={{
        printQueue,
        bulkLoading,
        toggleQueueItem,
        addToQueue,
        removeFromQueue,
        addAllToQueue,
        clearQueue,
        setPrintQueue,
      }}
    >
      {children}
    </PrintContext.Provider>
  );
}

export function usePrint() {
  const context = useContext(PrintContext);
  if (context === undefined) {
    throw new Error("usePrint must be used within a PrintProvider");
  }
  return context;
}
