'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MarketComponent {
    symbol: string;
    name: string;
    weight: number;
    performance: number; // percentage
}

interface SectorGroup {
    name: string;
    overallPerformance: number;
    components: MarketComponent[];
}

const HEATMAP_DATA: SectorGroup[] = [
    {
        name: "Technology",
        overallPerformance: 4.06,
        components: [
            { symbol: "NVDA", name: "Nvidia", weight: 8, performance: 7.87 },
            { symbol: "AVGO", name: "Broadcom", weight: 6, performance: 7.22 },
            { symbol: "MSFT", name: "Microsoft", weight: 10, performance: 1.90 },
            { symbol: "AAPL", name: "Apple", weight: 9, performance: 0.80 },
            { symbol: "AMD", name: "AMD", weight: 4, performance: 8.28 },
            { symbol: "QCOM", name: "Qualcomm", weight: 3, performance: 1.15 },
            { symbol: "INTC", name: "Intel", weight: 2, performance: -0.45 },
        ]
    },
    {
        name: "Consumer Cyclical",
        overallPerformance: 0.41,
        components: [
            { symbol: "AMZN", name: "Amazon", weight: 7, performance: -5.55 },
            { symbol: "TSLA", name: "Tesla", weight: 5, performance: 3.50 },
            { symbol: "HD", name: "Home Depot", weight: 3, performance: 0.73 },
            { symbol: "MCD", name: "McDonalds", weight: 2, performance: 1.14 },
        ]
    },
    {
        name: "Financial Services",
        overallPerformance: 1.82,
        components: [
            { symbol: "BRK-B", name: "Berkshire", weight: 6, performance: 0.82 },
            { symbol: "JPM", name: "JPM", weight: 5, performance: 3.95 },
            { symbol: "V", name: "Visa", weight: 4, performance: 0.74 },
            { symbol: "MA", name: "Mastercard", weight: 3, performance: -0.57 },
        ]
    },
    {
        name: "Healthcare",
        overallPerformance: 1.85,
        components: [
            { symbol: "LLY", name: "Eli Lilly", weight: 5, performance: 3.66 },
            { symbol: "UNH", name: "UnitedHealth", weight: 5, performance: 0.93 },
            { symbol: "ABBV", name: "AbbVie", weight: 4, performance: 2.01 },
            { symbol: "MRK", name: "Merck", weight: 3, performance: 1.82 },
        ]
    },
    {
        name: "Communication",
        overallPerformance: -0.39,
        components: [
            { symbol: "GOOGL", name: "Google", weight: 8, performance: -2.53 },
            { symbol: "META", name: "Meta", weight: 7, performance: -1.31 },
            { symbol: "NFLX", name: "Netflix", weight: 3, performance: 1.64 },
            { symbol: "DIS", name: "Disney", weight: 2, performance: -0.85 },
        ]
    }
];

export function MarketHeatmap() {
    const getColor = (perf: number) => {
        if (perf >= 3) return 'bg-[#059669]'; // Strong green
        if (perf >= 1) return 'bg-[#10b981]'; // Green
        if (perf >= 0) return 'bg-[#34d399]'; // Light green
        if (perf >= -1) return 'bg-[#fca5a5]'; // Light red
        if (perf >= -3) return 'bg-[#ef4444]'; // Red
        return 'bg-[#dc2626]'; // Strong red
    };

    return (
        <div className="border-2 border-foreground p-6 mb-8 bg-background">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <span className="text-primary">⬢</span> S&P 500 Market Heatmap
                </h2>
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#dc2626]" /> -3%
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[#059669]" /> +3%
                    </div>
                    <span className="opacity-50">Feb 6, 2026, 4:00 PM EST</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {HEATMAP_DATA.map((sector) => (
                    <div key={sector.name} className="flex flex-col">
                        <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider">
                            <span>{sector.name}</span>
                            <span className={sector.overallPerformance >= 0 ? 'text-bullish' : 'text-bearish'}>
                                {sector.overallPerformance >= 0 ? '+' : ''}{sector.overallPerformance}%
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1 flex-1 content-start">
                            {sector.components.map((stock) => {
                                // Scale size based on weight
                                const size = stock.weight * 12;
                                return (
                                    <Link
                                        key={stock.symbol}
                                        href={`/analyze/${stock.symbol}`}
                                        className={`${getColor(stock.performance)} p-2 flex flex-col items-center justify-center text-white transition-all hover:scale-105 hover:z-10 shadow-sm border border-black/10`}
                                        style={{
                                            width: `${size}px`,
                                            height: `${size}px`,
                                            minWidth: '60px',
                                            minHeight: '60px'
                                        }}
                                        title={`${stock.name}: ${stock.performance}%`}
                                    >
                                        <span className="font-bold text-xs">{stock.symbol}</span>
                                        <span className="text-[10px] opacity-80">
                                            {stock.performance >= 0 ? '+' : ''}{stock.performance}%
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-foreground/10 pt-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                <span>Data Powered by Finnhub & EDGAR</span>
                <span className="opacity-50">Click any ticker for Legend Lenses™ analysis</span>
            </div>
        </div>
    );
}
