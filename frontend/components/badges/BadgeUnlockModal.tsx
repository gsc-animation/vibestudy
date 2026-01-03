'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/lib/badges';
import { BadgeDisplay } from './BadgeDisplay';
import { X, Sparkles } from 'lucide-react';

interface BadgeUnlockModalProps {
  badge: Badge;
  onClose: () => void;
}

export function BadgeUnlockModal({ badge, onClose }: BadgeUnlockModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay content appearance for animation
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`
        bg-gradient-to-br from-purple-600 to-indigo-700 
        rounded-2xl shadow-2xl max-w-sm w-full p-8 
        text-center relative overflow-hidden
        transform transition-all duration-500
        ${showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
      `}>
        {/* Sparkle decorations */}
        <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-300 animate-pulse" />
        <Sparkles className="absolute top-8 right-8 w-4 h-4 text-yellow-300 animate-pulse delay-100" />
        <Sparkles className="absolute bottom-12 left-8 w-5 h-5 text-yellow-300 animate-pulse delay-200" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">🎉 Badge Unlocked!</h2>
        <p className="text-purple-200 mb-6">Congratulations, Scientist!</p>

        <div className={`
          transform transition-all duration-700 delay-300
          ${showContent ? 'scale-100 rotate-0' : 'scale-50 rotate-12'}
        `}>
          <BadgeDisplay badge={badge} earned={true} size="lg" />
        </div>

        <h3 className="text-xl font-bold text-white mt-6">{badge.name}</h3>
        <p className="text-purple-200 mt-2">{badge.description}</p>

        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-white text-purple-700 rounded-full font-bold hover:bg-purple-100 transition"
        >
          Awesome! 🚀
        </button>
      </div>
    </div>
  );
}
