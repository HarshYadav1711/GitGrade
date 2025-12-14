'use client';

import { CheckCircle2, XCircle, Code } from 'lucide-react';

interface SkillMapProps {
  skillMap: {
    detected: string[];
    missing: string[];
  };
}

export default function SkillMap({ skillMap }: SkillMapProps) {
  return (
    <div className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-primary-600" />
        Skill Map
      </h4>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Detected Skills */}
        <div>
          <h5 className="font-medium text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Detected Skills
          </h5>
          {skillMap.detected.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillMap.detected.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No specific skills detected
            </p>
          )}
        </div>

        {/* Missing Skills */}
        <div>
          <h5 className="font-medium text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Missing Skills
          </h5>
          {skillMap.missing.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skillMap.missing.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium"
                >
                  ✗ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              All key skills present
            </p>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Skills are inferred from repository structure, languages, and configuration files.
      </p>
    </div>
  );
}

