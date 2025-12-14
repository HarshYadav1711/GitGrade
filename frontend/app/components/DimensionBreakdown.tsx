'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface Dimension {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  reasons: string[];
  signals: Record<string, any>;
}

interface DimensionBreakdownProps {
  dimensions: Dimension[];
}

export default function DimensionBreakdown({ dimensions }: DimensionBreakdownProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Detailed Score Breakdown
      </h3>
      {dimensions.map((dimension, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleExpand(index)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex-1 text-left">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {dimension.name}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {dimension.score}/{dimension.maxScore} points
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getScoreColor(dimension.percentage)}`}
                  style={{ width: `${dimension.percentage}%` }}
                />
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <span className={`text-lg font-bold ${getScoreColor(dimension.percentage).replace('bg-', 'text-')}`}>
                {dimension.percentage}%
              </span>
              {expanded[index] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </button>

          {expanded[index] && (
            <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h5 className="font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Why this score?
                </h5>
                <ul className="space-y-1">
                  {dimension.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Detected Signals
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.entries(dimension.signals).map(([key, value]) => (
                    <div key={key} className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{key}:</span>{' '}
                      <span className="text-gray-800 dark:text-gray-300">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

