'use client';

import { useState } from 'react';
import { ArrowLeft, Trophy, FileText, Map, TrendingUp, Users, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import ScoreCard from './ScoreCard';
import DimensionBreakdown from './DimensionBreakdown';
import RoadmapView from './RoadmapView';
import RecruiterLens from './RecruiterLens';
import TimelineChart from './TimelineChart';
import SkillMap from './SkillMap';
import ImprovementSimulation from './ImprovementSimulation';

interface AnalysisResultsProps {
  results: any;
  onNewAnalysis: () => void;
}

export default function AnalysisResults({ results, onNewAnalysis }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'recruiter' | 'breakdown'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Trophy },
    { id: 'breakdown', label: 'Score Breakdown', icon: FileText },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'recruiter', label: 'Recruiter Lens', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onNewAnalysis}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Analyze Another Repository
        </button>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {results.repository.fullName}
              </h2>
              {results.repository.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {results.repository.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href={results.repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <span>View on GitHub</span>
                </a>
                <span className="text-gray-500">
                  ⭐ {results.repository.stars} stars
                </span>
                <span className="text-gray-500">
                  🍴 {results.repository.forks} forks
                </span>
                <span className="text-gray-500">
                  Languages: {Object.keys(results.repository.languages).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Card */}
      <ScoreCard scoring={results.scoring} />

      {/* AI Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI Summary</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {results.aiAnalysis.summary.summary}
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Strengths
            </h4>
            <ul className="space-y-1">
              {results.aiAnalysis.summary.strengths.map((strength: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                  • {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Areas for Improvement
            </h4>
            <ul className="space-y-1">
              {results.aiAnalysis.summary.weaknesses.map((weakness: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                  • {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <TimelineChart timeline={results.timeline} />
              <SkillMap skillMap={results.aiAnalysis.skillMap} />
              <ImprovementSimulation
                currentScore={results.scoring.percentage}
                roadmap={results.aiAnalysis.roadmap}
              />
            </div>
          )}
          
          {activeTab === 'breakdown' && (
            <DimensionBreakdown dimensions={results.scoring.dimensions} />
          )}
          
          {activeTab === 'roadmap' && (
            <RoadmapView roadmap={results.aiAnalysis.roadmap} />
          )}
          
          {activeTab === 'recruiter' && (
            <RecruiterLens recruiterLens={results.aiAnalysis.recruiterLens} />
          )}
        </div>
      </div>
    </div>
  );
}

