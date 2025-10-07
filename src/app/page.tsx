'use client';

import { useEffect, useState } from 'react';
import { initiateSpotifyLogin, isAuthenticated } from '@/lib/spotify/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to festival page
    if (isAuthenticated()) {
      router.push('/festival');
    }
  }, [router]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await initiateSpotifyLogin();
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('Failed to initiate login. Please check your environment variables.');
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-festival opacity-80" />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-festival-pink rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-festival-blue rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo/Title */}
          <motion.h1
            className="text-7xl md:text-9xl font-bold mb-6 gradient-text"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Festify
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-4 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your music taste, transformed into a festival
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Connect your Spotify and discover what your personalized three-day music festival would look like
          </motion.p>

          {/* CTA Button */}
          <motion.button
            onClick={handleLogin}
            disabled={isLoading}
            className="group relative px-12 py-5 text-lg font-semibold text-white bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Connect with Spotify
              </span>
            )}
          </motion.button>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 px-4 py-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {[
              { icon: '🎵', title: 'Personalized Lineup', desc: 'Your top artists become headliners' },
              { icon: '🎨', title: 'Custom Poster', desc: 'Download and share your festival' },
              { icon: '🔒', title: 'Private & Safe', desc: 'No data stored on our servers' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="festival-card text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            className="mt-24 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              How It Works
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-festival-purple flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Connect Your Spotify</h3>
                  <p className="text-white/70">
                    Securely authenticate with Spotify using OAuth. We only request permission to view your top artists and recent listening history—nothing else.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-festival-pink flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">We Analyze Your Taste</h3>
                  <p className="text-white/70">
                    Our algorithm looks at your top artists from different time periods—your current obsessions, recent discoveries, and all-time favorites. We also check out your genres to create a unique festival vibe.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-festival-orange flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Your Festival is Born</h3>
                  <p className="text-white/70">
                    We generate a three-day festival with your most popular artists as headliners, organize everyone across multiple stages, assign realistic time slots, and give your festival a custom name. Each artist appears only once—just like a real festival!
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-festival-blue flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Share & Explore</h3>
                  <p className="text-white/70">
                    Click on any artist to open their Spotify page. Check out different days to see how we've organized your music taste into a cohesive festival experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 festival-card text-white">
              <h3 className="text-lg font-semibold mb-3">🔒 Your Privacy Matters</h3>
              <p className="text-sm text-white/70 mb-2">
                <strong>What we access:</strong> Your top artists and recent listening history
              </p>
              <p className="text-sm text-white/70 mb-2">
                <strong>What we DON'T access:</strong> Your playlists, saved songs, or personal information
              </p>
              <p className="text-sm text-white/70">
                <strong>Data storage:</strong> Nothing is stored on our servers. Your festival exists only in your browser session. When you log out, it's gone.
              </p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-white/50 text-sm mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Not affiliated with Spotify or any music festival
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}