'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Mock Data for Guru Portfolios (13F Filings)
const GURUS = [
    {
        id: 'buffett',
        name: 'Warren Buffett',
        firm: 'Berkshire Hathaway',
        avatar: '🧓',
        color: '#10B981',
        holdings: [
            { symbol: 'AAPL', name: 'Apple Inc.', percent: 43.5, shares: '915M', value: '$170B' },
            { symbol: 'BAC', name: 'Bank of America', percent: 9.8, shares: '1.03B', value: '$38B' },
            { symbol: 'AXP', name: 'American Express', percent: 8.7, shares: '152M', value: '$34B' },
            { symbol: 'KO', name: 'Coca-Cola', percent: 6.8, shares: '400M', value: '$25B' },
            { symbol: 'CVX', name: 'Chevron', percent: 5.1, shares: '126M', value: '$19B' },
        ],
        recentMoves: [
            { action: 'SELL', symbol: 'AAPL', amount: '10M shares' },
            { action: 'BUY', symbol: 'OXY', amount: '2.5M shares' },
        ]
    },
    {
        id: 'burry',
        name: 'Michael Burry',
        firm: 'Scion Asset Mgmt',
        avatar: '🔍',
        color: '#EF4444',
        holdings: [
            { symbol: 'JD', name: 'JD.com', percent: 12.5, shares: '200K', value: '$6M' },
            { symbol: 'BABA', name: 'Alibaba', percent: 11.2, shares: '75K', value: '$5.5M' },
            { symbol: 'HCA', name: 'HCA Healthcare', percent: 9.5, shares: '20K', value: '$4.8M' },
            { symbol: 'C', name: 'Citigroup', percent: 8.1, shares: '100K', value: '$4.2M' },
        ],
        recentMoves: [
            { action: 'BUY', symbol: 'BABA', amount: '25K shares' },
            { action: 'SELL', symbol: 'SOXX', amount: 'Put Options' },
        ]
    },
    {
        id: 'druckenmiller',
        name: 'Stan Druckenmiller',
        firm: 'Duquesne Family',
        avatar: '🌍',
        color: '#F59E0B',
        holdings: [
            { symbol: 'NVDA', name: 'NVIDIA', percent: 15.2, shares: '500K', value: '$450M' },
            { symbol: 'MSFT', name: 'Microsoft', percent: 12.8, shares: '1.2M', value: '$400M' },
            { symbol: 'LLY', name: 'Eli Lilly', percent: 8.5, shares: '300K', value: '$250M' },
            { symbol: 'CPNG', name: 'Coupang', percent: 7.2, shares: '10M', value: '$180M' },
        ],
        recentMoves: [
            { action: 'SELL', symbol: 'NVDA', amount: 'Reduced stake' },
            { action: 'BUY', symbol: 'IWM', amount: 'Call Options' },
        ]
    },
    {
        id: 'ackman',
        name: 'Bill Ackman',
        firm: 'Pershing Square',
        avatar: '👔',
        color: '#3B82F6',
        holdings: [
            { symbol: 'CMG', name: 'Chipotle', percent: 18.5, shares: '1.1M', value: '$2.5B' },
            { symbol: 'QSR', name: 'Restaurant Brands', percent: 16.2, shares: '23M', value: '$1.8B' },
            { symbol: 'HLT', name: 'Hilton', percent: 14.8, shares: '9M', value: '$1.6B' },
            { symbol: 'GOOGL', name: 'Alphabet', percent: 12.5, shares: '8M', value: '$1.4B' },
        ],
        recentMoves: [
            { action: 'BUY', symbol: 'GOOGL', amount: 'Added 2M shares' },
        ]
    }
];

export function GuruPortfolio() {
    const [selectedGuru, setSelectedGuru] = useState(GURUS[0]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar - Guru List */}
            <div className="md:col-span-1 space-y-2">
                <h3 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Select Legend</h3>
                {GURUS.map((guru) => (
                    <button
                        key={guru.id}
                        onClick={() => setSelectedGuru(guru)}
                        className={`w-full text-left p-3 border-2 transition-all flex items-center gap-3 ${selectedGuru.id === guru.id
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-transparent hover:border-foreground/20'
                            }`}
                    >
                        <span className="text-xl">{guru.avatar}</span>
                        <div>
                            <div className="font-bold text-sm">{guru.name}</div>
                            <div className={`text-xs ${selectedGuru.id === guru.id ? 'opacity-80' : 'text-muted-foreground'}`}>
                                {guru.firm}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content - Portfolio */}
            <div className="md:col-span-3 border-2 border-foreground p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">{selectedGuru.avatar}</div>
                        <div>
                            <h2 className="text-2xl font-bold">{selectedGuru.name}</h2>
                            <div className="text-muted-foreground">{selectedGuru.firm} • Top Holdings (13F)</div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-bold text-muted-foreground mb-1">Recent Activity</div>
                        {selectedGuru.recentMoves.map((move, i) => (
                            <div key={i} className="text-sm flex items-center justify-end gap-2">
                                <span className={`px-1.5 py-0.5 text-[10px] font-bold text-white ${move.action === 'BUY' ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                                    }`}>
                                    {move.action}
                                </span>
                                <span className="font-bold">{move.symbol}</span>
                                <span className="text-muted-foreground text-xs">{move.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-foreground/10 text-xs uppercase text-muted-foreground">
                                <th className="py-2 pl-2">My Stock</th>
                                <th className="py-2">Portfolio %</th>
                                <th className="py-2">Shares</th>
                                <th className="py-2 pr-2 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedGuru.holdings.map((stock, i) => (
                                <motion.tr
                                    key={stock.symbol}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-foreground/10 hover:bg-foreground/5"
                                >
                                    <td className="py-3 pl-2">
                                        <div className="font-bold">{stock.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full"
                                                    style={{ width: `${stock.percent}%`, backgroundColor: selectedGuru.color }}
                                                />
                                            </div>
                                            <span className="text-sm">{stock.percent}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm">{stock.shares}</td>
                                    <td className="py-3 pr-2 text-right font-mono font-bold">{stock.value}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="text-sm font-bold hover:underline flex items-center gap-1">
                        Analyze with AI
                        <span className="text-lg">✨</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
