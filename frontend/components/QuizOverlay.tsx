/**
 * This component renders the interactive quiz overlay on top of the video player.
 * It handles displaying the question, options, capturing user selection, and showing feedback (correct/incorrect and explanation).
 */
'use client';

import { useState } from 'react';
import { Quiz, submitAnswer, AnswerResponse } from '../lib/api';

interface QuizOverlayProps {
  quiz: Quiz;
  onClose: () => void;
}

export default function QuizOverlay({ quiz, onClose }: QuizOverlayProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    setIsSubmitting(true);
    try {
      const res = await submitAnswer(quiz.id, selectedOption);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/85 z-50 flex flex-col items-center justify-center p-6 text-zinc-50 animate-in fade-in duration-300">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-6 text-zinc-50 leading-snug">{quiz.question}</h3>
        
        <div className="space-y-3 mb-6">
          {quiz.options.map((option) => (
            <button
              key={option.id}
              disabled={!!result}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full text-left p-4 rounded-xl border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all duration-200 font-medium ${
                result
                  ? option.id === result.correct_option_id
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                    : option.id === selectedOption
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-400'
                    : 'bg-zinc-950 border-zinc-800 opacity-50'
                  : selectedOption === option.id
                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400'
                  : 'bg-zinc-950 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              {option.option_text}
            </button>
          ))}
        </div>

        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 shadow-sm"
          >
            {isSubmitting ? 'Checking...' : 'Submit Answer'}
          </button>
        ) : (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <div className={`p-4 rounded-xl mb-4 border ${result.is_correct ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <p className="font-bold mb-1">{result.is_correct ? 'Correct!' : 'Incorrect'}</p>
              <p className="text-sm opacity-90 leading-relaxed text-zinc-300">{result.explanation}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 shadow-sm"
            >
              Continue Learning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
