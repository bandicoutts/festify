import { SeededRandom } from '../utils/seeded-random';

/**
 * Generates creative festival names based on user's top genres
 */

const adjectives = [
  'Sonic', 'Electric', 'Cosmic', 'Neon', 'Golden', 'Velvet', 
  'Crystal', 'Mystic', 'Wild', 'Sunset', 'Midnight', 'Aurora',
  'Stellar', 'Lunar', 'Solar', 'Urban', 'Desert', 'Forest',
  'Ocean', 'Mountain', 'River', 'Island', 'Sky', 'Horizon'
];

const nouns = [
  'Waves', 'Vibes', 'Dreams', 'Nights', 'Days', 'Sessions',
  'Beats', 'Sounds', 'Rhythms', 'Melodies', 'Harmonies', 'Echoes',
  'Frequencies', 'Pulse', 'Flow', 'Groove', 'Jam', 'Sessions',
  'Festival', 'Fest', 'Gathering', 'Assembly', 'Collective'
];

const genreSpecific: Record<string, string[]> = {
  'electronic': ['Circuit', 'Digital', 'Synth', 'Electric'],
  'rock': ['Riff', 'Amplified', 'Loud', 'Raw'],
  'indie': ['Alternative', 'Underground', 'Indie', 'DIY'],
  'pop': ['Neon', 'Bright', 'Shiny', 'Pop'],
  'hip hop': ['Urban', 'Street', 'Block', 'Cipher'],
  'jazz': ['Blue Note', 'Smooth', 'Cool', 'Modal'],
  'classical': ['Symphony', 'Orchestral', 'Chamber', 'Baroque'],
  'folk': ['Acoustic', 'Rustic', 'Campfire', 'Roots'],
  'metal': ['Heavy', 'Dark', 'Iron', 'Steel'],
  'country': ['Honky Tonk', 'Nashville', 'Outlaw', 'Western'],
};

export function generateFestivalName(topGenres: string[], random: SeededRandom): string {
  // Try to use genre-specific words if available
  let prefix = '';
  for (const genre of topGenres) {
    const genreLower = genre.toLowerCase();
    for (const [key, values] of Object.entries(genreSpecific)) {
      if (genreLower.includes(key)) {
        prefix = random.choose(values);
        break;
      }
    }
    if (prefix) break;
  }

  // Fallback to random adjective if no genre match
  if (!prefix) {
    prefix = random.choose(adjectives);
  }

  const suffix = random.choose(nouns);

  return `${prefix} ${suffix}`;
}

export function generateFestivalDates(): string {
  // Generate dates for next summer (June)
  const currentYear = new Date().getFullYear();
  const festivalYear = currentYear + 1;

  return `June 14-16, ${festivalYear}`;
}

/**
 * Generate individual day dates for the festival
 * Returns an array of formatted date strings
 */
export function generateDayDates(): { name: string; date: string }[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // If we're past June, plan for next year
  const festivalYear = currentMonth >= 5 ? currentYear + 1 : currentYear;

  // Create dates for June 14, 15, 16
  const dayNames = ['Friday', 'Saturday', 'Sunday'];
  const monthName = 'June';
  const startDay = 14;

  return dayNames.map((name, index) => ({
    name,
    date: `${monthName} ${startDay + index}`,
  }));
}

export function generateFestivalLocation(topGenres: string[], random: SeededRandom): string {
  const locations = [
    'Golden Gate Park, SF',
    'Desert Valley, CA',
    'Coastal Meadows, OR',
    'Mountain View, CO',
    'Lakeside Grounds, MI',
    'Forest Clearing, WA',
    'Sunset Beach, FL',
    'Urban Plaza, NY',
    'Riverside Park, TX',
    'Island Shores, HI',
  ];

  return random.choose(locations);
}