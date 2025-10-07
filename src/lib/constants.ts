/**
 * Application-wide constants
 */

// Spotify API Configuration
export const SPOTIFY_API = {
  MAX_ITEMS_PER_REQUEST: 50,
  RATE_LIMIT_RETRY_HEADER: 'Retry-After',
} as const;

// Festival Generation Configuration
export const FESTIVAL_CONFIG = {
  REQUIRED_HEADLINERS: 3,
  MIN_ARTISTS_REQUIRED: 10,
  ARTISTS_PER_STAGE: 6,
  MAIN_STAGE_ARTISTS: 5, // Excluding headliner
  DAYS_COUNT: 3,
} as const;

// Festival Time Slots
export const TIME_SLOTS = {
  HEADLINER_TIME: '9:30 PM',
  SLOT_DURATION_MINUTES: 75,
  STAGE_START_TIMES: [
    { hour: 14, minute: 0 },  // Main Stage: 2:00 PM
    { hour: 15, minute: 30 }, // Second Stage: 3:30 PM
    { hour: 16, minute: 0 },  // Third Stage: 4:00 PM
  ],
} as const;

// Genre Classifications
export const GENRE_CLASSIFICATIONS = {
  CHILL: ['indie', 'folk', 'acoustic', 'chill', 'ambient', 'lofi', 'jazz', 'classical'],
  TOP_GENRES_LIMIT: 5,
} as const;

// PKCE Configuration
export const PKCE_CONFIG = {
  CODE_VERIFIER_LENGTH: 128,
  STATE_LENGTH: 16,
} as const;
