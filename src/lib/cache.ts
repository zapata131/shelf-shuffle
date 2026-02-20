import { NormalizedGame } from "./normalizer";

const CACHE_KEY = "shelf_shuffle_game_cache";

/**
 * Loads the game cache from localStorage.
 */
export function loadGameCache(): Record<string, NormalizedGame> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Failed to load game cache:", e);
    return {};
  }
}

/**
 * Saves a list of normalized games to the cache.
 */
export function saveToGameCache(games: NormalizedGame[]) {
  if (typeof window === "undefined") return;
  try {
    const currentCache = loadGameCache();
    const updatedCache = { ...currentCache };
    
    games.forEach((game) => {
      updatedCache[game.id] = game;
    });
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
  } catch (e) {
    console.error("Failed to save to game cache:", e);
  }
}

/**
 * Clears the entire game cache from localStorage.
 */
export function clearGameCache() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CACHE_KEY);
}
