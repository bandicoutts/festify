'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleSpotifyCallback } from '@/lib/spotify/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

export default function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

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
        await handleSpotifyCallback(code, state);
        router.push('/festival');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
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
        <LoadingSpinner
          title="Connecting to Spotify"
          subtitle="Generating your personalized festival..."
        />
      )}
    </motion.div>
  );
}