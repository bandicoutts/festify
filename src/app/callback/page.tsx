import { Suspense } from 'react';
import CallbackContent from './CallbackContent';

export default function CallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center gradient-festival">
      <div className="absolute inset-0 bg-black/20" />
      <Suspense fallback={
        <div className="relative z-10 text-white text-center">Loading...</div>
      }>
        <CallbackContent />
      </Suspense>
    </main>
  );
}