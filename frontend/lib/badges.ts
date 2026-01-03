export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  color: string; // tailwind color class
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlockCondition: {
    type: 'experiments_completed' | 'predictions_correct' | 'streak' | 'first_time' | 'topic_mastery';
    value: number;
    topic?: string;
  };
}

export const badges: Badge[] = [
  {
    id: 'first-experiment',
    name: 'First Discovery',
    description: 'Complete your first experiment',
    icon: '🔬',
    color: 'bg-green-500',
    tier: 'bronze',
    unlockCondition: { type: 'experiments_completed', value: 1 }
  },
  {
    id: 'scientist-apprentice',
    name: 'Scientist Apprentice',
    description: 'Complete 5 experiments',
    icon: '🧪',
    color: 'bg-blue-500',
    tier: 'bronze',
    unlockCondition: { type: 'experiments_completed', value: 5 }
  },
  {
    id: 'junior-scientist',
    name: 'Junior Scientist',
    description: 'Complete 10 experiments',
    icon: '👨‍🔬',
    color: 'bg-purple-500',
    tier: 'silver',
    unlockCondition: { type: 'experiments_completed', value: 10 }
  },
  {
    id: 'master-scientist',
    name: 'Master Scientist',
    description: 'Complete 25 experiments',
    icon: '🎓',
    color: 'bg-yellow-500',
    tier: 'gold',
    unlockCondition: { type: 'experiments_completed', value: 25 }
  },
  {
    id: 'prediction-pro',
    name: 'Prediction Pro',
    description: 'Get 10 predictions correct',
    icon: '🎯',
    color: 'bg-red-500',
    tier: 'silver',
    unlockCondition: { type: 'predictions_correct', value: 10 }
  },
  {
    id: 'streak-starter',
    name: 'On Fire!',
    description: 'Complete experiments 3 days in a row',
    icon: '🔥',
    color: 'bg-orange-500',
    tier: 'bronze',
    unlockCondition: { type: 'streak', value: 3 }
  },
  {
    id: 'magnet-master',
    name: 'Magnet Master',
    description: 'Complete 5 magnet experiments',
    icon: '🧲',
    color: 'bg-indigo-500',
    tier: 'silver',
    unlockCondition: { type: 'topic_mastery', value: 5, topic: 'magnets' }
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'Use the force overlay in an experiment',
    icon: '👓',
    color: 'bg-teal-500',
    tier: 'bronze',
    unlockCondition: { type: 'first_time', value: 1 }
  }
];

export function getBadgeById(id: string): Badge | undefined {
  return badges.find(b => b.id === id);
}

export function getBadgesByTier(tier: Badge['tier']): Badge[] {
  return badges.filter(b => b.tier === tier);
}

// Check if a badge should be unlocked based on user stats
export function checkBadgeUnlock(
  badge: Badge,
  userStats: {
    experimentsCompleted: number;
    predictionsCorrect: number;
    streakDays: number;
    topicCounts: Record<string, number>;
    hasUsedOverlay: boolean;
  }
): boolean {
  const { unlockCondition } = badge;
  
  switch (unlockCondition.type) {
    case 'experiments_completed':
      return userStats.experimentsCompleted >= unlockCondition.value;
    case 'predictions_correct':
      return userStats.predictionsCorrect >= unlockCondition.value;
    case 'streak':
      return userStats.streakDays >= unlockCondition.value;
    case 'topic_mastery':
      return (userStats.topicCounts[unlockCondition.topic || ''] || 0) >= unlockCondition.value;
    case 'first_time':
      return userStats.hasUsedOverlay;
    default:
      return false;
  }
}
