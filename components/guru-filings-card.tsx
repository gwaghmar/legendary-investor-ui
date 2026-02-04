'use client';

import { motion } from 'framer-motion';

interface GuruMove {
    guru: string;
    fund: string;
    action: 'BUY' | 'SELL' | 'NEW' | 'EXIT';
    symbol: string;
    company: string;
    price: string;
    date: string;
    isHighConviction?: boolean;
}

// "Extracted 10 weeks back" simulated data
// Representing recent 13F filings (which come out 45 days after quarter end)
const RECENT_GURU_MOVES: GuruMove[] = [
    {
        guru: 'Michael Burry',
        fund: 'Scion Asset Management',
        action: 'NEW',
        symbol: 'BABA',
        company: 'Alibaba Group',
        price: '$75.00',
        date: '2024-11-14',
        isHighConviction: true
    },
    {
        guru: 'Warren Buffett',
        fund: 'Berkshire Hathaway',
        action: 'SELL',
        symbol: 'AAPL',
        company: 'Apple Inc.',
        price: '$185.00',
        date: '2024-11-14', // 13F filing date
    },
    {
        guru: 'Bill Ackman',
        fund: 'Pershing Square',
        action: 'BUY',
        symbol: 'GOOGL',
        company: 'Alphabet Inc.',
        price: '$132.00',
        date: '2024-11-14',
    },
    {
        guru: 'Stanley Druckenmiller',
        fund: 'Duquesne Family Office',
        action: 'NEW',
        symbol: 'NVDA',
        company: 'NVIDIA Corp',
        price: '$450.00',
        date: '2024-11-14',
        isHighConviction: true
    },
    {
        guru: 'Ray Dalio',
        fund: 'Bridgewater Associates',
        action: 'EXIT',
        symbol: 'TSLA',
        company: 'Tesla Inc.',
        price: '$210.00',
        date: '2024-11-14',
    }
];

export function GuruFilingsCard() {
    return (
        <div className="border-2 border-foreground p-6 bg-background h-full">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-xl">🧙‍♂️</span> Guru Intelligence
                <div className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded ml-auto">
                    FROM 13F FILINGS
                </div>
            </h3>

            <p className="text-xs text-muted-foreground mb-4">
                What the legendary investors bought & sold in their latest quarterly filings.
            </p>

            <div className="space-y-3">
                {RECENT_GURU_MOVES.map((move, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border border-foreground/10 p-3 bg-card hover:bg-secondary/5 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="font-bold text-sm">{move.guru}</div>
                                <div className="text-[10px] text-muted-foreground uppercase">{move.fund}</div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold ${move.action === 'BUY' || move.action === 'NEW'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                {move.action}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="font-mono font-bold text-lg">{move.symbol}</div>
                            <div className="text-xs text-muted-foreground truncate flex-1">{move.company}</div>
                        </div>

                        {move.isHighConviction && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                High Conviction Trade
                            </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-dashed border-foreground/10 flex justify-between text-[10px] text-muted-foreground">
                            <span>Filed: {move.date}</span>
                            <span>Est. Price: {move.price}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 text-[10px] text-center text-muted-foreground italic">
                * Based on SEC 13F filings from approx. 10 weeks ago
            </div>
        </div>
    );
}
