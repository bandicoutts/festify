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

export function generateFestivalName(topGenres: string[]): string {
  // Try to use genre-specific words if available
  let prefix = '';
  for (const genre of topGenres) {
    const genreLower = genre.toLowerCase();
    for (const [key, values] of Object.entries(genreSpecific)) {
      if (genreLower.includes(key)) {
        prefix = values[Math.floor(Math.random() * values.length)];
        break;
      }
    }
    if (prefix) break;
  }

  // Fallback to random adjective if no genre match
  if (!prefix) {
    prefix = adjectives[Math.floor(Math.random() * adjectives.length)];
  }

  const suffix = nouns[Math.floor(Math.random() * nouns.length)];

  return `${prefix} ${suffix}`;
}

export function generateFestivalDates(): string {
  // Generate dates for next summer (June)
  const currentYear = new Date().getFullYear();
  const festivalYear = currentYear + 1;
  
  return `June 14-16, ${festivalYear}`;
}

export function generateFestivalLocation(topGenres: string[]): string {
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

  return locations[Math.floor(Math.random() * locations.length)];
}