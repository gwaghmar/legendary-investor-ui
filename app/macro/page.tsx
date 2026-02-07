'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MarketHeatmap } from '@/components/market-heatmap';
import { MarketActivity } from '@/components/market-activity';

interface MacroIndicator {
    name: string;
    current: string;
    trend: 'up' | 'down' | 'stable';
    description: string;
    data: number[];
}

export default function MacroPage() {
    const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
    const [loading, setLoading] = useState(true);
    const [regime, setRegime] = useState({ title: 'Analyzing...', summary: 'Gathering global economic signals for AI analysis...' });

    useEffect(() => {
        async function fetchMacro() {
            try {
                const res = await fetch('/api/macro');
                const data = await res.json();
                if (data.indicators) {
                    setIndicators(data.indicators);
                    generateRegime(data.indicators);
                }
            } catch (error) {
                console.error("Macro fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMacro();
    }, []);

    function generateRegime(inds: MacroIndicator[]) {
        const cpi = inds.find(i => i.name.includes('CPI'))?.current;
        const rates = inds.find(i => i.name.includes('Fed'))?.current;
        const gdp = inds.find(i => i.name.includes('GDP'))?.current;

        // Simple rule-based regime generation for Phase 10
        if (parseFloat(cpi || '0') > 4) {
            setRegime({
                title: 'High Inflation Regime',
                summary: 'Price pressures remain elevated. The Fed is likely to maintain a restrictive stance. Focus on pricing power and defensive cash flows.'
            });
        } else if (parseFloat(gdp || '0') > 3) {
            setRegime({
                title: 'Expansive Growth',
                summary: 'Economic activity is accelerating. Risk-on assets and cyclicals favored as growth outweighs inflationary concerns for now.'
            });
        } else {
            setRegime({
                title: 'Soft Landing Path',
                summary: 'Inflation is cooling towards targets while growth remains positive. Market transitioning to a "Goldilocks" environment.'
            });
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 pt-20 px-4 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Global Macro Dashboard</h1>
                            <p className="text-muted-foreground">Monitor the pulse of the global economy.</p>
                        </div>
                        <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-bold uppercase flex items-center gap-2">
                            <span>✦ Live Data</span>
                            <span className="opacity-50 text-[10px]">Source: Alpha Vantage</span>
                        </div>
                    </div>

                    {/* Market Regime */}
                    <div className="bg-foreground text-background p-6 mb-8 relative overflow-hidden transition-all duration-500">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-bold italic">AI</div>
                        <h2 className="text-sm uppercase tracking-widest font-bold mb-2 opacity-80">Current Market Regime (AI Inference)</h2>
                        <div className="text-4xl md:text-5xl font-bold mb-4 uppercase">{regime.title}</div>
                        <p className="max-w-2xl text-lg opacity-90 leading-relaxed italic">
                            {regime.summary}
                        </p>
                    </div>

                    {/* Market Heatmap */}
                    <MarketHeatmap />

                    {/* Market Activity (Phase 8) */}
                    <MarketActivity />

                    {/* Indicators Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 animate-pulse">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 border-2 border-foreground/10 bg-secondary/5" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {indicators.map((indicator) => (
                                <div key={indicator.name} className="border-2 border-foreground p-6 hover:shadow-brutalist transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg uppercase tracking-tighter">{indicator.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-3xl font-bold font-mono">{indicator.current}</span>
                                                {indicator.trend === 'up' && <span className="text-bullish text-xl">▲</span>}
                                                {indicator.trend === 'down' && <span className="text-bearish text-xl">▼</span>}
                                                {indicator.trend === 'stable' && <span className="text-primary text-xl">▶</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simple CSS Chart */}
                                    <div className="h-32 flex items-end gap-1 mt-6 border-b border-l border-foreground/20 p-1">
                                        {indicator.data.map((val, i) => {
                                            const max = Math.max(...indicator.data);
                                            const min = Math.min(...indicator.data);
                                            const range = max - min || 1;
                                            const height = ((val - min) / range) * 80 + 20; // Ensure at least 20% height
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-foreground/80 hover:bg-primary transition-all relative group"
                                                    style={{ height: `${height}%` }}
                                                >
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap z-10 font-mono">
                                                        {val.toFixed(2)}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <p className="text-xs text-muted-foreground mt-4 leading-relaxed font-bold italic opacity-60 uppercase">
                                        {indicator.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
