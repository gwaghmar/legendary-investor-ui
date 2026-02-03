'use client';

import { useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useMemo } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HoldingsSummary } from '@/components/holdings-summary';
import { LegendOpinionCard } from '@/components/legend-opinion-card';
import type { LegendId, Sentiment } from '@/lib/legends';

// Sample stock prices for demonstration
const stockPrices: Record<string, number> = {
  NVDA: 186.7,
  SOFI: 26.22,
  PLTR: 175.5,
  TSM: 306.97,
  AMC: 1.565,
  AAPL: 248.5,
  MSFT: 420.3,
  GOOGL: 195.8,
  META: 680.5,
  MU: 315.0,
};

interface LegendOpinion {
  legendId: LegendId;
  sentiment: Sentiment;
  opinion: string;
  action: string;
}

function generateOpinions(holdings: { symbol: string; shares: number; value: number; percentage: number }[]): LegendOpinion[] {
  const topHolding = holdings[0];
  const hasAMC = holdings.some((h) => h.symbol === 'AMC');
  const hasHighConcentration = topHolding && topHolding.percentage > 40;

  const opinions: LegendOpinion[] = [
    {
      legendId: 'buffett',
      sentiment: hasHighConcentration ? 'cautious' : 'neutral',
      opinion: hasHighConcentration
        ? `${topHolding.shares} shares of ${topHolding.symbol}? That's over ${topHolding.percentage.toFixed(0)}% concentration in one stock. That's not investing, son - that's speculation. I'd trim that down to 30-40% and put the rest into businesses with durable competitive advantages.`
        : "A diversified portfolio focused on quality. I like the discipline. Now make sure you understand each business well enough to hold through a 50% drawdown.",
      action: hasHighConcentration ? `TRIM ${topHolding.symbol} to 30-40%` : 'Hold quality positions, add on weakness',
    },
    {
      legendId: 'burry',
      sentiment: hasAMC ? 'bearish' : 'neutral',
      opinion: hasAMC
        ? `${topHolding?.symbol} at ${topHolding?.percentage > 50 ? '65x earnings' : 'these levels'} with ${topHolding?.percentage.toFixed(0)}% of your portfolio? You're one bad quarter away from a 30% drawdown. And AMC? That's not investing, that's donating to Adam Aron's compensation.`
        : `Heavy tech, heavy AI bet. The math says you're betting on multiple expansion continuing. I'd look at where the actual value is - memory stocks like Micron are trading at 7x with 98% growth.`,
      action: hasAMC ? 'SELL AMC immediately' : 'Add asymmetric value plays like MU',
    },
    {
      legendId: 'munger',
      sentiment: hasAMC ? 'bearish' : 'cautious',
      opinion: hasAMC
        ? `AMC is a melting ice cube. The math doesn't work - $4B debt, negative equity, continuous dilution. Sell it. Today. Harvest the tax loss and move on to something rational.`
        : `I see speculation dressed up as investment. The best businesses are the ones you can hold forever. Ask yourself: would you be happy owning these for 10 years without looking at the price?`,
      action: hasAMC ? 'SELL AMC, harvest tax loss' : 'Simplify and focus on quality',
    },
    {
      legendId: 'lynch',
      sentiment: holdings.some((h) => h.symbol === 'SOFI') ? 'bullish' : 'neutral',
      opinion: holdings.some((h) => h.symbol === 'SOFI')
        ? `SoFi is a classic turnaround story. Bank charter secured, deposits growing, path to profitability visible. This could be a 5-bagger from here. Know your story, stick with it.`
        : `I like to invest in what I know. Make sure you can explain each of these businesses in simple terms. If you can't, you shouldn't own them.`,
      action: holdings.some((h) => h.symbol === 'SOFI') ? 'HOLD SOFI, consider adding on dips' : 'Research each holding deeply',
    },
    {
      legendId: 'druckenmiller',
      sentiment: 'neutral',
      opinion: hasHighConcentration
        ? `Heavy tech, heavy AI bet. If the thesis plays out, you'll do great. If not, expensive lesson about concentration. With Warsh as Fed Chair, watch that rate sensitivity.`
        : `Macro backdrop is supportive for now, but don't get complacent. The dollar strength and rate environment can shift quickly. Have exit plans.`,
      action: 'Monitor macro, have exit plan',
    },
  ];

  return opinions;
}

function AnalysisContent() {
  const searchParams = useSearchParams();
  const holdingsParam = searchParams.get('holdings') || '';
  const type = searchParams.get('type') || 'portfolio'; // 'portfolio' | 'watchlist'

  const { holdings, totalValue, riskLevel } = useMemo(() => {
    const parsed = holdingsParam.split(',').map((h) => {
      const [symbol, shares] = h.split(':');
      const price = stockPrices[symbol] || 100;
      const shareCount = parseFloat(shares) || 0;
      return {
        symbol,
        shares: shareCount,
        price,
        value: Math.round(price * shareCount),
      };
    });

    const total = parsed.reduce((sum, h) => sum + h.value, 0);

    const withPercentage = parsed
      .map((h) => ({
        ...h,
        percentage: total > 0 ? (h.value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    // Risk logic remains similar for now, can be adjusted for watchlist later
    const topPercentage = withPercentage[0]?.percentage || 0;
    const hasAMC = withPercentage.some((h) => h.symbol === 'AMC');
    let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (topPercentage > 50 || hasAMC) risk = 'HIGH';
    else if (topPercentage > 30) risk = 'MEDIUM';

    return {
      holdings: withPercentage,
      totalValue: total,
      riskLevel: risk,
    };
  }, [holdingsParam]);

  const opinions = useMemo(() => generateOpinions(holdings), [holdings]);

  const consensusActions = useMemo(() => {
    // ... (existing consensus logic)
    const actions: { type: 'SELL' | 'TRIM' | 'BUY' | 'HOLD'; symbol: string; reason: string }[] = [];

    if (holdings.some((h) => h.symbol === 'AMC')) {
      actions.push({ type: 'SELL', symbol: 'AMC', reason: 'All legends agree (harvest tax loss)' });
    }

    const topHolding = holdings[0];
    if (topHolding && topHolding.percentage > 50) {
      actions.push({ type: 'TRIM', symbol: topHolding.symbol, reason: `Reduce from ${topHolding.percentage.toFixed(0)}% to 30-40%` });
    }

    actions.push({ type: 'BUY', symbol: 'MU', reason: "Burry's pick: 7x P/E, 98% growth" });

    const holdSymbols = holdings
      .filter((h) => h.symbol !== 'AMC' && h.percentage < 40)
      .slice(0, 2)
      .map((h) => h.symbol)
      .join(', ');

    if (holdSymbols) {
      actions.push({ type: 'HOLD', symbol: holdSymbols, reason: 'Fundamentals intact' });
    }

    return actions;
  }, [holdings]);

  // ... (existing helper vars)
  const actionColors = {
    SELL: '#DC2626',
    TRIM: '#D97706',
    BUY: '#059669',
    HOLD: '#059669',
  };


  if (holdings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">No {type === 'watchlist' ? 'Symbols' : 'Holdings'} Found</h1>
        <p className="text-muted-foreground mb-8">
          Please add your {type} to get legendary opinions.
        </p>
        <Link
          href="/portfolio"
          className="inline-block bg-foreground text-background px-6 py-3 font-bold"
        >
          Add {type === 'watchlist' ? 'Watchlist' : 'Portfolio'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <span>&larr;</span> Back
        </Link>
        <Link
          href="/portfolio"
          className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
        >
          Analyze Different {type === 'watchlist' ? 'Watchlist' : 'Portfolio'}
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-8">
        Legendary {type === 'watchlist' ? 'Watchlist Analysis' : 'Opinions'}
      </h1>

      {/* Holdings Summary (Skip total value for watchlist if share count is 0) */}
      {type === 'portfolio' ? (
        <HoldingsSummary
          holdings={holdings}
          totalValue={totalValue}
          riskLevel={riskLevel}
        />
      ) : (
        <div className="border-2 border-foreground p-6 mb-8">
          <div className="text-xs text-muted-foreground uppercase tracking-tight mb-4">
            Watchlist Symbols
          </div>
          <div className="flex flex-wrap gap-2">
            {holdings.map(h => (
              <span key={h.symbol} className="border border-foreground px-3 py-1 font-bold">
                {h.symbol}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend Opinions */}
      <div className="space-y-6 mt-8">
        {opinions.map((opinion) => (
          <LegendOpinionCard
            key={opinion.legendId}
            legendId={opinion.legendId}
            sentiment={opinion.sentiment}
            opinion={opinion.opinion}
            action={opinion.action}
          />
        ))}
      </div>

      {/* Consensus Actions */}
      <div className="border-2 border-foreground p-4 sm:p-6 mt-8">
        <div className="text-xs text-muted-foreground uppercase tracking-tight mb-4">
          Consensus Actions
        </div>
        <div className="space-y-3">
          {consensusActions.map((action) => (
            <div key={`${action.type}-${action.symbol}`} className="flex items-center gap-3">
              <span
                className="w-12 text-xs font-bold text-center py-1"
                style={{
                  backgroundColor: actionColors[action.type],
                  color: '#FFFFFF',
                }}
              >
                {action.type}
              </span>
              <span className="font-bold">{action.symbol}</span>
              <span className="text-sm text-muted-foreground">- {action.reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Debate */}
      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-block border-2 border-foreground px-6 py-3 font-bold uppercase hover:bg-foreground hover:text-background transition-colors"
        >
          &larr; Back to Live Debate
        </Link>
      </div>
    </div>
  );
}

export default function PortfolioAnalysisPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 px-4 pb-12">
        <Suspense fallback={<div className="text-center py-12">Loading analysis...</div>}>
          <AnalysisContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
