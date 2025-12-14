'use client';

import { Trophy } from 'lucide-react';

interface ScoreCardProps {
  scoring: {
    percentage: number;
    grade: string;
    totalScore: number;
    maxScore: number;
  };
}

export default function ScoreCard({ scoring }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={`${getScoreBgColor(scoring.percentage)} p-6 rounded-full`}>
            <Trophy className={`w-12 h-12 ${getScoreColor(scoring.percentage)}`} />
          </div>
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className={`text-6xl font-bold ${getScoreColor(scoring.percentage)}`}>
                {scoring.percentage}
              </span>
              <span className="text-2xl text-gray-500 dark:text-gray-400">/ 100</span>
              <span className={`text-3xl font-semibold ${getScoreColor(scoring.percentage)}`}>
                {scoring.grade}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {scoring.totalScore} out of {scoring.maxScore} points
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Overall Score</div>
          <div className={`text-2xl font-bold ${getScoreColor(scoring.percentage)}`}>
            {scoring.percentage}%
          </div>
        </div>
      </div>
    </div>
  );
}

