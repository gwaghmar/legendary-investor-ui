'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PortfolioVoiceInput } from '@/components/portfolio-voice-input';
import { WatchlistView } from '@/components/watchlist-view';

interface ParsedHolding {
  symbol: string;
  shares: number;
}

const samplePortfolio = `NVDA - 59
SOFI - 67
PLTR - 6
TSM - 3.3
AMC - 303`;

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist'>('portfolio');
  const [portfolioInput, setPortfolioInput] = useState('');
  const [watchlistInput, setWatchlistInput] = useState('');

  const router = useRouter();

  // Get current input based on tab
  const currentInput = activeTab === 'portfolio' ? portfolioInput : watchlistInput;
  const setInput = activeTab === 'portfolio' ? setPortfolioInput : setWatchlistInput;

  const parsedHoldings = useMemo<ParsedHolding[]>(() => {
    const lines = currentInput.split('\n').filter((line) => line.trim());
    const holdings: ParsedHolding[] = [];

    for (const line of lines) {
      // Match patterns like "NVDA - 59", "NVDA 59", "NVDA: 59", "NVDA,59"
      const match = line.match(/^([A-Za-z]{1,5})\s*[-:,]?\s*(\d*\.?\d*)/);
      if (match) {
        holdings.push({
          symbol: match[1].toUpperCase(),
          shares: match[2] ? parseFloat(match[2]) : (activeTab === 'watchlist' ? 0 : 1), // Default 0 shares for watchlist, 1 for portfolio
        });
      }
    }

    return holdings;
  }, [currentInput, activeTab]);

  const loadSample = () => {
    setInput(samplePortfolio);
  };

  const handleSubmit = () => {
    if (parsedHoldings.length === 0) return;

    // Encode holdings in URL
    const holdingsParam = parsedHoldings
      .map((h) => `${h.symbol}:${h.shares}`)
      .join(',');

    router.push(`/portfolio/analysis?type=${activeTab}&holdings=${encodeURIComponent(holdingsParam)}`);
  };

  const handleVoiceParsed = (holdings: { symbol: string; shares: number }[]) => {
    const formatted = holdings.map(h => `${h.symbol} - ${h.shares}`).join('\n');
    setInput(prev => {
      const cleanPrev = prev.trim();
      return cleanPrev ? `${cleanPrev}\n${formatted}` : formatted;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <span>&larr;</span> Back to Debate
          </Link>

          {/* Toggle Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              {activeTab === 'portfolio' ? 'Add Your Portfolio' : 'Create Watchlist'}
            </h1>

            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-1.5 text-sm font-bold uppercase transition-all rounded-md ${activeTab === 'portfolio'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`px-4 py-1.5 text-sm font-bold uppercase transition-all rounded-md ${activeTab === 'watchlist'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                Watchlist
              </button>
            </div>
          </div>

          {activeTab === 'portfolio' ? (
            <>
              <p className="text-muted-foreground mb-8">
                Enter holdings: SYMBOL - SHARES (e.g., NVDA - 10)
              </p>

              <PortfolioVoiceInput onHoldingsParsed={handleVoiceParsed} />

              <textarea
                value={portfolioInput}
                onChange={(e) => setPortfolioInput(e.target.value)}
                placeholder={`NVDA - 59\nSOFI - 67\nPLTR - 6`}
                className="w-full h-64 border-2 border-foreground bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-none transition-all"
              />

              {/* Parsed Holdings Preview */}
              {parsedHoldings.length > 0 && (
                <div className="mt-4 border-2 border-foreground p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-tight mb-2">
                    Parsed Holdings
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedHoldings.map((holding) => (
                      <span
                        key={holding.symbol}
                        className="border border-foreground px-2 py-1 text-sm bg-background/50"
                      >
                        {holding.symbol}: {holding.shares}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <WatchlistView />
          )}

          {/* Submit Button */}
          {/* Submit Button - Only for Portfolio now */}
          {activeTab === 'portfolio' && (
            <button
              onClick={handleSubmit}
              disabled={parsedHoldings.length === 0}
              className="w-full mt-6 bg-foreground text-background py-3 font-bold uppercase tracking-tight hover:bg-foreground/80 transition-colors disabled:bg-muted-foreground disabled:cursor-not-allowed"
            >
              Analyze My Portfolio
            </button>
          )}

          {/* Sample Portfolio Link */}
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">Or try: </span>
            <button
              onClick={loadSample}
              className="text-sm underline hover:no-underline"
            >
              Load Sample Portfolio
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
