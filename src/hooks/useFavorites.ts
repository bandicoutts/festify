import { useState, useEffect, useCallback } from 'react';

export interface FavoriteArtist {
  artistId: string;
  artistName: string;
  day: string;
  stageName: string;
  timeSlot: string;
}

const STORAGE_KEY = 'festival_favorites';

// Helper to load favorites synchronously
function loadFavoritesFromStorage(): FavoriteArtist[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load favorites:', error);
  }
  return [];
}

export function useFavorites() {
  // Initialize state with localStorage value immediately
  const [favorites, setFavorites] = useState<FavoriteArtist[]>(loadFavoritesFromStorage);
  const [isHydrated, setIsHydrated] = useState(false);

  // Re-sync on mount for hydration
  useEffect(() => {
    const stored = loadFavoritesFromStorage();
    setFavorites(stored);
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = useCallback((artist: FavoriteArtist) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.artistId === artist.artistId);
      if (exists) {
        // Remove from favorites
        return prev.filter((fav) => fav.artistId !== artist.artistId);
      } else {
        // Add to favorites
        return [...prev, artist];
      }
    });
  }, []);

  const isFavorite = useCallback(
    (artistId: string) => {
      return favorites.some((fav) => fav.artistId === artistId);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isHydrated,
  };
}
