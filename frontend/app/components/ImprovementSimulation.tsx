'use client';

import { TrendingUp, Target } from 'lucide-react';

interface RoadmapItem {
  priority: number;
  title: string;
  estimatedImpact: number;
}

interface ImprovementSimulationProps {
  currentScore: number;
  roadmap: RoadmapItem[];
}

export default function ImprovementSimulation({ currentScore, roadmap }: ImprovementSimulationProps) {
  // Calculate potential improvement
  const top3Impact = roadmap
    .slice(0, 3)
    .reduce((sum, item) => sum + item.estimatedImpact, 0);
  
  const predictedScore = Math.min(100, currentScore + top3Impact);
  const improvement = predictedScore - currentScore;

  // Determine level upgrade
  const getLevel = (score: number) => {
    if (score >= 80) return 'Mid-Level';
    if (score >= 60) return 'Junior';
    if (score >= 40) return 'Intern';
    return 'Beginner';
  };

  const currentLevel = getLevel(currentScore);
  const predictedLevel = getLevel(predictedScore);
  const levelUpgrade = currentLevel !== predictedLevel;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary-600" />
        Improvement Simulation
      </h4>
      
      <div className="grid md:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Score</div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentScore}/100
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Level: {currentLevel}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Predicted Score</div>
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
            {predictedScore}/100
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Level: {predictedLevel}
            {levelUpgrade && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                ⬆ Upgrade!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-700 rounded-lg p-4 mb-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          If you follow the top 3 roadmap items:
        </div>
        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          +{improvement} points improvement
        </div>
        {levelUpgrade && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
            🎉 You could advance from {currentLevel} to {predictedLevel}!
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 dark:text-gray-400">
        * Predictions are based on estimated impact of roadmap items. Actual results may vary.
      </div>
    </div>
  );
}

