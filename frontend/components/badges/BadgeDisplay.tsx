'use client';

import { Badge } from '@/lib/badges';

interface BadgeDisplayProps {
  badge: Badge;
  earned: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function BadgeDisplay({ badge, earned, size = 'md', showDetails = false }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl'
  };

  const tierBorder = {
    bronze: 'ring-amber-600',
    silver: 'ring-gray-400',
    gold: 'ring-yellow-400',
    diamond: 'ring-cyan-400'
  };

  return (
    <div className={`flex flex-col items-center ${showDetails ? 'gap-2' : ''}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${badge.color}
          ${earned ? '' : 'grayscale opacity-40'}
          rounded-full flex items-center justify-center
          ring-4 ${tierBorder[badge.tier]}
          shadow-lg transition-all duration-300
          ${earned ? 'hover:scale-110' : ''}
        `}
        title={earned ? badge.name : 'Locked'}
      >
        <span className={earned ? '' : 'opacity-50'}>{badge.icon}</span>
      </div>
      {showDetails && (
        <div className="text-center">
          <p className={`font-medium text-sm ${earned ? 'text-gray-800' : 'text-gray-400'}`}>
            {badge.name}
          </p>
          <p className="text-xs text-gray-500">{badge.description}</p>
        </div>
      )}
    </div>
  );
}
