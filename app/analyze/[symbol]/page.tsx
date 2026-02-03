'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { stockDatabase, getLegendAnalyses, type LegendAnalysis } from '@/lib/stock-data';
import { legends, type LegendId } from '@/lib/legends';

interface PageParams {
  symbol: string;
}

export default function StockAnalysisPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { symbol } = use(params);
  const upperSymbol = symbol.toUpperCase();
  const stock = stockDatabase[upperSymbol];
  const analyses = useMemo(() => getLegendAnalyses(upperSymbol), [upperSymbol]);

  const [selectedLegend, setSelectedLegend] = useState<LegendId>('burry');

  const selectedAnalysis = analyses.find((a) => a.legendId === selectedLegend);
  const activeLegends: LegendId[] = ['buffett', 'munger', 'burry', 'lynch', 'druckenmiller'];

  if (!stock) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 px-4 pb-12">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Stock Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We don&apos;t have analysis for {upperSymbol} yet.
            </p>
            <Link
              href="/screener"
              className="inline-block bg-foreground text-background px-6 py-3 font-bold"
            >
              Browse Screener
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const verdictColors: Record<string, string> = {
    'STRONG BUY': '#059669',
    BUY: '#059669',
    HOLD: '#D97706',
    SELL: '#DC2626',
    'STRONG SELL': '#DC2626',
  };

  // Calculate consensus
  const consensusScore = Math.round(
    analyses.reduce((sum, a) => sum + a.conviction * 10, 0) / analyses.length
  );

  const consensusVerdict =
    consensusScore >= 80
      ? 'STRONG BUY'
      : consensusScore >= 65
        ? 'BUY'
        : consensusScore >= 50
          ? 'HOLD'
          : 'SELL';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Stock Header */}
          <div className="border-2 border-foreground p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-2 border-foreground flex items-center justify-center font-bold text-xl bg-secondary">
                  {stock.symbol}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase">{stock.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {stock.exchange}: {stock.symbol} - {stock.sector}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold">${stock.price.toFixed(2)}</div>
                <div className={stock.change >= 0 ? 'text-bullish' : 'text-bearish'}>
                  {stock.change >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}% today
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-foreground/20">
              <Link
                href={`/portfolio?add=${stock.symbol}`}
                className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
              >
                + Add to Portfolio
              </Link>
              <button className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors">
                + Watchlist
              </button>
              <button className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Legend Tabs */}
          <div className="border-2 border-foreground mb-6">
            <div className="flex overflow-x-auto">
              {activeLegends.map((legendId) => {
                const legend = legends[legendId];
                const analysis = analyses.find((a) => a.legendId === legendId);
                const isSelected = selectedLegend === legendId;
                const isFavorite = legendId === 'burry' && upperSymbol === 'MU';

                return (
                  <button
                    key={legendId}
                    onClick={() => setSelectedLegend(legendId)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                      isSelected
                        ? 'border-current bg-secondary'
                        : 'border-transparent hover:bg-secondary/50'
                    }`}
                    style={{ borderColor: isSelected ? legend.color : 'transparent' }}
                  >
                    <span>{legend.emoji}</span>
                    <span className={isSelected ? 'font-bold' : ''}>{legend.name}</span>
                    {isFavorite && <span className="text-xs">*</span>}
                    {analysis && (
                      <span
                        className="text-xs px-1"
                        style={{ color: verdictColors[analysis.verdict] }}
                      >
                        {analysis.conviction}/10
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Legend Analysis */}
          {selectedAnalysis && (
            <div
              className="border-2 p-4 sm:p-6 mb-6"
              style={{ borderColor: legends[selectedLegend].color }}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold uppercase" style={{ color: legends[selectedLegend].color }}>
                  {legends[selectedLegend].fullName}&apos;s Analysis
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold px-2 py-1"
                    style={{
                      backgroundColor: verdictColors[selectedAnalysis.verdict],
                      color: '#FFFFFF',
                    }}
                  >
                    {selectedAnalysis.verdict}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Conviction: {selectedAnalysis.conviction}/10
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-6">
                &ldquo;{selectedAnalysis.quote}&rdquo;
              </p>

              {/* Pros/Cons */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="border border-foreground/20 p-4">
                  <h3 className="text-xs uppercase tracking-tight text-muted-foreground mb-3">
                    What I Like
                  </h3>
                  <ul className="space-y-2">
                    {selectedAnalysis.likes.map((like) => (
                      <li key={like} className="text-sm flex items-start gap-2">
                        <span className="text-bullish">+</span>
                        {like}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-foreground/20 p-4">
                  <h3 className="text-xs uppercase tracking-tight text-muted-foreground mb-3">
                    Concerns
                  </h3>
                  <ul className="space-y-2">
                    {selectedAnalysis.concerns.map((concern) => (
                      <li key={concern} className="text-sm flex items-start gap-2">
                        <span className="text-bearish">-</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="border border-foreground/20 p-4 mb-6">
                <h3 className="text-xs uppercase tracking-tight text-muted-foreground mb-3">
                  Key Metrics ({legends[selectedLegend].name} Focus)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">P/E Ratio</div>
                    <div className="font-bold">
                      {stock.forwardPe}x{' '}
                      {stock.forwardPe < 20 && <span className="text-bullish text-xs">OK</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Free Cash Flow</div>
                    <div className="font-bold">
                      {stock.freeCashFlow}{' '}
                      {!stock.freeCashFlow.startsWith('-') && (
                        <span className="text-bullish text-xs">OK</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Short Interest</div>
                    <div className="font-bold">
                      {stock.shortInterest}%{' '}
                      {stock.shortInterest < 5 && <span className="text-bullish text-xs">OK</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Debt/Equity</div>
                    <div className="font-bold">
                      {stock.debtEquity}x{' '}
                      {stock.debtEquity < 0.5 && <span className="text-bullish text-xs">OK</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Insider Buying</div>
                    <div className="font-bold">
                      {stock.insiderBuying ? 'Yes' : 'No'}{' '}
                      {stock.insiderBuying && <span className="text-bullish text-xs">OK</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Tangible Book</div>
                    <div className="font-bold">${stock.tangibleBook}/share</div>
                  </div>
                </div>
              </div>

              <p className="text-sm italic text-muted-foreground">
                &ldquo;{selectedAnalysis.closingQuote}&rdquo;
              </p>
            </div>
          )}

          {/* Consensus */}
          <div className="border-2 border-foreground p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-tight text-muted-foreground">Consensus</h3>
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{consensusScore}/100</span>
                <span
                  className="text-sm font-bold px-2 py-1"
                  style={{
                    backgroundColor: verdictColors[consensusVerdict],
                    color: '#FFFFFF',
                  }}
                >
                  {consensusVerdict}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {analyses.map((analysis) => {
                const legend = legends[analysis.legendId];
                return (
                  <div key={analysis.legendId} className="flex items-center gap-2 text-sm">
                    <span>{legend.emoji}</span>
                    <span>{legend.name}:</span>
                    <span style={{ color: verdictColors[analysis.verdict] }}>
                      {analysis.verdict} ({analysis.conviction})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <Link
              href="/screener"
              className="inline-block border-2 border-foreground px-6 py-3 font-bold uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              &larr; Back to Screener
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
