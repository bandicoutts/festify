import { useState, useEffect } from 'react';
import { SpotifyAPI } from '@/lib/spotify/api';
import { getAccessToken } from '@/lib/spotify/auth';
import { generateFestival } from '@/lib/festival/lineup-generator';
import { Festival } from '@/lib/types';
import { SPOTIFY_API } from '@/lib/constants';

interface UseFestivalDataResult {
  festival: Festival | null;
  loading: boolean;
  error: string | null;
}

export function useFestivalData(): UseFestivalDataResult {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🎵 Starting festival data fetch...');
        const token = getAccessToken();
        if (!token) {
          throw new Error('No access token found');
        }

        console.log('✅ Token found, creating Spotify API client...');
        const api = new SpotifyAPI(token);

        console.log('📊 Fetching Spotify data...');
        // Fetch all required data in parallel
        const [topArtistsShort, topArtistsMedium, topArtistsLong, recentlyPlayed] =
          await Promise.all([
            api.getTopArtists('short_term', SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
            api.getTopArtists('medium_term', SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
            api.getTopArtists('long_term', SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
            api.getRecentlyPlayed(SPOTIFY_API.MAX_ITEMS_PER_REQUEST),
          ]);

        console.log('✅ Data fetched:', {
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
        console.log('🎤 Total unique artists available:', uniqueArtistIds.size);

        // Check if user has enough data
        if (topArtistsShort.length === 0 && topArtistsMedium.length === 0) {
          throw new Error(
            'Not enough listening history. Listen to more music on Spotify and try again!'
          );
        }

        console.log('🎪 Generating festival...');
        // Generate festival
        const generatedFestival = generateFestival(
          topArtistsShort,
          topArtistsMedium,
          topArtistsLong,
          recentlyPlayed
        );

        console.log('✅ Festival generated!', generatedFestival.name);
        setFestival(generatedFestival);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching festival data:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate festival');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { festival, loading, error };
}