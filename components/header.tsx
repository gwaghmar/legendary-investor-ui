'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <header className="bg-background border-b-2 border-foreground w-full">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-foreground flex items-center justify-center font-bold text-sm">
            LI
          </div>
          <span className="font-bold uppercase tracking-tight hidden sm:inline">
            Legendary Investor
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all hidden md:block"
          >
            Home
          </Link>
          <Link
            href="/screener"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all hidden md:block"
          >
            Screener
          </Link>
          <Link
            href="/council"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all"
          >
            Council
          </Link>
          <Link
            href="/data"
            className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all"
          >
            Data
          </Link>

          {/* Authenticated Routes */}
          {user && (
            <Link
              href="/portfolio"
              className="text-sm font-medium border-2 border-transparent px-3 py-2 hover:border-foreground hover:bg-foreground/5 transition-all"
            >
              Portfolio
            </Link>
          )}

          {/* Auth State */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href="/dashboard"
                    className="text-sm font-bold bg-foreground text-background px-3 py-2 hover:bg-foreground/80 transition-all"
                  >
                    Dashboard
                  </Link>
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
                  className="text-sm font-bold bg-foreground text-background px-4 py-2 hover:bg-foreground/80 transition-all ml-2"
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
