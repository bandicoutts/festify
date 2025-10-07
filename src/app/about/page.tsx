'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <div className="gradient-festival">
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white hover:bg-white/20 transition-all flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </button>
              <h1 className="text-xl md:text-3xl font-bold text-white text-center flex-1">About</h1>
              <div className="w-20 sm:w-32" /> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-white/80">
              Turn your Spotify data into a personalized festival experience
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="relative z-10">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8 mb-16"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-festival-purple flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">
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
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">
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
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">
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
              <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Share & Explore</h3>
                <p className="text-white/70">
                  Click on any artist to open their Spotify page. Check out different days to see how we've organized your music taste into a cohesive festival experience. Download your poster or share with friends!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-white mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">🔒 Your Privacy Matters</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-white/70 mb-2">
                  <strong className="text-white">What we access:</strong> Your top artists and recent listening history from Spotify
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-2">
                  <strong className="text-white">What we DON'T access:</strong> Your playlists, saved songs, followers, or any personal information beyond your music taste
                </p>
              </div>
              <div>
                <p className="text-sm text-white/70">
                  <strong className="text-white">Data storage:</strong> Nothing is permanently stored on our servers. Your festival data exists only in your browser session. When you log out or close the tab, it's gone. We never sell or share your data with third parties.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 text-white mb-16"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">⚙️ Built With</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-semibold text-white">Next.js 15</p>
                <p className="text-xs text-white/60">Framework</p>
              </div>
              <div>
                <p className="font-semibold text-white">TypeScript</p>
                <p className="text-xs text-white/60">Language</p>
              </div>
              <div>
                <p className="font-semibold text-white">Tailwind CSS</p>
                <p className="text-xs text-white/60">Styling</p>
              </div>
              <div>
                <p className="font-semibold text-white">Framer Motion</p>
                <p className="text-xs text-white/60">Animation</p>
              </div>
              <div>
                <p className="font-semibold text-white">Spotify API</p>
                <p className="text-xs text-white/60">Data Source</p>
              </div>
              <div>
                <p className="font-semibold text-white">OAuth 2.0</p>
                <p className="text-xs text-white/60">Authentication</p>
              </div>
              <div>
                <p className="font-semibold text-white">Vercel</p>
                <p className="text-xs text-white/60">Hosting</p>
              </div>
              <div>
                <p className="font-semibold text-white">GitHub</p>
                <p className="text-xs text-white/60">Source Control</p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <button
              onClick={() => router.push('/')}
              className="px-12 py-5 text-lg font-semibold text-white bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-2xl"
            >
              Create Your Festival
            </button>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-white/50 text-sm mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Not affiliated with Spotify or any music festival
          </motion.p>
        </div>
      </div>
    </main>
  );
}