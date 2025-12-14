'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Activity } from 'lucide-react';

interface TimelineChartProps {
  timeline: {
    commits: Array<{ date: string; count: number }>;
    activityScore: number;
  };
}

export default function TimelineChart({ timeline }: TimelineChartProps) {
  // Format data for chart (show last 30 data points or all if less)
  const chartData = timeline.commits
    .slice(-30)
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      commits: item.count,
    }));

  const getActivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Repository Activity Timeline
        </h4>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Activity Score:</span>
          <span className={`font-bold ${getActivityColor(timeline.activityScore)}`}>
            {timeline.activityScore}/100
          </span>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          No commit data available
        </div>
      )}
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Shows commit activity over time. Higher activity indicates consistent development.
      </p>
    </div>
  );
}

