import { useState, useEffect, useCallback } from 'react';
import { SpotifyAPI } from '@/lib/spotify/api';
import { getAccessToken } from '@/lib/spotify/auth';
import { generateFestival } from '@/lib/festival/lineup-generator';
import { Festival } from '@/lib/types';
import { SPOTIFY_API } from '@/lib/constants';
import { logger } from '@/lib/utils/logger';
import { Cache } from '@/lib/utils/cache';

interface UseFestivalDataResult {
  festival: Festival | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'festival_data';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export function useFestivalData(): UseFestivalDataResult {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedFestival = Cache.get<Festival>(CACHE_KEY);
      if (cachedFestival) {
        logger.log('✅ Loaded festival from cache');
        setFestival(cachedFestival);
        setLoading(false);
        return;
      }

      logger.log('🎵 Starting festival data fetch...');
      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      logger.log('✅ Token found, creating Spotify API client...');
      const api = new SpotifyAPI(token);

      logger.log('📊 Fetching Spotify data...');
      // Fetch all required data in parallel
      const [topArtistsShort, topArtistsMedium, topArtistsLong, recentlyPlayed] =
        await Promise.all([
          api.getTopArtists('short_term', SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
          api.getTopArtists('medium_term', SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
          api.getTopArtists('long_term', SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
          api.getRecentlyPlayed(SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
        ]);

      logger.log('✅ Data fetched:', {
        short: topArtistsShort.length,
        medium: topArtistsMedium.length,
        long: topArtistsLong.length,
        recent: recentlyPlayed.length
      });

      // Count unique artists across all sources
      const uniqueArtistIds = new Set([
        ...topArtistsShort.map(a => a.id),
        ...topArtistsMedium.map(a => a.id),
        ...topArtistsLong.map(a => a.id)
      ]);
      logger.log('🎤 Total unique artists available:', uniqueArtistIds.size);

      // Check if user has enough data
      if (topArtistsShort.length === 0 && topArtistsMedium.length === 0) {
        throw new Error(
          'Not enough listening history. Listen to more music on Spotify and try again!'
        );
      }

      logger.log('🎪 Generating festival...');
      // Generate festival
      const generatedFestival = generateFestival(
        topArtistsShort,
        topArtistsMedium,
        topArtistsLong,
        recentlyPlayed
      );

      logger.log('✅ Festival generated!', generatedFestival.name);

      // Cache the generated festival
      Cache.set(CACHE_KEY, generatedFestival, CACHE_TTL);

      setFestival(generatedFestival);
      setLoading(false);
    } catch (err) {
      logger.error('❌ Error fetching festival data:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate festival');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { festival, loading, error, refetch: fetchData };
}