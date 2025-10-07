import { SpotifyArtist, SpotifyTrack, RecentlyPlayedTrack } from '../spotify/api';
import { Festival, FestivalDay } from '../types';
import { generateFestivalName, generateFestivalDates, generateFestivalLocation, generateDayDates } from './name-generator';
import { FESTIVAL_CONFIG, GENRE_CLASSIFICATIONS } from '../constants';
import { SeededRandom, generateUserSeed } from '../utils/seeded-random';

interface SpotifyData {
  topArtistsShort: SpotifyArtist[];
  topArtistsMedium: SpotifyArtist[];
  topArtistsLong: SpotifyArtist[];
  recentlyPlayed: RecentlyPlayedTrack[];
}

interface DayConfig {
  name: string;
  date: string;
  primaryArtists: SpotifyArtist[];
  secondaryArtists?: SpotifyArtist[];
  useChillFilter?: boolean;
  stages: StageConfig[];
}

interface StageConfig {
  name: string;
  color: string;
  artistSource: 'primary' | 'secondary' | 'chill';
}

/**
 * Generates a personalized festival from Spotify listening data
 */
export function generateFestival(
  topArtistsShort: SpotifyArtist[],
  topArtistsMedium: SpotifyArtist[],
  topArtistsLong: SpotifyArtist[],
  recentlyPlayed: RecentlyPlayedTrack[]
): Festival {
  const data: SpotifyData = {
    topArtistsShort,
    topArtistsMedium,
    topArtistsLong,
    recentlyPlayed,
  };

  return generateFestivalFromData(data);
}

/**
 * Main festival generation logic
 */
function generateFestivalFromData(data: SpotifyData): Festival {
  // Combine all artists and remove duplicates, maintaining order preference
  const allArtistsMap = new Map<string, SpotifyArtist>();

  // Priority order: short -> medium -> long (most recent listening first)
  [...data.topArtistsShort, ...data.topArtistsMedium, ...data.topArtistsLong].forEach(artist => {
    if (!allArtistsMap.has(artist.id)) {
      allArtistsMap.set(artist.id, artist);
    }
  });

  const allUniqueArtists = Array.from(allArtistsMap.values());

  console.log(`Total unique artists available: ${allUniqueArtists.length}`);

  // Validate we have enough artists
  if (allUniqueArtists.length < FESTIVAL_CONFIG.MIN_ARTISTS_REQUIRED) {
    throw new Error('Not enough artists in your listening history. Please listen to more music on Spotify!');
  }

  // Sort all artists by popularity to get the true top headliners
  const sortedByPopularity = [...allUniqueArtists].sort((a, b) => b.popularity - a.popularity);

  // Extract all unique genres
  const allGenres = extractTopGenres(allUniqueArtists);

  // Create seeded random generator from user's top artists
  // This ensures the same music taste always generates the same festival details
  const seed = generateUserSeed(allUniqueArtists.map(a => a.id));
  const random = new SeededRandom(seed);

  // Generate festival metadata using seeded random
  const festivalName = generateFestivalName(allGenres, random);
  const festivalDates = generateFestivalDates();
  const festivalLocation = generateFestivalLocation(allGenres, random);

  // Get the headliners (one for each day)
  const headliners = sortedByPopularity.slice(0, FESTIVAL_CONFIG.REQUIRED_HEADLINERS);

  // Track which artists have been assigned
  const usedArtistIds = new Set<string>();

  // Mark headliners as used
  headliners.forEach(h => usedArtistIds.add(h.id));

  // Extract artists from recently played
  const recentArtists = extractArtistsFromTracks(data.recentlyPlayed);

  // Generate festival days
  const dayConfigs = getDayConfigurations(data, recentArtists);
  const days: FestivalDay[] = dayConfigs.map((config, index) =>
    generateDay(config, headliners[index], usedArtistIds, allUniqueArtists)
  );

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
 * Get configuration for all festival days
 */
function getDayConfigurations(data: SpotifyData, recentArtists: SpotifyArtist[]): DayConfig[] {
  // Generate dynamic dates
  const dayDates = generateDayDates();

  return [
    // Friday: Current Favorites
    {
      name: dayDates[0].name,
      date: dayDates[0].date,
      primaryArtists: data.topArtistsShort,
      stages: [
        { name: 'Main Stage', color: 'from-purple-500 to-pink-500', artistSource: 'primary' },
        { name: 'Sunset Stage', color: 'from-orange-500 to-red-500', artistSource: 'primary' },
        { name: 'Discovery Tent', color: 'from-blue-500 to-cyan-500', artistSource: 'primary' },
      ],
    },
    // Saturday: Mix of Medium-term + Recent Discoveries
    {
      name: dayDates[1].name,
      date: dayDates[1].date,
      primaryArtists: data.topArtistsMedium,
      secondaryArtists: recentArtists,
      stages: [
        { name: 'Main Stage', color: 'from-pink-500 to-purple-500', artistSource: 'primary' },
        { name: 'Grove Stage', color: 'from-green-500 to-emerald-500', artistSource: 'primary' },
        { name: 'New Sounds Tent', color: 'from-yellow-500 to-orange-500', artistSource: 'secondary' },
      ],
    },
    // Sunday: All-Time Favorites & Chill Vibes
    {
      name: dayDates[2].name,
      date: dayDates[2].date,
      primaryArtists: data.topArtistsLong,
      useChillFilter: true,
      stages: [
        { name: 'Main Stage', color: 'from-indigo-500 to-blue-500', artistSource: 'primary' },
        { name: 'Acoustic Grove', color: 'from-green-400 to-teal-400', artistSource: 'chill' },
        { name: 'Sundown Stage', color: 'from-amber-500 to-orange-500', artistSource: 'primary' },
      ],
    },
  ];
}

/**
 * Unified day generation function - replaces generateFriday, generateSaturday, generateSunday
 */
function generateDay(
  config: DayConfig,
  headliner: SpotifyArtist,
  usedArtistIds: Set<string>,
  fallbackPool: SpotifyArtist[]
): FestivalDay {
  const stages = config.stages.map(stageConfig => {
    let artists: SpotifyArtist[] = [];
    const isMainStage = stageConfig.name === 'Main Stage';
    const count = isMainStage ? FESTIVAL_CONFIG.MAIN_STAGE_ARTISTS : FESTIVAL_CONFIG.ARTISTS_PER_STAGE;

    // Select artist source based on configuration
    let sourceArtists: SpotifyArtist[] = [];
    if (stageConfig.artistSource === 'primary') {
      sourceArtists = config.primaryArtists;
    } else if (stageConfig.artistSource === 'secondary' && config.secondaryArtists) {
      sourceArtists = config.secondaryArtists.length > 5 ? config.secondaryArtists : config.primaryArtists;
    } else if (stageConfig.artistSource === 'chill' && config.useChillFilter) {
      sourceArtists = filterChillArtists(config.primaryArtists);
      // Fallback to primary if not enough chill artists
      if (sourceArtists.length < FESTIVAL_CONFIG.ARTISTS_PER_STAGE) {
        sourceArtists = config.primaryArtists;
      }
    }

    artists = getUniqueArtists(sourceArtists, usedArtistIds, fallbackPool, count);

    // Add headliner to main stage
    if (isMainStage) {
      return {
        name: stageConfig.name,
        artists: [headliner, ...artists],
        color: stageConfig.color,
      };
    }

    return {
      name: stageConfig.name,
      artists,
      color: stageConfig.color,
    };
  });

  return {
    name: config.name,
    date: config.date,
    headliner,
    stages,
  };
}

/**
 * Filter artists by chill genres
 */
function filterChillArtists(artists: SpotifyArtist[]): SpotifyArtist[] {
  return artists.filter(artist =>
    artist.genres.some(genre =>
      GENRE_CLASSIFICATIONS.CHILL.some(chillGenre => genre.toLowerCase().includes(chillGenre))
    )
  );
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
function extractTopGenres(artists: SpotifyArtist[], limit: number = GENRE_CLASSIFICATIONS.TOP_GENRES_LIMIT): string[] {
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