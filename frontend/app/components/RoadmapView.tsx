'use client';

import { MapPin, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';

interface RoadmapItem {
  priority: number;
  title: string;
  description: string;
  why: string;
  how: string;
  estimatedImpact: number;
}

interface RoadmapViewProps {
  roadmap: RoadmapItem[];
}

export default function RoadmapView({ roadmap }: RoadmapViewProps) {
  const sortedRoadmap = [...roadmap].sort((a, b) => a.priority - b.priority);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        <MapPin className="w-6 h-6 text-primary-600" />
        Personalized Improvement Roadmap
      </h3>
      
      <div className="space-y-4">
        {sortedRoadmap.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 dark:text-primary-400 font-bold">
                    {item.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">+{item.estimatedImpact} pts</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {item.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-sm text-blue-900 dark:text-blue-300">
                        Why it matters
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {item.why}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-sm text-green-900 dark:text-green-300">
                        How to do it
                      </span>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {item.how}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

