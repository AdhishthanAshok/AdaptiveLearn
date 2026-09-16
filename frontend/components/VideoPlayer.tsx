/**
 * This component is responsible for rendering the video playback interface.
 * It features a disciplined, high-contrast UI with clear interaction states.
 */
'use client';

import { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, PlayCircle, Eye, BarChart } from 'lucide-react';
import { Video, Quiz, fetchQuiz, incrementVideoView } from '../lib/api';
import QuizOverlay from './QuizOverlay';

interface VideoPlayerProps {
  video: Video;
  isActive: boolean;
}

export default function VideoPlayer({ video, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (isActive) {
      fetchQuiz(video.id).then(data => setQuiz(data)).catch(console.error);
    } else {
      setViewCounted(false);
    }
  }, [isActive, video.id]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      if (!showQuiz) {
        videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        videoRef.current.pause();
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActive, showQuiz]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    // View tracking logic: 3 seconds watch time = 1 view
    if (videoRef.current.currentTime > 3 && !viewCounted && isActive) {
      setViewCounted(true);
      incrementVideoView(video.id).catch(console.error);
    }
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setQuizCompleted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden snap-start flex-shrink-0 group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.video_url}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        playsInline
        loop
        controls
      />
      
      {/* Side Navigation Panel - Action Buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10 pointer-events-auto">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col items-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          aria-label="Like video"
        >
          <div className={`p-3 rounded-full transition-colors duration-200 ${isLiked ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-600'}`}>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-xs font-medium text-zinc-200 drop-shadow-md">Like</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          aria-label="Comment"
        >
          <div className="p-3 rounded-full bg-zinc-800/80 text-zinc-200 transition-colors duration-200 hover:bg-zinc-700 active:bg-zinc-600">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-zinc-200 drop-shadow-md">12</span>
        </button>

        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex flex-col items-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          aria-label="Bookmark"
        >
          <div className={`p-3 rounded-full transition-colors duration-200 ${isBookmarked ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 active:bg-zinc-600'}`}>
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-xs font-medium text-zinc-200 drop-shadow-md">Save</span>
        </button>

        <button 
          className="flex flex-col items-center gap-1 group/btn focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          aria-label="Share"
        >
          <div className="p-3 rounded-full bg-zinc-800/80 text-zinc-200 transition-colors duration-200 hover:bg-zinc-700 active:bg-zinc-600">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-zinc-200 drop-shadow-md">Share</span>
        </button>
      </div>

      {/* Bottom Information Bar - Title, Description, and Views/Quiz */}
      <div className="absolute bottom-16 left-0 right-16 px-4 py-4 bg-gradient-to-t from-zinc-950/95 via-zinc-900/60 to-transparent pointer-events-none flex flex-col justify-end">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-50 tracking-tight leading-snug mb-1.5">{video.title}</h2>
        <p className="text-sm md:text-base text-zinc-300 font-medium line-clamp-2 max-w-[90%] mb-4 leading-relaxed">{video.description}</p>
        
        <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/90 text-zinc-200 rounded-md text-sm font-semibold border border-zinc-700/50 shadow-sm">
              <BarChart className="w-4 h-4 text-emerald-400" />
              <span className="capitalize">{video.difficulty}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/90 text-zinc-200 rounded-md text-sm font-semibold border border-zinc-700/50 shadow-sm">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{video.view_count} views</span>
            </div>
          </div>

          {/* Take Quiz Button alongside views */}
          {quiz && !showQuiz && !quizCompleted && (
            <button
              onClick={() => {
                setShowQuiz(true);
                if (videoRef.current) videoRef.current.pause();
              }}
              className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 text-white text-sm font-bold rounded-md shadow-sm transition-all duration-200"
            >
              <PlayCircle className="w-4 h-4" />
              Take Quiz
            </button>
          )}
        </div>
      </div>

      {showQuiz && quiz && (
        <QuizOverlay quiz={quiz} onClose={handleQuizClose} />
      )}
    </div>
  );
}
