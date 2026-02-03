'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

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

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="text-sm border-2 border-transparent px-3 py-1.5 hover:border-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/screener"
            className="text-sm border-2 border-transparent px-3 py-1.5 hover:border-foreground transition-colors"
          >
            Screener
          </Link>
          <Link
            href="/council"
            className="text-sm border-2 border-transparent px-3 py-1.5 hover:border-foreground transition-colors"
          >
            Council
          </Link>
          <Link
            href="/data"
            className="text-sm border-2 border-transparent px-3 py-1.5 hover:border-foreground transition-colors"
          >
            Data
          </Link>
          <Link
            href="/portfolio"
            className="text-sm border-2 border-transparent px-3 py-1.5 hover:border-foreground transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/dashboard"
            className="text-sm bg-foreground text-background px-3 py-1.5 hover:bg-foreground/80 transition-colors"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
