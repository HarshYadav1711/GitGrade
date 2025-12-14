'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-6" />
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Analyzing Repository
          </h2>
          <div className="space-y-2 w-full max-w-md">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
              Fetching repository data...
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
              Analyzing code structure...
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
              Calculating scores...
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
              Generating AI insights...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

