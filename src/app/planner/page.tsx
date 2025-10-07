'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/spotify/auth';
import { useFavorites, FavoriteArtist } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

export default function PlannerPage() {
  const router = useRouter();
  const { favorites, toggleFavorite, isHydrated } = useFavorites();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <main className="min-h-screen gradient-festival">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading your planner...</p>
          </div>
        </div>
      </main>
    );
  }

  // Get unique days from favorites
  const days = Array.from(new Set(favorites.map((f) => f.day)));

  // Filter favorites by selected day (or show all if none selected)
  const filteredFavorites = selectedDay
    ? favorites.filter((f) => f.day === selectedDay)
    : favorites;

  // Group by day and then by time
  const groupedByDay = filteredFavorites.reduce((acc, fav) => {
    if (!acc[fav.day]) {
      acc[fav.day] = [];
    }
    acc[fav.day].push(fav);
    return acc;
  }, {} as Record<string, FavoriteArtist[]>);

  // Sort each day's artists by time
  Object.keys(groupedByDay).forEach((day) => {
    groupedByDay[day].sort((a, b) => {
      const timeA = parseTime(a.timeSlot);
      const timeB = parseTime(b.timeSlot);
      return timeA - timeB;
    });
  });

  // Helper to parse time strings like "2:00 PM" to minutes
  function parseTime(timeSlot: string): number {
    const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // Detect time conflicts
  function hasConflict(artist: FavoriteArtist): FavoriteArtist | null {
    const artistTime = parseTime(artist.timeSlot);
    const conflictingArtist = favorites.find(
      (other) =>
        other.artistId !== artist.artistId &&
        other.day === artist.day &&
        parseTime(other.timeSlot) === artistTime
    );
    return conflictingArtist || null;
  }

  if (favorites.length === 0) {
    return (
      <main className="min-h-screen gradient-festival">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="festival-card text-white text-center max-w-md">
            <div className="text-6xl mb-4">💔</div>
            <h1 className="text-2xl font-bold mb-2">No Artists Selected</h1>
            <p className="text-white/80 mb-6">
              Heart your favorite artists in the festival lineup to create your personalized schedule!
            </p>
            <button
              onClick={() => router.push('/festival')}
              className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Browse Festival Lineup
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="gradient-festival">
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => router.push('/festival')}
                className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back to Festival</span>
                <span className="sm:hidden">Back</span>
              </button>
              <h1 className="text-xl md:text-3xl font-bold text-white text-center flex-1">My Planner</h1>
              <div className="w-20 sm:w-36" /> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Schedule</h2>
            <p className="text-lg text-white/80">
              {favorites.length} artist{favorites.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>
      </div>

      {/* Day Filter */}
      {days.length > 1 && (
        <div className="bg-black/50 py-6 border-b border-white/10 sticky top-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={() => setSelectedDay(null)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedDay === null
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                All Days
              </button>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedDay === day
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Schedule by Day */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {Object.keys(groupedByDay).sort().map((day) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h3 className="text-3xl font-bold text-white mb-6">{day}</h3>
            <div className="space-y-3">
              {groupedByDay[day].map((artist) => {
                const conflict = hasConflict(artist);
                return (
                  <motion.div
                    key={artist.artistId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`festival-card ${
                      conflict ? 'border-2 border-red-500/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-festival-purple font-bold text-lg">
                            {artist.timeSlot}
                          </span>
                          <span className="text-white/60 text-sm">•</span>
                          <span className="text-white/80 text-sm">{artist.stageName}</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{artist.artistName}</h4>
                        {conflict && (
                          <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Conflict with {conflict.artistName}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFavorite(artist)}
                        className="p-2 hover:bg-white/10 rounded-full transition-all"
                      >
                        <svg className="w-6 h-6 fill-red-500 text-red-500" viewBox="0 0 24 24">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60 mb-6">
            Want to add more artists to your planner?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/festival')}
              className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Browse Festival Lineup
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
