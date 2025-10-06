'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleSpotifyCallback } from '@/lib/spotify/auth';
import { motion } from 'framer-motion';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      // Handle user denial or errors
      if (errorParam) {
        setError('Authentication was cancelled or failed');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      if (!code || !state) {
        setError('Invalid callback parameters');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        // Exchange code for tokens
        await handleSpotifyCallback(code, state);
        
        // Redirect to festival page
        router.push('/festival');
      } catch (err) {
        console.error('Callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex items-center justify-center gradient-festival">
      <div className="absolute inset-0 bg-black/20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center text-white"
      >
        {error ? (
          <div className="festival-card max-w-md mx-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
            <p className="text-white/80 mb-4">{error}</p>
            <p className="text-sm text-white/60">Redirecting back to home...</p>
          </div>
        ) : (
          <div className="festival-card max-w-md mx-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block text-6xl mb-4"
            >
              🎵
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Connecting to Spotify</h1>
            <p className="text-white/80">Generating your personalized festival...</p>
            
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
          </div>
        )}
      </motion.div>
    </main>
  );
}