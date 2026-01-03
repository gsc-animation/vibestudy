'use client';

import { badges, Badge } from '@/lib/badges';
import { BadgeDisplay } from './BadgeDisplay';

interface BadgeGridProps {
  earnedBadgeIds: string[];
}

export function BadgeGrid({ earnedBadgeIds }: BadgeGridProps) {
  const tiers: Badge['tier'][] = ['diamond', 'gold', 'silver', 'bronze'];
  
  return (
    <div className="space-y-6">
      {tiers.map(tier => {
        const tierBadges = badges.filter(b => b.tier === tier);
        if (tierBadges.length === 0) return null;
        
        return (
          <div key={tier}>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
              {tier === 'diamond' && '💎'}
              {tier === 'gold' && '🥇'}
              {tier === 'silver' && '🥈'}
              {tier === 'bronze' && '🥉'}
              {tier} Tier
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {tierBadges.map(badge => (
                <BadgeDisplay
                  key={badge.id}
                  badge={badge}
                  earned={earnedBadgeIds.includes(badge.id)}
                  size="md"
                  showDetails
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
