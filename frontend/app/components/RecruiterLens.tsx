'use client';

import { Users, CheckCircle2, XCircle, AlertTriangle, Award } from 'lucide-react';

interface RecruiterLensProps {
  recruiterLens: {
    hireabilityScore: number;
    level: string;
    verdict: string;
    redFlags: string[];
    greenFlags: string[];
  };
}

export default function RecruiterLens({ recruiterLens }: RecruiterLensProps) {
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Senior': 'text-purple-600 dark:text-purple-400',
      'Mid-Level': 'text-blue-600 dark:text-blue-400',
      'Junior': 'text-green-600 dark:text-green-400',
      'Intern': 'text-yellow-600 dark:text-yellow-400',
      'Not Ready': 'text-red-600 dark:text-red-400',
    };
    return colors[level] || 'text-gray-600 dark:text-gray-400';
  };

  const getHireabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
        <Users className="w-6 h-6 text-primary-600" />
        Recruiter Assessment
      </h3>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Hireability Score */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Hireability Score</h4>
          </div>
          <div className={`text-4xl font-bold mb-2 ${getHireabilityColor(recruiterLens.hireabilityScore)}`}>
            {recruiterLens.hireabilityScore}/100
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            How likely recruiters are to consider this candidate
          </p>
        </div>

        {/* Level Assessment */}
        <div className="bg-white dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Recommended Level</h4>
          </div>
          <div className={`text-3xl font-bold mb-2 ${getLevelColor(recruiterLens.level)}`}>
            {recruiterLens.level}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Appropriate position level based on repository quality
          </p>
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Recruiter Verdict</h4>
        <p className="text-blue-800 dark:text-blue-200">{recruiterLens.verdict}</p>
      </div>

      {/* Flags */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Green Flags */}
        <div>
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Green Flags
          </h4>
          {recruiterLens.greenFlags.length > 0 ? (
            <ul className="space-y-2">
              {recruiterLens.greenFlags.map((flag, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No specific green flags identified
            </p>
          )}
        </div>

        {/* Red Flags */}
        <div>
          <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Red Flags
          </h4>
          {recruiterLens.redFlags.length > 0 ? (
            <ul className="space-y-2">
              {recruiterLens.redFlags.map((flag, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No major red flags detected
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

