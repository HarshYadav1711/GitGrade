'use client';

import { useState } from 'react';
import { Search, Github, TrendingUp, Target, Users } from 'lucide-react';
import AnalysisResults from './components/AnalysisResults';
import LoadingState from './components/LoadingState';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze repository');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Github className="w-12 h-12 text-primary-600" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              GitGrade
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            AI-Powered Repository Evaluation Platform
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            See your GitHub repository through a recruiter&apos;s eyes
          </p>
        </div>

        {/* Input Section */}
        {!results && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Multi-Dimensional Scoring</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive evaluation across code quality, structure, documentation, and more
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <Target className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Personalized Roadmap</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Actionable steps to improve your repository with impact estimates
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <Users className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Recruiter Lens</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See how recruiters evaluate your repository and identify red flags
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Results */}
        {results && (
          <AnalysisResults
            results={results}
            onNewAnalysis={() => {
              setResults(null);
              setRepoUrl('');
            }}
          />
        )}
      </div>
    </main>
  );
}

