/**
 * Educator Dashboard page.
 * Provides forms to upload videos and create quizzes, and lists the educator's content.
 * Protected: requires educator role.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createVideo,
  createQuizForVideo,
  fetchMyVideos,
  Video,
} from '../../lib/api';
import { getUser, isLoggedIn, logout } from '../../lib/auth';
import {
  LogOut,
  Plus,
  Video as VideoIcon,
  HelpCircle,
  CheckCircle2,
  User,
  Trash2,
} from 'lucide-react';

interface QuizOptionInput {
  option_text: string;
  is_correct: boolean;
}

export default function EducatorPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Video form
  const [vTitle, setVTitle] = useState('');
  const [vDesc, setVDesc] = useState('');
  const [vUrl, setVUrl] = useState('');
  const [vDuration, setVDuration] = useState(60);
  const [vDifficulty, setVDifficulty] = useState('medium');
  const [vLoading, setVLoading] = useState(false);
  const [vMsg, setVMsg] = useState('');

  // Quiz form
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [qQuestion, setQQuestion] = useState('');
  const [qTimestamp, setQTimestamp] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qOptions, setQOptions] = useState<QuizOptionInput[]>([
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]);
  const [qLoading, setQLoading] = useState(false);
  const [qMsg, setQMsg] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/auth');
      return;
    }
    const user = getUser();
    if (user?.role !== 'educator') {
      router.replace('/');
      return;
    }

    fetchMyVideos()
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVLoading(true);
    setVMsg('');
    try {
      const video = await createVideo({
        title: vTitle,
        description: vDesc,
        video_url: vUrl,
        duration: vDuration,
        difficulty: vDifficulty,
      });
      setVideos((prev) => [video, ...prev]);
      setVTitle('');
      setVDesc('');
      setVUrl('');
      setVDuration(60);
      setVMsg('Video created successfully!');
    } catch (err: unknown) {
      setVMsg(err instanceof Error ? err.message : 'Failed to create video');
    } finally {
      setVLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoId) return;
    setQLoading(true);
    setQMsg('');
    try {
      await createQuizForVideo(selectedVideoId, {
        question: qQuestion,
        timestamp: qTimestamp,
        explanation: qExplanation,
        options: qOptions.filter((o) => o.option_text.trim()),
      });
      setQQuestion('');
      setQTimestamp(0);
      setQExplanation('');
      setQOptions([
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ]);
      setQMsg('Quiz created successfully!');
    } catch (err: unknown) {
      setQMsg(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setQLoading(false);
    }
  };

  const updateOption = (index: number, field: keyof QuizOptionInput, value: string | boolean) => {
    setQOptions((prev) =>
      prev.map((opt, i) => {
        if (i === index) {
          return { ...opt, [field]: value };
        }
        // If setting is_correct to true, unset others
        if (field === 'is_correct' && value === true) {
          return { ...opt, is_correct: false };
        }
        return opt;
      }),
    );
  };

  const addOption = () => {
    setQOptions((prev) => [...prev, { option_text: '', is_correct: false }]);
  };

  const removeOption = (index: number) => {
    if (qOptions.length <= 2) return;
    setQOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const user = getUser();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Educator <span className="text-emerald-500">Dashboard</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-500">{user?.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-rose-600/80 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-zinc-700/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {/* ────────────── Upload Video Section ────────────── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <VideoIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold">Upload New Video</h2>
          </div>

          <form onSubmit={handleCreateVideo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                <input
                  required
                  value={vTitle}
                  onChange={(e) => setVTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  placeholder="Video title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Video URL</label>
                <input
                  required
                  value={vUrl}
                  onChange={(e) => setVUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  placeholder="/videos/example.mp4"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
              <textarea
                required
                value={vDesc}
                onChange={(e) => setVDesc(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm resize-none"
                placeholder="A short description of the video"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={vDuration}
                  onChange={(e) => setVDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Difficulty</label>
                <select
                  value={vDifficulty}
                  onChange={(e) => setVDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            {vMsg && (
              <p className={`text-sm ${vMsg.includes('success') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {vMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={vLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              {vLoading ? 'Creating...' : 'Create Video'}
            </button>
          </form>
        </section>

        {/* ────────────── My Videos Section ────────────── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">My Videos ({videos.length})</h2>
          {videos.length === 0 ? (
            <p className="text-zinc-500 text-sm">No videos yet. Create your first one above!</p>
          ) : (
            <div className="space-y-2">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 bg-zinc-800 border border-zinc-700/50 rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-200 truncate">{v.title}</p>
                    <p className="text-xs text-zinc-500">
                      {v.duration}s • {v.difficulty} • {v.view_count} views
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVideoId(v.id)}
                    className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedVideoId === v.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
                    Add Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ────────────── Add Quiz Section ────────────── */}
        {selectedVideoId && (
          <section className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold">
                Add Quiz to:{' '}
                <span className="text-emerald-400">
                  {videos.find((v) => v.id === selectedVideoId)?.title}
                </span>
              </h2>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Question</label>
                <input
                  required
                  value={qQuestion}
                  onChange={(e) => setQQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  placeholder="What is the question?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Timestamp (seconds)</label>
                  <input
                    type="number"
                    min={0}
                    value={qTimestamp}
                    onChange={(e) => setQTimestamp(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Explanation</label>
                  <input
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                    placeholder="Why is this the correct answer?"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Options (mark one as correct)
                </label>
                <div className="space-y-2">
                  {qOptions.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateOption(i, 'is_correct', true)}
                        className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                          opt.is_correct
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                        }`}
                        title={opt.is_correct ? 'Correct answer' : 'Mark as correct'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <input
                        required
                        value={opt.option_text}
                        onChange={(e) => updateOption(i, 'option_text', e.target.value)}
                        className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                        placeholder={`Option ${i + 1}`}
                      />
                      {qOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(i)}
                          className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 text-xs text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  + Add another option
                </button>
              </div>

              {qMsg && (
                <p className={`text-sm ${qMsg.includes('success') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {qMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={qLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                {qLoading ? 'Creating...' : 'Create Quiz'}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
