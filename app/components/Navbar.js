'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, LogOut, Bookmark } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    setUserEmail(email);
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('recipe_token');
    localStorage.removeItem('user_email');
    setUserEmail(null); 
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/recipe-generator" className="flex items-center">
            <ChefHat className="h-8 w-8 text-emerald-500" />
            <span className="ml-3 font-bold text-xl text-slate-800">AI Recipe Generator</span>
          </Link>
          <div className="flex items-center gap-4">
            {userEmail && (
              <>
                <Link href="/saved-recipes" className="flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-600 bg-slate-100 hover:bg-slate-200 transition">
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
