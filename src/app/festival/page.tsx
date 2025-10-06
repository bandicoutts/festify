'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/spotify/auth';
import { useFestivalData } from '@/hooks/useFestivalData';
import { motion } from 'framer-motion';

export default function FestivalPage() {
  const router = useRouter();
  const { festival, loading, error } = useFestivalData();
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="festival-card text-white text-center max-w-md mx-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🎵
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Creating Your Festival</h2>
            <p className="text-white/80">Analyzing your Spotify data...</p>
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
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
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-white/20 rounded-full hover:bg-white/30 transition-all"
            >
              Go Back Home
            </button>
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                Logout
              </button>
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
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="festival-card text-center"
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="bg-black/80 py-8 sticky top-0 z-20 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4">
            {festival.days.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
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
      <div className="bg-black/70 py-16 border-b border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-festival-yellow text-sm font-semibold tracking-wider uppercase mb-4">
              {currentDay.name} Headliner
            </p>
            <div className="festival-card">
              {currentDay.headliner.images[0] && (
                <img
                  src={currentDay.headliner.images[0].url}
                  alt={currentDay.headliner.name}
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover ring-4 ring-white/20"
                />
              )}
              <h2 className="text-5xl font-bold text-white mb-4">
                {currentDay.headliner.name}
              </h2>
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
          </motion.div>
        </div>
      </div>

      {/* Stages */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-16"
        >
          {currentDay.stages.map((stage, stageIdx) => (
            <div key={stageIdx}>
              <h3 className={`text-3xl font-bold mb-8 text-center bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                {stage.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {stage.artists.map((artist, artistIdx) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: artistIdx * 0.03 }}
                    className="festival-card hover:scale-105 transition-transform cursor-pointer"
                  >
                    {artist.images[0] && (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-full aspect-square object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-white text-base text-center">
                      {artist.name}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Share Section */}
      <div className="bg-gradient-to-b from-black to-purple-900/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Love Your Festival?
          </h3>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Share your personalized lineup with friends or download your festival poster
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all">
              Download Poster (Coming Soon)
            </button>
            <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
              Share on Twitter (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
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