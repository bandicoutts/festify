import { SpotifyArtist, SpotifyTrack, RecentlyPlayedTrack } from '../spotify/api';
import { Festival, FestivalDay } from '../types';
import { generateFestivalName, generateFestivalDates, generateFestivalLocation } from './name-generator';

/**
 * Generates a personalized festival from Spotify listening data
 */
export function generateFestival(
  topArtistsShort: SpotifyArtist[],
  topArtistsMedium: SpotifyArtist[],
  topArtistsLong: SpotifyArtist[],
  recentlyPlayed: RecentlyPlayedTrack[]
): Festival {
  // Combine all artists and remove duplicates, maintaining order preference
  const allArtistsMap = new Map<string, SpotifyArtist>();
  
  // Priority order: short -> medium -> long (most recent listening first)
  [...topArtistsShort, ...topArtistsMedium, ...topArtistsLong].forEach(artist => {
    if (!allArtistsMap.has(artist.id)) {
      allArtistsMap.set(artist.id, artist);
    }
  });
  
  const allUniqueArtists = Array.from(allArtistsMap.values());
  
  console.log(`Total unique artists available: ${allUniqueArtists.length}`);
  
  // If we don't have enough artists, we need at least 3 for headliners + some for stages
  if (allUniqueArtists.length < 10) {
    throw new Error('Not enough artists in your listening history. Please listen to more music on Spotify!');
  }
  
  // Sort all artists by popularity to get the true top 3 headliners
  const sortedByPopularity = [...allUniqueArtists].sort((a, b) => b.popularity - a.popularity);
  
  // Extract all unique genres
  const allGenres = extractTopGenres(allUniqueArtists);

  // Generate festival metadata
  const festivalName = generateFestivalName(allGenres);
  const festivalDates = generateFestivalDates();
  const festivalLocation = generateFestivalLocation(allGenres);

  // Get the top 3 headliners (one for each day)
  const headliners = sortedByPopularity.slice(0, 3);

  // Track which artists have been assigned
  const usedArtistIds = new Set<string>();
  
  // Mark headliners as used
  headliners.forEach(h => usedArtistIds.add(h.id));

  // Generate three days with unique artists and one headliner each
  const days: FestivalDay[] = [
    generateFriday(topArtistsShort, usedArtistIds, allUniqueArtists, headliners[0]),
    generateSaturday(topArtistsMedium, recentlyPlayed, usedArtistIds, allUniqueArtists, headliners[1]),
    generateSunday(topArtistsLong, usedArtistIds, allUniqueArtists, headliners[2]),
  ];

  console.log(`Festival generated with ${usedArtistIds.size} total artists`);

  return {
    name: festivalName,
    dates: festivalDates,
    location: festivalLocation,
    days,
    headliners,
    totalArtists: usedArtistIds.size,
  };
}

/**
 * Helper function to get unique artists that haven't been used yet
 * Falls back to a larger pool if primary source is exhausted
 */
function getUniqueArtists(
  primaryArtists: SpotifyArtist[],
  usedIds: Set<string>,
  fallbackPool: SpotifyArtist[],
  count: number
): SpotifyArtist[] {
  const unique: SpotifyArtist[] = [];
  
  // First try to get from primary source
  for (const artist of primaryArtists) {
    if (!usedIds.has(artist.id)) {
      unique.push(artist);
      usedIds.add(artist.id);
      
      if (unique.length >= count) return unique;
    }
  }
  
  // If we still need more, use fallback pool
  if (unique.length < count) {
    for (const artist of fallbackPool) {
      if (!usedIds.has(artist.id)) {
        unique.push(artist);
        usedIds.add(artist.id);
        
        if (unique.length >= count) return unique;
      }
    }
  }
  
  return unique;
}

/**
 * Friday: Current Favorites
 * Headliner + 3 stages of 6 artists each (18 total)
 */
function generateFriday(
  topArtistsShort: SpotifyArtist[],
  usedArtistIds: Set<string>,
  fallbackPool: SpotifyArtist[],
  headliner: SpotifyArtist
): FestivalDay {
  const mainStageArtists = getUniqueArtists(topArtistsShort, usedArtistIds, fallbackPool, 5);
  const sunsetStage = getUniqueArtists(topArtistsShort, usedArtistIds, fallbackPool, 6);
  const tentStage = getUniqueArtists(topArtistsShort, usedArtistIds, fallbackPool, 6);

  return {
    name: 'Friday',
    date: 'June 14',
    headliner: headliner,
    stages: [
      {
        name: 'Main Stage',
        artists: [headliner, ...mainStageArtists],
        color: 'from-purple-500 to-pink-500',
      },
      {
        name: 'Sunset Stage',
        artists: sunsetStage,
        color: 'from-orange-500 to-red-500',
      },
      {
        name: 'Discovery Tent',
        artists: tentStage,
        color: 'from-blue-500 to-cyan-500',
      },
    ],
  };
}

/**
 * Saturday: Mix of Medium-term favorites + Recent Discoveries
 * Headliner + 3 stages of 6 artists each (18 total)
 */
function generateSaturday(
  topArtistsMedium: SpotifyArtist[],
  recentlyPlayed: RecentlyPlayedTrack[],
  usedArtistIds: Set<string>,
  fallbackPool: SpotifyArtist[],
  headliner: SpotifyArtist
): FestivalDay {
  // Extract unique artists from recently played
  const recentArtists = extractArtistsFromTracks(recentlyPlayed);
  
  // Filter out artists that have already been used
  const availableRecent = recentArtists.filter(a => !usedArtistIds.has(a.id));
  const availableMedium = topArtistsMedium.filter(a => !usedArtistIds.has(a.id));

  const mainStageArtists = getUniqueArtists(availableMedium, usedArtistIds, fallbackPool, 5);
  const secondStage = getUniqueArtists(availableMedium, usedArtistIds, fallbackPool, 6);
  
  // Discovery stage: prioritize recent discoveries
  const discoveryStage = availableRecent.length > 5
    ? getUniqueArtists(availableRecent, usedArtistIds, fallbackPool, 6)
    : getUniqueArtists(availableMedium, usedArtistIds, fallbackPool, 6);

  return {
    name: 'Saturday',
    date: 'June 15',
    headliner: headliner,
    stages: [
      {
        name: 'Main Stage',
        artists: [headliner, ...mainStageArtists],
        color: 'from-pink-500 to-purple-500',
      },
      {
        name: 'Grove Stage',
        artists: secondStage,
        color: 'from-green-500 to-emerald-500',
      },
      {
        name: 'New Sounds Tent',
        artists: discoveryStage,
        color: 'from-yellow-500 to-orange-500',
      },
    ],
  };
}

/**
 * Sunday: All-Time Favorites & Chill Vibes
 * Headliner + 3 stages of 6 artists each (18 total)
 */
function generateSunday(
  topArtistsLong: SpotifyArtist[],
  usedArtistIds: Set<string>,
  fallbackPool: SpotifyArtist[],
  headliner: SpotifyArtist
): FestivalDay {
  // Filter out already used artists
  const availableArtists = topArtistsLong.filter(a => !usedArtistIds.has(a.id));
  const availableFallback = fallbackPool.filter(a => !usedArtistIds.has(a.id));
  
  // Try to identify "chill" artists by genre
  const chillGenres = ['indie', 'folk', 'acoustic', 'chill', 'ambient', 'lofi', 'jazz', 'classical'];
  const chillArtists = availableArtists.filter(artist =>
    artist.genres.some(genre =>
      chillGenres.some(chill => genre.toLowerCase().includes(chill))
    )
  );

  const mainStageArtists = getUniqueArtists(availableArtists, usedArtistIds, availableFallback, 5);
  
  // Use chill artists if we have enough, otherwise use regular artists
  const acousticGrove = chillArtists.length >= 6
    ? getUniqueArtists(chillArtists, usedArtistIds, availableFallback, 6)
    : getUniqueArtists(availableArtists, usedArtistIds, availableFallback, 6);
    
  const sundownStage = getUniqueArtists(availableArtists, usedArtistIds, availableFallback, 6);

  return {
    name: 'Sunday',
    date: 'June 16',
    headliner: headliner,
    stages: [
      {
        name: 'Main Stage',
        artists: [headliner, ...mainStageArtists],
        color: 'from-indigo-500 to-blue-500',
      },
      {
        name: 'Acoustic Grove',
        artists: acousticGrove,
        color: 'from-green-400 to-teal-400',
      },
      {
        name: 'Sundown Stage',
        artists: sundownStage,
        color: 'from-amber-500 to-orange-500',
      },
    ],
  };
}

/**
 * Extract unique artists from recently played tracks
 */
function extractArtistsFromTracks(recentlyPlayed: RecentlyPlayedTrack[]): SpotifyArtist[] {
  const artistMap = new Map<string, SpotifyArtist>();

  recentlyPlayed.forEach(item => {
    item.track.artists.forEach(artist => {
      if (!artistMap.has(artist.id)) {
        // Create a minimal SpotifyArtist object from track artist
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          genres: [],
          images: item.track.album.images,
          popularity: item.track.popularity,
          external_urls: { spotify: `https://open.spotify.com/artist/${artist.id}` },
        });
      }
    });
  });

  return Array.from(artistMap.values());
}

/**
 * Extract and count top genres from artists
 */
function extractTopGenres(artists: SpotifyArtist[], limit: number = 5): string[] {
  const genreCounts = new Map<string, number>();

  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    });
  });

  return Array.from(genreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}