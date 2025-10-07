'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/spotify/auth';
import { useFestivalData } from '@/hooks/useFestivalData';
import { generateTimeSlot } from '@/lib/utils/time-slots';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function FestivalPage() {
  const router = useRouter();
  const { festival, loading, error, refetch } = useFestivalData();
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen gradient-festival">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner
            title="Creating Your Festival"
            subtitle="Analyzing your Spotify data..."
          />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen gradient-festival">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="festival-card text-white text-center max-w-md">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-2">Oops!</h2>
            <p className="text-white/80 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={refetch}
                className="px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-all font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!festival) return null;

  const currentDay = festival.days[selectedDay];

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="gradient-festival">
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {festival.name}
              </h1>
              <div className="flex items-center gap-4">
                <a
                  href="/about"
                  className="hidden md:block px-4 py-2 text-sm text-white/80 hover:text-white transition-all"
                >
                  About
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-4">
                {festival.name}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-2">
                {festival.dates}
              </p>
              <p className="text-lg md:text-xl text-white/70 mb-8">
                {festival.location}
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base">
                <div>
                  <div className="text-3xl font-bold">{festival.totalArtists}</div>
                  <div className="text-white/70">Artists</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{festival.days.length}</div>
                  <div className="text-white/70">Days</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {festival.days.reduce((acc, day) => acc + day.stages.length, 0)}
                  </div>
                  <div className="text-white/70">Stages</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Headliners */}
      <div className="bg-black/50 py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Your Headliners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {festival.headliners.map((artist, i) => (
              <motion.a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="festival-card text-center hover:scale-105 transition-all cursor-pointer"
              >
                {artist.images[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h4 className="text-xl font-bold text-white mb-2">
                  {artist.name}
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {artist.genres.slice(0, 2).map((genre, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/70"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Day Tabs - Sticky on mobile */}
      <div className="bg-black/80 py-4 md:py-8 sticky top-0 z-20 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto">
            {festival.days.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
                  selectedDay === i
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {day.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Headliner */}
      <div className="bg-black/70 py-12 md:py-16 border-b border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-festival-yellow text-xs md:text-sm font-semibold tracking-wider uppercase mb-4">
              {currentDay.name} Headliner
            </p>
            <a
              href={currentDay.headliner.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="festival-card hover:scale-105 transition-all cursor-pointer">
                {currentDay.headliner.images[0] && (
                  <img
                    src={currentDay.headliner.images[0].url}
                    alt={currentDay.headliner.name}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full mx-auto mb-6 object-cover ring-4 ring-white/20"
                  />
                )}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {currentDay.headliner.name}
                </h2>
                <p className="text-festival-yellow font-semibold mb-4">9:30 PM</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentDay.headliner.genres.slice(0, 3).map((genre, idx) => (
                    <span
                      key={idx}
                      className="text-sm px-3 py-1 bg-white/10 rounded-full text-white/70"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Stages */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12 md:space-y-16"
        >
          {currentDay.stages.map((stage, stageIdx) => {
            // Sort artists by time (latest first)
            const sortedArtists = [...stage.artists].sort((a, b) => {
              const aIsHeadliner = stage.name === 'Main Stage' && a.id === currentDay.headliner.id;
              const bIsHeadliner = stage.name === 'Main Stage' && b.id === currentDay.headliner.id;
              
              if (aIsHeadliner) return -1;
              if (bIsHeadliner) return 1;
              
              const aIndex = stage.artists.indexOf(a);
              const bIndex = stage.artists.indexOf(b);
              return bIndex - aIndex;
            });

            return (
              <div key={stageIdx}>
                <h3 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                  {stage.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
                  {sortedArtists.map((artist, displayIdx) => {
                    const originalIndex = stage.artists.indexOf(artist);
                    const isHeadliner = stage.name === 'Main Stage' && artist.id === currentDay.headliner.id;
                    const timeSlot = generateTimeSlot(stageIdx, originalIndex, isHeadliner);
                    
                    return (
                      <motion.a
                        key={artist.id}
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: displayIdx * 0.03 }}
                        className="festival-card hover:scale-105 transition-transform cursor-pointer group"
                      >
                        {artist.images[0] && (
                          <div className="relative mb-3">
                            <img
                              src={artist.images[0].url}
                              alt={artist.name}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center">
                              <svg 
                                className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all"
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <p className="text-xs md:text-sm text-festival-purple font-semibold mb-1">
                            {timeSlot}
                          </p>
                          <h4 className="font-semibold text-white text-sm md:text-base">
                            {artist.name}
                          </h4>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Share Section */}
      <div className="bg-gradient-to-b from-black to-purple-900/20 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Love Your Festival?
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Share your personalized lineup with friends or download your festival poster
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 md:px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all text-sm md:text-base">
              Download Poster (Coming Soon)
            </button>
            <button className="px-6 md:px-8 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all text-sm md:text-base">
              Share on Twitter (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/50 text-xs md:text-sm">
          <p className="mb-2">
            Generated from your Spotify listening history
          </p>
          <p>
            Not affiliated with Spotify or any actual music festival
          </p>
        </div>
      </footer>
    </main>
  );
}