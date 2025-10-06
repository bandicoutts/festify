import { SpotifyArtist } from './spotify/api';

export interface FestivalStage {
  name: string;
  artists: SpotifyArtist[];
  color: string; // For UI theming
}

export interface FestivalDay {
  name: string;
  date: string;
  headliner: SpotifyArtist;
  stages: FestivalStage[];
}

export interface Festival {
  name: string;
  dates: string;
  location: string;
  days: FestivalDay[];
  headliners: SpotifyArtist[];
  totalArtists: number;
}