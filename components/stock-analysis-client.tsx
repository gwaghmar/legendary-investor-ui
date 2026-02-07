'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { getLegendAnalyses, type LegendAnalysis, type StockData } from '@/lib/stock-data';
import { legends, type LegendId } from '@/lib/legends';
import { ThesisBuilderModal } from '@/components/thesis-builder-modal';
import { CompareDrawer } from '@/components/compare-drawer';
import { TranscriptSearch } from '@/components/transcript-search';
import { InsiderTradingList } from '@/components/insider-trading-list';

import { MetricTooltip } from '@/components/metric-tooltip';
import { RedFlagList } from '@/components/red-flag-list';
import { ContextualQuestions } from '@/components/contextual-questions';
import { Sparkline } from '@/components/sparkline';
import { NewsSentimentFeed } from '@/components/news-sentiment-feed';
import { InstitutionalTimeline } from '@/components/institutional-timeline';
import { PeerMatrix } from '@/components/peer-matrix';

interface StockAnalysisClientProps {
    stock: StockData;
}

export function StockAnalysisClient({ stock }: StockAnalysisClientProps) {
    const upperSymbol = stock.symbol.toUpperCase();
    const analyses = useMemo(() => getLegendAnalyses(stock), [stock]);

    const [selectedLegend, setSelectedLegend] = useState<LegendId>('burry');
    const [isThesisModalOpen, setIsThesisModalOpen] = useState(false);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [activeView, setActiveView] = useState<'analysis' | 'debate' | 'transcripts' | 'insiders' | 'risks'>('analysis');

    const selectedAnalysis = analyses.find((a) => a.legendId === selectedLegend);
    const activeLegends: LegendId[] = ['buffett', 'munger', 'burry', 'lynch', 'druckenmiller'];

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
                                <div className="text-xs text-muted-foreground mt-1 flex justify-end items-center gap-2">
                                    <span>Updated: {stock.lastUpdated ? new Date(stock.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                                    <span className="opacity-50">|</span>
                                    <span className="uppercase tracking-wider text-[10px] border border-border px-1.5 py-0.5 rounded flex items-center gap-1">
                                        {stock.source === 'Demo Data' ? '⚠️ DEMO' : stock.source || 'FINNHUB'}
                                    </span>
                                </div>
                                <div className="mt-3 bg-secondary/30 border border-foreground/10 px-3 py-2 text-[10px] sm:text-xs">
                                    <span className="font-bold uppercase mr-2">What Changed?</span>
                                    <span className="text-muted-foreground italic">
                                        Recent 8-K suggests positive momentum in cloud margins; offset by slight deceleration in hardware.
                                    </span>
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
                            <button
                                className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                                onClick={() => alert("Added to watchlist!")}
                            >
                                + Watchlist
                            </button>
                            <button
                                onClick={() => setIsThesisModalOpen(true)}
                                className="text-sm border-2 border-primary bg-primary/10 text-primary font-bold px-3 py-1.5 hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                            >
                                📝 Build Thesis
                            </button>
                            <button
                                onClick={() => setIsCompareOpen(true)}
                                className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors"
                            >
                                ⚖️ Compare
                            </button>
                            <button className="text-sm border-2 border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background transition-colors">
                                Share
                            </button>
                        </div>
                    </div>

                    {/* Phase 6: Executive Summary Card */}
                    <div className="mt-6 border-2 border-foreground/10 bg-secondary/10 p-4 sm:p-5 mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="text-secondary">✦</span> Executive Summary
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-bullish mt-1.5 px-0" />
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                        <span className="font-bold">Growth Engine:</span> {stock.symbol} continues to dominate cloud infrastructure with 25%+ market share, though hardware cycle remains a drag.
                                    </p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-bullish mt-1.5 px-0" />
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                        <span className="font-bold">Capital Efficiency:</span> ROIC of {stock.roic}% is in the top decile of the sector, indicating elite management of capital.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-bearish mt-1.5 px-0" />
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                        <span className="font-bold">Valuation Risk:</span> Trading at {stock.pe.toFixed(0)}x P/E, implying a high priced-for-perfection setup amid macro uncertainty.
                                    </p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 px-0" />
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                        <span className="font-bold">Next Catalyst:</span> Q1 earnings (May 14) will be critical for verifying cloud acceleration thesis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Tabs */}
                    <div className="flex border-b-2 border-foreground mb-6">
                        <button
                            onClick={() => setActiveView('analysis')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${activeView === 'analysis' ? 'border-foreground bg-foreground/5' : 'border-transparent hover:bg-foreground/5'}`}
                        >
                            <span className="mr-2">📊</span> Analysis
                        </button>
                        <button
                            onClick={() => setActiveView('transcripts')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${activeView === 'transcripts' ? 'border-foreground bg-foreground/5' : 'border-transparent hover:bg-foreground/5'}`}
                        >
                            <span className="mr-2">📄</span> Transcripts
                        </button>
                        <button
                            onClick={() => setActiveView('insiders')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${activeView === 'insiders' ? 'border-foreground bg-foreground/5' : 'border-transparent hover:bg-foreground/5'}`}
                        >
                            <span className="mr-2">💼</span> Insiders
                        </button>
                        <button
                            onClick={() => setActiveView('risks')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-4 ${activeView === 'risks' ? 'border-foreground bg-foreground/5' : 'border-transparent hover:bg-foreground/5'}`}
                        >
                            <span className="mr-2 text-bearish">⚠️</span> Risks
                        </button>
                    </div>

                    {/* Analysis View */}
                    {activeView === 'analysis' && (
                        <>
                            {/* Legend Tabs */}
                            <div className="border-2 border-foreground mb-6">
                                <div className="flex overflow-x-auto pb-1 scrollbar-hide">
                                    {activeLegends.map((legendId) => {
                                        const legend = legends[legendId];
                                        const analysis = analyses.find((a) => a.legendId === legendId);
                                        const isSelected = selectedLegend === legendId;
                                        const isFavorite = legendId === 'burry' && upperSymbol === 'MU';

                                        return (
                                            <button
                                                key={legendId}
                                                onClick={() => setSelectedLegend(legendId)}
                                                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${isSelected
                                                    ? 'border-current bg-secondary'
                                                    : 'border-transparent hover:bg-secondary/50'
                                                    }`}
                                                style={{ borderColor: isSelected ? legend.color : 'transparent' }}
                                            >
                                                <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0">
                                                    <img src={legend.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
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
                                            <MetricTooltip label="P/E Ratio" formula="Market Price / Earnings Per Share (TTM)">
                                                <div className="cursor-help">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        P/E Ratio <span className="text-[10px] opacity-30">ⓘ</span>
                                                        <Sparkline data={[24, 26, 25, 27, 26]} color="#888" />
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {stock.pe ? stock.pe.toFixed(1) : 'N/A'}x{' '}
                                                        {stock.pe > 0 && stock.pe < 20 && <span className="text-bullish text-xs">OK</span>}
                                                    </div>
                                                </div>
                                            </MetricTooltip>
                                            <MetricTooltip label="Free Cash Flow" formula="Operating Cash Flow - Capital Expenditures">
                                                <div className="cursor-help">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        Free Cash Flow <span className="text-[10px] opacity-30">ⓘ</span>
                                                        <Sparkline data={[120, 135, 128, 142, 145]} color="var(--bullish)" />
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {stock.freeCashFlow}{' '}
                                                        {!stock.freeCashFlow.startsWith('-') && stock.freeCashFlow !== 'N/A' && (
                                                            <span className="text-bullish text-xs">OK</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </MetricTooltip>
                                            <MetricTooltip label="Short Interest" formula="Shares Shorted / Total Float Shares">
                                                <div className="cursor-help">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        Short Interest <span className="text-[10px] opacity-30">ⓘ</span>
                                                        <Sparkline data={[3.2, 3.5, 3.8, 3.4, 3.1]} color="var(--bullish)" />
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {stock.shortInterest}%{' '}
                                                        {stock.shortInterest < 5 && <span className="text-bullish text-xs">OK</span>}
                                                    </div>
                                                </div>
                                            </MetricTooltip>
                                            <MetricTooltip label="Debt/Equity" formula="Total Liabilities / Total Shareholder Equity">
                                                <div className="cursor-help">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        Debt/Equity <span className="text-[10px] opacity-30">ⓘ</span>
                                                        <Sparkline data={[0.62, 0.60, 0.61, 0.58, 0.55]} color="#888" />
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {stock.debtEquity.toFixed(2)}x{' '}
                                                        {stock.debtEquity < 0.5 && <span className="text-bullish text-xs">OK</span>}
                                                    </div>
                                                </div>
                                            </MetricTooltip>
                                            <MetricTooltip label="Insider Buying" formula="Net shares purchased by company executives (Sec Form 4)">
                                                <div className="cursor-help">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        Insider Buying <span className="text-[10px] opacity-30">ⓘ</span>
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {stock.insiderBuying ? 'Yes' : 'No'}{' '}
                                                        {stock.insiderBuying && <span className="text-bullish text-xs">OK</span>}
                                                    </div>
                                                </div>
                                            </MetricTooltip>
                                            <MetricTooltip label="ROIC" formula="NOPAT / (Total Debt + Equity). Measures capital efficiency.">
                                                <div className="cursor-help">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        ROIC <span className="text-[10px] opacity-30">ⓘ</span>
                                                        <Sparkline data={[18, 19, 21, 20.5, 22.1]} color="var(--bullish)" />
                                                    </div>
                                                    <div className="font-bold text-lg">
                                                        {stock.roic ? `${stock.roic}%` : 'N/A'}{' '}
                                                        {stock.roic > 15 && <span className="text-bullish text-xs">Strong</span>}
                                                    </div>
                                                </div>
                                            </MetricTooltip>
                                        </div>
                                    </div>

                                    <p className="text-sm italic text-muted-foreground">
                                        &ldquo;{selectedAnalysis.closingQuote}&rdquo;
                                    </p>
                                </div>
                            )}

                            {/* Consensus */}
                            <div className="border-2 border-foreground p-4 sm:p-6 bg-secondary/10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                    <h3 className="text-xs uppercase tracking-tight text-muted-foreground font-bold">Legendary Consensus</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold font-mono">{consensusScore}/100</span>
                                        <span
                                            className="text-sm font-bold px-3 py-1 border-2"
                                            style={{
                                                borderColor: verdictColors[consensusVerdict],
                                                color: verdictColors[consensusVerdict],
                                                backgroundColor: `${verdictColors[consensusVerdict]}10`,
                                            }}
                                        >
                                            {consensusVerdict}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-6 gap-y-3">
                                    {analyses.map((analysis) => {
                                        const legend = legends[analysis.legendId];
                                        return (
                                            <div key={analysis.legendId} className="flex items-center gap-2 text-xs border border-foreground/10 px-2 py-1 bg-background">
                                                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 border border-foreground/20">
                                                    <img src={legend.avatar} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold">{legend.name}:</span>
                                                <span className="font-mono" style={{ color: verdictColors[analysis.verdict] }}>
                                                    {analysis.conviction}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Transcripts View */}
                    {activeView === 'transcripts' && (
                        <TranscriptSearch symbol={stock.symbol} />
                    )}

                    {/* Insiders View */}
                    {activeView === 'insiders' && (
                        <InsiderTradingList symbol={stock.symbol} />
                    )}

                    {/* Risks View */}
                    {activeView === 'risks' && (
                        <RedFlagList symbol={stock.symbol} />
                    )}

                    {/* Phase 8: Perplexity Pro Extensions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-12 border-t-2 border-foreground/5 pt-8">
                        <NewsSentimentFeed symbol={stock.symbol} />
                        <InstitutionalTimeline symbol={stock.symbol} />
                    </div>

                    <PeerMatrix symbol={stock.symbol} />

                    {/* Contextual Deep Dive Suggestions */}
                    <ContextualQuestions symbol={stock.symbol} />

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

            <ThesisBuilderModal isOpen={isThesisModalOpen} onClose={() => setIsThesisModalOpen(false)} stock={stock} />

            {isCompareOpen && (
                <CompareDrawer baseStock={stock} isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
            )}
        </div>
    );
}
