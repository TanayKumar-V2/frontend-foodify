'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AtSign, KeyRound, LoaderCircle, ChefHat, UserPlus } from 'lucide-react';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('recipe_token');
    if (token) {
      router.push('/recipe-generator');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage('');

    const endpoint = isLoginMode ? '/api/signin' : '/api/signup';
    const url = `https://foodify-backend-1qug.onrender.com${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      if (isLoginMode) {
        localStorage.setItem('recipe_token', data.token);
        localStorage.setItem('user_email', email);
        router.push('/recipe-generator');
      } else {
        setMessage(data.message);
        setIsLoginMode(true); 
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <ChefHat className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {isLoginMode ? 'Welcome Back!' : 'Create Your Account'}
            </h1>
            <p className="mt-2 text-slate-600">
              {isLoginMode ? 'Sign in to continue' : 'Get started with your personal recipe AI'}
            </p>
          </div>

          {error && <p className="mb-4 text-center text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
          {message && <p className="mb-4 text-center text-sm text-green-600 bg-green-100 p-2 rounded-md">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-emerald-600 shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition disabled:bg-slate-400"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin h-5 w-5" />
              ) : (
                isLoginMode ? 'Sign In' : <UserPlus className="h-5 w-5" />
              )}
              {isLoading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLoginMode(!isLoginMode)} className="font-medium text-emerald-600 hover:text-emerald-500">
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
