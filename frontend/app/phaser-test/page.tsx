'use client';

import dynamic from 'next/dynamic';

// Dynamically import PhaserGame with ssr: false to prevent server-side rendering issues
// Although PhaserGame uses 'use client', dynamic import ensures Phaser itself isn't loaded on server
const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false,
  loading: () => <div className="p-4 text-white">Loading Game...</div>
});

export default function PhaserTestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Phaser Integration Test</h1>
      
      <div className="border-4 border-indigo-500 rounded-lg overflow-hidden shadow-2xl">
        <PhaserGame />
      </div>
      
      <p className="mt-8 text-gray-400 max-w-lg text-center">
        If you see the game canvas above with the text VibeStudy Lab, the Phaser integration is working correctly.
      </p>
    </div>
  );
}