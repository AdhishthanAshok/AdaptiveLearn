/**
 * Authentication page — combined login and register with role selection.
 * Features a premium dark UI with password strength validation feedback.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '../../lib/api';
import { Eye, EyeOff, GraduationCap, BookOpen, LogIn, UserPlus, AlertCircle } from 'lucide-react';

type Mode = 'login' | 'register';
type Role = 'student' | 'educator';

interface PasswordCheck {
  label: string;
  test: (v: string) => boolean;
}

const PASSWORD_CHECKS: PasswordCheck[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One digit', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(v) },
];

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const allChecksPassed = PASSWORD_CHECKS.every((c) => c.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!allChecksPassed) {
          setError('Please meet all password requirements');
          setLoading(false);
          return;
        }
        const data = await registerUser(email, password, role);
        router.push(data.user.role === 'educator' ? '/educator' : '/');
      } else {
        const data = await loginUser(email, password);
        router.push(data.user.role === 'educator' ? '/educator' : '/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">
            Adaptive<span className="text-emerald-500">Learn</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Learn smarter, not harder</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="flex bg-zinc-800 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password strength checklist (register only) */}
            {mode === 'register' && password.length > 0 && (
              <div className="space-y-1.5 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                {PASSWORD_CHECKS.map((check) => {
                  const passed = check.test(password);
                  return (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          passed ? 'bg-emerald-500' : 'bg-zinc-600'
                        }`}
                      />
                      <span className={passed ? 'text-emerald-400' : 'text-zinc-500'}>
                        {check.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Role selector (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === 'student'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <GraduationCap className="w-6 h-6" />
                    <span className="text-sm font-semibold">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('educator')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === 'educator'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <BookOpen className="w-6 h-6" />
                    <span className="text-sm font-semibold">Educator</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-900 shadow-sm mt-2"
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Inactive notice */}
          <p className="text-center text-xs text-zinc-600 mt-6">
            Accounts inactive for 60 days are automatically deleted.
          </p>
        </div>
      </div>
    </div>
  );
}
