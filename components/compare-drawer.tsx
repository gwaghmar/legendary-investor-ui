'use client';

import { useState } from 'react';
import { StockAutocomplete } from './stock-autocomplete';
import type { StockData } from '@/lib/stock-data';

interface CompareDrawerProps {
    baseStock: StockData;
    isOpen: boolean;
    onClose: () => void;
}

export function CompareDrawer({ baseStock, isOpen, onClose }: CompareDrawerProps) {
    const [compareSymbol, setCompareSymbol] = useState('');
    const [compareStock, setCompareStock] = useState<StockData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!compareSymbol) return;

        setIsLoading(true);
        setError('');

        try {
            // Re-use the existing stock data API
            // Note: In a real app, we'd probably want a dedicated comparison endpoint or cleaner service
            // asking the server component to fetch data. For this Client Component, we'll fetch via API.
            const res = await fetch('/api/screener');
            const data = await res.json();

            const found = data.stocks?.find((s: any) => s.symbol === compareSymbol.toUpperCase());

            if (found) {
                // Map screener data format to StockData format (simplified for MVP)
                // Ideally we would share types better or have a unified API
                setCompareStock({
                    symbol: found.symbol,
                    name: found.name,
                    price: 100, // Screener data doesn't have price, mock for now or fetch
                    change: 0,
                    changePercent: 0,
                    percentChange: found.growth, // Using growth as proxy for momentum in this view
                    marketCap: found.marketCap,
                    pe: found.pe,
                    forwardPe: 0,
                    dividendYield: 0,
                    fiftyTwoWeekHigh: 0,
                    fiftyTwoWeekLow: 0,
                    volume: 0,
                    avgVolume: 0,
                    beta: 1,
                    description: '',
                    exchange: 'US',
                    sector: found.sector,
                    revenueGrowth: found.growth,
                    epsGrowth: 0,
                    roe: 0,
                    debtEquity: 0,
                    currentRatio: 0,
                    grossMargin: 0,
                    operatingMargin: 0,
                    netMargin: 0,
                    freeCashFlow: 'N/A',
                    shortInterest: 0,
                    insiderBuying: false,
                    tangibleBook: 0,
                    roic: found.roic,
                    magicScore: found.magicScore,
                    buffettScore: found.buffettScore,
                    lastUpdated: new Date().toISOString(),
                    source: 'Screener'
                } as StockData);
            } else {
                // Fallback to fetch single stock data if not in screener list
                // This is a placeholder for the actual single stock fetch 
                setError(`Could not find data for ${compareSymbol}`);
            }

        } catch (e) {
            setError('Failed to fetch comparison data');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            {/* Drawer */}
            <div className="relative w-full max-w-2xl bg-background border-l-2 border-foreground shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Compare Tickers</h2>
                        <button onClick={onClose} className="text-sm font-bold uppercase hover:text-muted-foreground">
                            [X] Close
                        </button>
                    </div>

                    {/* Search */}
                    <div className="flex gap-4 mb-8">
                        <div className="flex-1">
                            <StockAutocomplete
                                value={compareSymbol}
                                onChange={setCompareSymbol}
                                placeholder="Enter ticker to compare (e.g. MSFT)..."
                            />
                        </div>
                        <button
                            onClick={handleCompare}
                            disabled={isLoading || !compareSymbol}
                            className="bg-foreground text-background px-6 py-2 font-bold uppercase disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : 'Compare'}
                        </button>
                    </div>

                    {error && <div className="text-red-500 mb-6 font-mono text-sm">{error}</div>}

                    {/* Comparison Table */}
                    {compareStock && (
                        <div className="border-2 border-foreground">
                            <div className="grid grid-cols-3 border-b-2 border-foreground font-bold bg-secondary/20">
                                <div className="p-3">Metric</div>
                                <div className="p-3 border-l-2 border-foreground text-center">{baseStock.symbol}</div>
                                <div className="p-3 border-l-2 border-foreground text-center">{compareStock.symbol}</div>
                            </div>

                            {[
                                { label: 'P/E Ratio', key: 'pe', format: (v: any) => `${v?.toFixed(1)}x` },
                                { label: 'ROIC', key: 'roic', format: (v: any) => `${v?.toFixed(1)}%` },
                                { label: 'Magic Score', key: 'magicScore', format: (v: any) => v },
                                { label: 'Buffett Score', key: 'buffettScore', format: (v: any) => v },
                                { label: 'Revenue Growth', key: 'revenueGrowth', format: (v: any) => `${v}%` },
                                { label: 'Market Cap', key: 'marketCap', format: (v: any) => v },
                                { label: 'Sector', key: 'sector', format: (v: any) => v },
                            ].map((row, i) => (
                                <div key={row.label} className={`grid grid-cols-3 border-b border-foreground/10 ${i % 2 === 0 ? 'bg-background' : 'bg-secondary/5'}`}>
                                    <div className="p-3 text-sm font-medium text-muted-foreground">{row.label}</div>
                                    <div className="p-3 border-l border-foreground/10 text-center font-bold">
                                        {(baseStock as any)[row.key] !== undefined ? row.format((baseStock as any)[row.key]) : '-'}
                                    </div>
                                    <div className="p-3 border-l border-foreground/10 text-center font-bold">
                                        {(compareStock as any)[row.key] !== undefined ? row.format((compareStock as any)[row.key]) : '-'}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                    {!compareStock && !isLoading && !error && (
                        <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-foreground/20">
                            Select a ticker above to see a side-by-side comparison.
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
