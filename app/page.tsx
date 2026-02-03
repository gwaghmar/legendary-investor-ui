'use client';

import Link from 'next/link';
import { Header } from '@/components/header';
import { MarketTicker } from '@/components/market-ticker';
import { LegendCharacter } from '@/components/legend-character';
import { DebateBox } from '@/components/debate-box';
import { Footer } from '@/components/footer';
import { legends, type LegendId } from '@/lib/legends';
import { useState, useEffect } from 'react';

const featuredLegends: LegendId[] = ['buffett', 'munger', 'druckenmiller', 'burry', 'lynch'];

export default function HomePage() {
  const [activeLegend, setActiveLegend] = useState<LegendId | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const input = document.getElementById('active-legend') as HTMLInputElement;
      if (input) {
        setActiveLegend((input.value as LegendId) || null);
      }
    });

    const checkInput = () => {
      const input = document.getElementById('active-legend');
      if (input) {
        observer.observe(input, { attributes: true, attributeFilter: ['value'] });
        const initialValue = (input as HTMLInputElement).value;
        if (initialValue) {
          setActiveLegend(initialValue as LegendId);
        }
      } else {
        setTimeout(checkInput, 100);
      }
    };

    checkInput();

    const interval = setInterval(() => {
      const input = document.getElementById('active-legend') as HTMLInputElement;
      if (input && input.value !== activeLegend) {
        setActiveLegend((input.value as LegendId) || null);
      }
    }, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [activeLegend]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-[100] w-full bg-background">
        <MarketTicker />
        <Header />
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-6 sm:py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
              The Legendary Debate
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              Live AI discussion on today&apos;s market
            </p>
            <div className="flex justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                ● LIVE AI
              </span>
              <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Real-Time Data
              </span>
            </div>

            {/* Character Row */}
            <div className="flex justify-center gap-4 sm:gap-8 mb-8 overflow-x-auto py-4">
              {featuredLegends.map((id) => (
                <LegendCharacter
                  key={id}
                  legend={legends[id]}
                  isActive={activeLegend === id}
                  isSpeaking={activeLegend === id}
                  size="md"
                />
              ))}
            </div>

            {/* Debate Box */}
            <DebateBox />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 border-t-2 border-b-2 border-foreground border-dashed">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-4">
              Want Their Opinion on YOUR Portfolio?
            </h2>
            <p className="text-muted-foreground mb-6">
              Add your holdings and get personalized analysis from all 7 legendary frameworks
            </p>
            <Link
              href="/portfolio"
              className="inline-block bg-foreground text-background px-8 py-3 font-bold uppercase tracking-tight hover:bg-foreground/80 transition-colors"
            >
              Analyze My Portfolio
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-foreground p-6">
                <div className="text-2xl mb-3">LIVE</div>
                <h3 className="font-bold uppercase mb-2">Live Debates</h3>
                <p className="text-sm text-muted-foreground">
                  Watch legendary investors argue about today&apos;s market conditions, stock picks, and macro trends in real-time AI discussions.
                </p>
              </div>

              <div className="border-2 border-foreground p-6">
                <div className="text-2xl mb-3">ANALYSIS</div>
                <h3 className="font-bold uppercase mb-2">Portfolio Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized opinions from 7 legendary investment frameworks on your actual holdings, with specific action items.
                </p>
              </div>

              <div className="border-2 border-foreground p-6">
                <div className="text-2xl mb-3">SCREENER</div>
                <h3 className="font-bold uppercase mb-2">Stock Screener</h3>
                <p className="text-sm text-muted-foreground">
                  Find opportunities using the Magic Formula, Buffett Quality Metrics, and other legendary screening strategies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
