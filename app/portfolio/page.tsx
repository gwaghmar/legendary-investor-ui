'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PortfolioVoiceInput } from '@/components/portfolio-voice-input';
import { WatchlistView } from '@/components/watchlist-view';
import { createClient } from '@/lib/supabase/client';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Load User & Data
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // Fetch Portfolio
        const { data: portfolioData } = await supabase
          .from('portfolios')
          .select('symbol, shares');

        if (portfolioData && portfolioData.length > 0) {
          const formatted = portfolioData.map(p => `${p.symbol} - ${p.shares}`).join('\n');
          setPortfolioInput(formatted);
        }

        // Fetch Watchlist (Future integration)
      }
      setLoading(false);
    };
    loadData();
  }, []);

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
          shares: match[2] ? parseFloat(match[2]) : (activeTab === 'watchlist' ? 0 : 1),
        });
      }
    }
    return holdings;
  }, [currentInput, activeTab]);

  const loadSample = () => {
    setInput(samplePortfolio);
  };

  const handleSaveAndAnalyze = async () => {
    if (parsedHoldings.length === 0) return;
    setSaving(true);

    if (isAuthenticated && activeTab === 'portfolio') {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // 1. Delete existing (Simple sync strategy)
          await supabase.from('portfolios').delete().eq('user_id', user.id);

          // 2. Insert new
          const rows = parsedHoldings.map(h => ({
            user_id: user.id,
            symbol: h.symbol,
            shares: h.shares
          }));

          const { error } = await supabase.from('portfolios').insert(rows);
          if (error) throw error;
        }
      } catch (e) {
        console.error("Failed to save portfolio:", e);
        alert("Failed to save to database, but proceeding to analysis.");
      }
    }

    // Encode holdings in URL (Still used for the Analysis page to keep it stateless/shareable for now)
    const holdingsParam = parsedHoldings
      .map((h) => `${h.symbol}:${h.shares}`)
      .join(',');

    setSaving(false);
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

      <main className="flex-1 pt-12 px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <span>&larr;</span> Back to Home
          </Link>

          {/* Toggle Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight flex items-center gap-3">
              {activeTab === 'portfolio' ? 'Your Portfolio' : 'Watchlist'}
              {loading && <span className="text-xs text-muted-foreground font-normal animate-pulse">(Loading...)</span>}
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

          {!isAuthenticated && !loading && (
            <div className="bg-blue-50/50 border border-blue-200 p-4 mb-6 rounded text-sm text-blue-800 flex justify-between items-center">
              <span>
                <strong>Tip:</strong> <Link href="/login" className="underline">Sign In</Link> to save your portfolio permanently across devices.
              </span>
              <Link href="/login" className="bg-blue-600 text-white px-3 py-1.5 rounded font-bold text-xs uppercase hover:bg-blue-700">
                Sign In
              </Link>
            </div>
          )}

          {activeTab === 'portfolio' ? (
            <>
              <p className="text-muted-foreground mb-4 text-sm">
                Enter your holdings below. We'll analyze them for you.
              </p>

              <PortfolioVoiceInput onHoldingsParsed={handleVoiceParsed} />

              <div className="relative">
                <textarea
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  placeholder={`NVDA - 59\nSOFI - 67\nPLTR - 6`}
                  className="w-full h-64 border-2 border-foreground bg-background p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-foreground resize-none transition-all"
                />
                {isAuthenticated && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold">
                      CLOUD SYNC ON
                    </span>
                  </div>
                )}
              </div>

              {/* Parsed Holdings Preview */}
              {parsedHoldings.length > 0 && (
                <div className="mt-4 border-2 border-foreground p-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-tight mb-2">
                    Parsed: {parsedHoldings.length} Assets
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedHoldings.map((holding, i) => (
                      <span
                        key={i}
                        className="border border-foreground px-2 py-1 text-sm bg-background/50 font-mono"
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
          {activeTab === 'portfolio' && (
            <button
              onClick={handleSaveAndAnalyze}
              disabled={parsedHoldings.length === 0 || saving}
              className="w-full mt-6 bg-foreground text-background py-3 font-bold uppercase tracking-tight hover:bg-foreground/80 transition-colors disabled:bg-muted-foreground disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                isAuthenticated ? 'Save & Analyze Portfolio' : 'Analyze Portfolio'
              )}
            </button>
          )}

          {/* Sample Portfolio Link */}
          {!portfolioInput && (
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">Or try: </span>
              <button
                onClick={loadSample}
                className="text-sm underline hover:no-underline"
              >
                Load Sample Portfolio
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
