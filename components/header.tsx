'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { SearchHistory, saveToHistory } from './search-history';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    saveToHistory(searchQuery);
    setIsSearchFocused(false);
    // Force full navigation to ensure fresh state
    window.location.href = `/analyze/${searchQuery.toUpperCase()}`;
  };

  return (
    <header className="bg-background border-b-2 border-foreground w-full">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center font-bold text-sm">
            LI
          </div>
          <span className="font-bold uppercase tracking-tight hidden sm:inline">
            Legendary Investor
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search ticker (e.g. AAPL)..."
              className="w-full bg-background border-2 border-foreground px-3 py-1.5 pr-10 text-sm focus:outline-none focus:bg-foreground/5 placeholder:text-muted-foreground font-mono transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // Delay to allow click
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              🔍
            </button>
          </form>
          <SearchHistory
            isOpen={isSearchFocused}
            onSelect={(ticker) => {
              setSearchQuery(ticker);
              window.location.href = `/analyze/${ticker}`;
            }}
          />
        </div>

        <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link
            href="/screener"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all hidden md:block"
          >
            Screener
          </Link>
          <Link
            href="/council"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all hidden md:block"
          >
            Council
          </Link>
          <Link
            href="/data"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all text-xs sm:text-sm"
          >
            Data
          </Link>

          <Link
            href="/macro"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all text-xs sm:text-sm hidden sm:block"
          >
            Macro
          </Link>

          {/* Authenticated Routes */}
          {user && (
            <Link
              href="/portfolio"
              className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all hidden sm:block"
            >
              Portfolio
            </Link>
          )}

          {/* Auth State */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-bold bg-foreground text-background px-3 py-1.5 hover:bg-foreground/80 transition-all ml-2"
                >
                  Join
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
