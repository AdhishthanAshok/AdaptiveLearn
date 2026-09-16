/**
 * Quiz History page for students.
 * Displays total quizzes attempted, correct answers, accuracy percentage,
 * and a scrollable list of past quiz attempts.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchQuizHistory, QuizHistoryStats } from '../../lib/api';
import { isLoggedIn } from '../../lib/auth';
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ClipboardList,
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const [stats, setStats] = useState<QuizHistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/auth');
      return;
    }

    fetchQuizHistory()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-rose-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Quiz History</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <ClipboardList className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-50">{stats?.total_attempted ?? 0}</p>
            <p className="text-xs text-zinc-500 mt-1">Total Attempted</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats?.total_correct ?? 0}</p>
            <p className="text-xs text-zinc-500 mt-1">Correct</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="flex justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400">{stats?.accuracy_percent ?? 0}%</p>
            <p className="text-xs text-zinc-500 mt-1">Accuracy</p>
          </div>
        </div>

        {/* Attempts List */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-300 mb-3">Attempt History</h2>
          {!stats || stats.attempts.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
              <ClipboardList className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500">No quiz attempts yet.</p>
              <p className="text-zinc-600 text-sm mt-1">Start watching videos and taking quizzes!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className={`bg-zinc-900 border rounded-xl p-4 ${
                    attempt.is_correct ? 'border-emerald-500/30' : 'border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 leading-snug">
                        {attempt.question}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1 truncate">
                        Video: {attempt.video_title}
                      </p>
                    </div>
                    {attempt.is_correct ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-md ${
                        attempt.is_correct
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      Your answer: {attempt.selected_option_text}
                    </span>
                    {!attempt.is_correct && (
                      <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
                        Correct: {attempt.correct_option_text}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">
                    {new Date(attempt.attempted_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
