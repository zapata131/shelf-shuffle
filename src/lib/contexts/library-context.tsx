"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BGGCollectionItem } from "@/lib/bgg";
import { NormalizedGame } from "@/lib/normalizer";
import { loadGameCache, saveToGameCache } from "@/lib/cache";
import { useToast } from "./toast-context";

interface LibraryContextType {
  collection: BGGCollectionItem[];
  loading: boolean;
  selectedGame: NormalizedGame | null;
  loadingDetails: boolean;
  fetchCollection: (username?: string) => Promise<void>;
  loadGameDetails: (id: string) => Promise<NormalizedGame | null>;
  setSelectedGame: (game: NormalizedGame | null) => void;
  filteredCollection: (search: string) => BGGCollectionItem[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const [collection, setCollection] = useState<BGGCollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<NormalizedGame | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchCollection = async (username?: string) => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bgg/collection/${username}`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCollection(data);
        if (data.length > 0 && !selectedGame) {
          loadGameDetails(data[0].id);
        }
      } else {
        toast.error(data.error || "Failed to fetch collection");
      }
    } catch (e) {
      console.error("Collection fetch error:", e);
      toast.error("Network error while fetching collection");
    } finally {
      setLoading(false);
    }
  };

  const loadGameDetails = async (id: string): Promise<NormalizedGame | null> => {
    const cache = loadGameCache();
    if (cache[id]) {
      setSelectedGame(cache[id]);
      return cache[id];
    }

    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/bgg/game/${id}`);
      const data = await res.json();
      if (res.ok) {
        setSelectedGame(data);
        saveToGameCache([data]);
        return data;
      } else {
        toast.error(data.error || "Failed to fetch game details");
        return null;
      }
    } catch (e) {
      console.error("Game details fetch error:", e);
      toast.error("Network error while fetching game details");
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredCollection = (search: string) => {
    return collection.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        collection,
        loading,
        selectedGame,
        loadingDetails,
        fetchCollection,
        loadGameDetails,
        setSelectedGame,
        filteredCollection,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
