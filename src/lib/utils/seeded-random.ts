/**
 * Seeded random number generator
 * Uses a simple hash function to generate consistent random numbers from a seed
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    // Convert string seed to numeric seed
    this.seed = this.hashString(seed);
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate next pseudo-random number between 0 and 1
   * Uses a simple Linear Congruential Generator (LCG)
   */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Get random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Get random item from array
   */
  choose<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }
}

/**
 * Generate a seed from user's Spotify data
 */
export function generateUserSeed(topArtistIds: string[]): string {
  // Use the first 10 artist IDs to create a consistent seed
  // This ensures the same music taste always generates the same festival
  return topArtistIds.slice(0, 10).sort().join('-');
}
