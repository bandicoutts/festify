import { SPOTIFY_API } from '../constants';

/**
 * Spotify Web API wrapper
 * https://developer.spotify.com/documentation/web-api
 */

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    images: { url: string; height: number; width: number }[];
  };
  popularity: number;
}

export interface RecentlyPlayedTrack {
  track: SpotifyTrack;
  played_at: string;
}

interface SpotifyPaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

interface SpotifyUserProfile {
  id: string;
  display_name: string;
  images: { url: string }[];
}

export class SpotifyAPI {
  constructor(private accessToken: string) {}

  private async fetch<T>(endpoint: string, retries = 0): Promise<T> {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const retrySeconds = retryAfter ? parseInt(retryAfter) : 1;

        // Retry automatically if we haven't exceeded max retries
        if (retries < 3) {
          await new Promise(resolve => setTimeout(resolve, retrySeconds * 1000));
          return this.fetch<T>(endpoint, retries + 1);
        }

        throw new Error(`Rate limited. Please try again in ${retrySeconds} seconds.`);
      }
      if (response.status === 401) {
        throw new Error('Unauthorized - token may be expired');
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get user's top artists
   * @param timeRange - short_term (4 weeks), medium_term (6 months), long_term (years)
   * @param limit - Number of artists to return (max 50)
   */
  async getTopArtists(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = SPOTIFY_API.MAX_ITEMS_PER_REQUEST
  ): Promise<SpotifyArtist[]> {
    const data = await this.fetch<SpotifyPaginatedResponse<SpotifyArtist>>(
      `/me/top/artists?time_range=${timeRange}&limit=${limit}`
    );
    return data.items;
  }

  /**
   * Get user's top tracks
   */
  async getTopTracks(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = SPOTIFY_API.MAX_ITEMS_PER_REQUEST
  ): Promise<SpotifyTrack[]> {
    const data = await this.fetch<SpotifyPaginatedResponse<SpotifyTrack>>(
      `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
    );
    return data.items;
  }

  /**
   * Get user's recently played tracks
   */
  async getRecentlyPlayed(limit: number = SPOTIFY_API.MAX_ITEMS_PER_REQUEST): Promise<RecentlyPlayedTrack[]> {
    const data = await this.fetch<SpotifyPaginatedResponse<RecentlyPlayedTrack>>(
      `/me/player/recently-played?limit=${limit}`
    );
    return data.items;
  }

  /**
   * Get current user's profile
   */
  async getUserProfile(): Promise<SpotifyUserProfile> {
    return this.fetch<SpotifyUserProfile>('/me');
  }
}