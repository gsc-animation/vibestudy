export interface ParentInsightStatistics {
  totalExperiments: number;
  successRate: number;
  favoriteTopics: string[];
  recentActivity: string;
  predictionsAccuracy: number;
  areasForImprovement: string[];
  strengths: string[];
}

export interface ParentInsightResponse {
  childId: string;
  generatedAt: string;
  weeklyInsight: string;
  statistics: ParentInsightStatistics;
  recommendations: string[];
}
