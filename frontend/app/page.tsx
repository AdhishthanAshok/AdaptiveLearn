/**
 * This is the main page component of the application (Student Feed).
 * It fetches the initial video feed from the backend and renders a vertical, scrollable list of videos.
 * Protected: redirects to /auth if not logged in.
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchFeed, Video } from '../lib/api';
import { getUser, isLoggedIn, logout } from '../lib/auth';
import VideoPlayer from '../components/VideoPlayer';
import { LogOut, History, User } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/auth');
      return;
    }
    const user = getUser();
    if (user?.role === 'educator') {
      router.replace('/educator');
      return;
    }

    fetchFeed()
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeVideoIndex) {
      setActiveVideoIndex(index);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const user = getUser();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white flex-col gap-4">
        <p className="text-xl">No videos available.</p>
        <p className="text-slate-400">Did you run the seed script?</p>
      </div>
    );
  }

  return (
    <main className="h-[100dvh] w-full max-w-md mx-auto bg-black relative overflow-hidden sm:border-x sm:border-slate-800">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-zinc-950/90 to-transparent">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600/20 rounded-lg">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-zinc-300 truncate max-w-[140px]">
              {user?.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/history')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition-colors border border-zinc-700/50"
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 hover:bg-rose-600/80 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-zinc-700/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Video Feed */}
      <div
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar flex flex-col"
        onScroll={handleScroll}
      >
        {videos.map((video, index) => (
          <VideoPlayer
            key={video.id}
            video={video}
            isActive={index === activeVideoIndex}
          />
        ))}
      </div>
    </main>
  );
}
