'use client';

import React from 'react';

interface RedFlag {
    id: string;
    title: string;
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    category: string;
}

interface RedFlagListProps {
    symbol: string;
    flags?: RedFlag[];
}

export function RedFlagList({ symbol, flags }: RedFlagListProps) {
    // Demo data for common red flags if none provided
    const demoFlags: RedFlag[] = [
        {
            id: '1',
            title: 'Aggressive Revenue Recognition',
            description: 'Unusual delta between GAAP revenue and FCF growth suggests aggressive accounting maneuvers.',
            severity: 'High',
            category: 'Accounting'
        },
        {
            id: '2',
            title: 'High Debt/EBITDA Ratio',
            description: 'Leverage is in the top 10% of the sector, limiting flexibility in a high-rate environment.',
            severity: 'Medium',
            category: 'Financial'
        },
        {
            id: '3',
            title: 'Insider Selling Clusters',
            description: 'Three key executives sold >10% of holdings in the last 90 days with no matching buybacks.',
            severity: 'Medium',
            category: 'Governance'
        }
    ];

    const displayFlags = flags || demoFlags;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
                <h3 className="font-bold uppercase tracking-tight flex items-center gap-2">
                    <span className="text-bearish">⚠️</span> AI Risk Scan: {symbol}
                </h3>
                <span className="text-[10px] uppercase font-mono bg-foreground/5 px-2 py-0.5 border border-foreground/10">
                    Confidence: 84%
                </span>
            </div>

            <div className="grid gap-3">
                {displayFlags.map((flag) => (
                    <div
                        key={flag.id}
                        className={`border-2 p-4 transition-all hover:translate-x-1 ${flag.severity === 'High' ? 'border-bearish/40 bg-bearish/5' :
                                flag.severity === 'Medium' ? 'border-yellow-500/40 bg-yellow-500/5' :
                                    'border-foreground/20 bg-foreground/5'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${flag.severity === 'High' ? 'bg-bearish text-white' :
                                    flag.severity === 'Medium' ? 'bg-yellow-500 text-black' :
                                        'bg-foreground text-background'
                                }`}>
                                {flag.severity} RISK
                            </span>
                            <span className="text-xs font-mono opacity-50 uppercase">{flag.category}</span>
                        </div>
                        <h4 className="font-bold mb-1 text-sm sm:text-base">{flag.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {flag.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-foreground text-background text-[10px] uppercase font-bold tracking-widest text-center">
                Manual Verification Required • SEC Filing Check Suggested
            </div>
        </div>
    );
}
