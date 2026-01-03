'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Lightbulb, RefreshCw } from 'lucide-react';

interface ParentInsight {
  childId: string;
  generatedAt: string;
  weeklyInsight: string;
  statistics: {
    totalExperiments: number;
    successRate: number;
    favoriteTopics: string[];
    predictionsAccuracy: number;
    strengths: string[];
    areasForImprovement: string[];
  };
  recommendations: string[];
}

interface ParentInsightCardProps {
  childId: string;
}

export function ParentInsightCard({ childId }: ParentInsightCardProps) {
  const [insight, setInsight] = useState<ParentInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/parent-insight?userId=parent1&childId=${childId}`);
      if (!res.ok) throw new Error('Failed to fetch insight');
      const data = await res.json();
      setInsight(data);
    } catch {
      setError('Unable to load insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-red-500">{error}</p>
        <button onClick={fetchInsight} className="mt-2 text-blue-600 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">AI Scrum Master Insights</h2>
        </div>
        <button
          onClick={fetchInsight}
          className="p-2 hover:bg-white/50 rounded-full transition"
          title="Refresh insights"
        >
          <RefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Weekly Insight */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-gray-700 leading-relaxed">{insight.weeklyInsight}</p>
        <p className="text-xs text-gray-400 mt-2">
          Generated: {new Date(insight.generatedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{insight.statistics.totalExperiments}</p>
          <p className="text-xs text-gray-500">Experiments</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{insight.statistics.successRate}%</p>
          <p className="text-xs text-gray-500">Success Rate</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <Lightbulb className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-800">{insight.statistics.predictionsAccuracy}%</p>
          <p className="text-xs text-gray-500">Prediction Accuracy</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <span className="text-xl">🧲</span>
          <p className="text-sm font-medium text-gray-800 mt-1">{insight.statistics.favoriteTopics[0]}</p>
          <p className="text-xs text-gray-500">Favorite Topic</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span>💡</span> Recommendations for Parents
        </h3>
        <ul className="space-y-2">
          {insight.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-purple-500 mt-0.5">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
