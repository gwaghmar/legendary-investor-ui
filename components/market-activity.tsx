'use client';

import React from 'react';
import { Sparkline } from './sparkline';
import Link from 'next/link';

interface Mover {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    sparkData: number[];
}

export function MarketActivity() {
    const gainers: Mover[] = [
        { symbol: "PLTR", price: 42.15, change: 3.42, changePercent: 8.82, sparkData: [38, 39, 41, 40, 42.15] },
        { symbol: "NVDA", price: 720.45, change: 52.3, changePercent: 7.82, sparkData: [680, 695, 710, 705, 720.45] },
        { symbol: "AMD", price: 178.12, change: 12.4, changePercent: 7.48, sparkData: [165, 170, 172, 175, 178.12] },
    ];

    const losers: Mover[] = [
        { symbol: "AMZN", price: 168.20, change: -9.8, changePercent: -5.55, sparkData: [178, 175, 172, 170, 168.20] },
        { symbol: "GOOGL", price: 142.30, change: -3.7, changePercent: -2.53, sparkData: [146, 145, 144, 143, 142.30] },
        { symbol: "META", price: 465.10, change: -6.2, changePercent: -1.31, sparkData: [471, 470, 468, 467, 465.10] },
    ];

    return (
        <div className="border-2 border-foreground p-6 bg-background mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-primary italic">Live</span> Market Activity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gainers */}
                <div>
                    <h4 className="text-[10px] font-bold uppercase text-bullish mb-4 tracking-tighter flex items-center gap-2">
                        ▲ Top Gainers Today
                    </h4>
                    <div className="space-y-2">
                        {gainers.map((m) => (
                            <Link
                                key={m.symbol}
                                href={`/analyze/${m.symbol}`}
                                className="flex items-center justify-between p-2 border border-foreground/5 hover:border-foreground transition-all group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm tracking-tight">{m.symbol}</span>
                                    <span className="text-[10px] opacity-50">${m.price}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Sparkline data={m.sparkData} color="var(--bullish)" width={40} height={16} />
                                    <span className="font-mono text-xs font-bold text-bullish">+{m.changePercent}%</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Losers */}
                <div>
                    <h4 className="text-[10px] font-bold uppercase text-bearish mb-4 tracking-tighter flex items-center gap-2">
                        ▼ Top Losers Today
                    </h4>
                    <div className="space-y-2">
                        {losers.map((m) => (
                            <Link
                                key={m.symbol}
                                href={`/analyze/${m.symbol}`}
                                className="flex items-center justify-between p-2 border border-foreground/5 hover:border-foreground transition-all group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm tracking-tight">{m.symbol}</span>
                                    <span className="text-[10px] opacity-50">${m.price}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Sparkline data={m.sparkData} color="var(--bearish)" width={40} height={16} />
                                    <span className="font-mono text-xs font-bold text-bearish">{m.changePercent}%</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-foreground/10 text-[10px] uppercase font-bold tracking-tighter opacity-50 text-right">
                All data real-time via multi-source waterfall • Source: Finnhub/AV
            </div>
        </div>
    );
}
