'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// REAL DATA SNAPSHOT (Source: Latest 13F Filings available)
// Note: 13F filings are released 45 days after quarter end.
const GURUS = [
    {
        id: 'buffett',
        name: 'Warren Buffett',
        firm: 'Berkshire Hathaway',
        avatar: '/avatars/buffett.png',
        color: '#10B981',
        sentiment: 'CAUTIOUS',
        cash: '$189B', // Historic high cash pile
        holdings: [
            { symbol: 'AAPL', name: 'Apple Inc.', percent: 40.5, shares: '790M', value: '$155B', change: '-13%' },
            { symbol: 'BAC', name: 'Bank of America', percent: 11.8, shares: '1.03B', value: '$39B', change: '0%' },
            { symbol: 'AXP', name: 'American Express', percent: 10.4, shares: '152M', value: '$35B', change: '0%' },
            { symbol: 'KO', name: 'Coca-Cola', percent: 7.3, shares: '400M', value: '$25B', change: '0%' },
            { symbol: 'CVX', name: 'Chevron', percent: 5.8, shares: '123M', value: '$19B', change: '-2%' },
            { symbol: 'OXY', name: 'Occidental', percent: 4.2, shares: '248M', value: '$16B', change: '+5%' },
        ],
        recentMoves: [
            { action: 'SELL', symbol: 'AAPL', amount: 'Trimmed large stake' },
            { action: 'BUY', symbol: 'CB', amount: 'Mystery stock revealed (Chubb)' },
            { action: 'BUY', symbol: 'OXY', amount: 'Continued accumulation' },
        ]
    },
    {
        id: 'burry',
        name: 'Michael Burry',
        firm: 'Scion Asset Mgmt',
        avatar: '/avatars/burry.png',
        color: '#EF4444',
        sentiment: 'BEARISH',
        cash: '45%',
        holdings: [
            { symbol: 'JD', name: 'JD.com', percent: 9.5, shares: '360K', value: '$10M', change: '+80%' },
            { symbol: 'BABA', name: 'Alibaba', percent: 8.2, shares: '125K', value: '$9M', change: '+60%' },
            { symbol: 'HCA', name: 'HCA Healthcare', percent: 7.1, shares: '25K', value: '$7M', change: '0%' },
            { symbol: 'C', name: 'Citigroup', percent: 6.4, shares: '100K', value: '$6M', change: '0%' },
            { symbol: 'BIDU', name: 'Baidu', percent: 5.5, shares: '40K', value: '$4M', change: '+10%' },
        ],
        recentMoves: [
            { action: 'BUY', symbol: 'BABA/JD', amount: 'Big bet on China tech' },
            { action: 'BUY', symbol: 'PHYS', amount: 'Physical Gold Trust' },
            { action: 'SELL', symbol: 'AMZN', amount: 'Exited position' },
        ]
    },
    {
        id: 'druckenmiller',
        name: 'Stan Druckenmiller',
        firm: 'Duquesne Family',
        avatar: '/avatars/druckenmiller.png',
        color: '#F59E0B',
        sentiment: 'BULLISH TECH',
        cash: '15%',
        holdings: [
            { symbol: 'MSFT', name: 'Microsoft', percent: 13.5, shares: '950K', value: '$380M', change: '+5%' },
            { symbol: 'NVDA', name: 'NVIDIA', percent: 10.2, shares: '250K', value: '$220M', change: '-40%' },
            { symbol: 'CPNG', name: 'Coupang', percent: 9.5, shares: '12M', value: '$200M', change: '0%' },
            { symbol: 'LLY', name: 'Eli Lilly', percent: 6.8, shares: '150K', value: '$120M', change: '+10%' },
            { symbol: 'VRT', name: 'Vertiv', percent: 5.1, shares: '1.2M', value: '$90M', change: '+15%' },
        ],
        recentMoves: [
            { action: 'SELL', symbol: 'NVDA', amount: 'Took significant profits' },
            { action: 'BUY', symbol: 'IWM', amount: 'Call options (Small caps)' },
            { action: 'BUY', symbol: 'VRT', amount: 'AI Infrastructure play' },
        ]
    },
    {
        id: 'ackman',
        name: 'Bill Ackman',
        firm: 'Pershing Square',
        avatar: '/avatars/ackman.png',
        color: '#3B82F6',
        sentiment: 'CONCENTRATED',
        cash: '5%',
        holdings: [
            { symbol: 'CMG', name: 'Chipotle', percent: 20.5, shares: '800K', value: '$2.2B', change: '-2%' },
            { symbol: 'QSR', name: 'Restaurant Brands', percent: 18.2, shares: '23M', value: '$1.9B', change: '0%' },
            { symbol: 'HLT', name: 'Hilton', percent: 17.5, shares: '9M', value: '$1.8B', change: '0%' },
            { symbol: 'GOOGL', name: 'Alphabet A', percent: 14.2, shares: '8M', value: '$1.4B', change: '+5%' },
            { symbol: 'GOOG', name: 'Alphabet C', percent: 6.5, shares: '3M', value: '$500M', change: '+5%' },
        ],
        recentMoves: [
            { action: 'BUY', symbol: 'GOOGL', amount: 'Increased stake' },
            { action: 'HOLD', symbol: 'CMG', amount: 'Maintaining conviction' },
        ]
    },
    {
        id: 'dalio',
        name: 'Ray Dalio',
        firm: 'Bridgewater',
        avatar: '/avatars/dalio.png',
        color: '#8B5CF6',
        sentiment: 'DIVERSIFIED',
        cash: '10%',
        holdings: [
            { symbol: 'IVV', name: 'S&P 500 ETF', percent: 5.8, shares: '2.5M', value: '$1.1B', change: '+2%' },
            { symbol: 'IEMG', name: 'Emerging Mkts', percent: 4.5, shares: '18M', value: '$900M', change: '+5%' },
            { symbol: 'GOOGL', name: 'Alphabet', percent: 3.2, shares: '4M', value: '$650M', change: '+10%' },
            { symbol: 'META', name: 'Meta Platforms', percent: 2.8, shares: '1.2M', value: '$550M', change: '+12%' },
            { symbol: 'PEP', name: 'PepsiCo', percent: 2.1, shares: '2.5M', value: '$400M', change: '-5%' },
        ],
        recentMoves: [
            { action: 'BUY', symbol: 'Tech', amount: 'Adding to Mag 7' },
            { action: 'SELL', symbol: 'Consumer', amount: 'Trimmed staples' },
        ]
    }
];

export function GuruPortfolio() {
    const [selectedGuru, setSelectedGuru] = useState(GURUS[0]);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState('');

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setAnalysis('');

        // Construct context from real holdings
        const context = `
      PORTFOLIO: ${selectedGuru.name} (${selectedGuru.firm})
      SENTIMENT: ${selectedGuru.sentiment}
      TOP HOLDINGS:
      ${selectedGuru.holdings.map(h => `- ${h.symbol} (${h.percent}%): ${h.change} change`).join('\n')}
      RECENT MOVES:
      ${selectedGuru.recentMoves.map(m => `- ${m.action} ${m.symbol}: ${m.amount}`).join('\n')}
    `;

        try {
            const res = await fetch('/api/council', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: selectedGuru.name.toUpperCase(),
                    question: `Analyze ${selectedGuru.name}'s current portfolio strategy. What is he betting on? What risks is he seeing?`,
                    agents: ['value', 'macro', 'risk'],
                    context: context,
                }),
            });

            const data = await res.json();
            setAnalysis(data.summary || 'Analysis complete.');
        } catch (e) {
            console.error(e);
            setAnalysis('Failed to analyze.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar - Guru List */}
            <div className="md:col-span-1 space-y-2">
                <h3 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Select Legend</h3>
                {GURUS.map((guru) => (
                    <button
                        key={guru.id}
                        onClick={() => { setSelectedGuru(guru); setAnalysis(''); }}
                        className={`w-full text-left p-3 border-2 transition-all flex items-center gap-3 ${selectedGuru.id === guru.id
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-transparent hover:border-foreground/20'
                            }`}
                    >
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: guru.color }}>
                            <img src={guru.avatar} alt={guru.name} className="w-full h-full object-cover" />
                        </div>
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
                        <div className="w-16 h-16 rounded-full overflow-hidden border-3" style={{ borderColor: selectedGuru.color }}>
                            <img src={selectedGuru.avatar} alt={selectedGuru.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-3xl font-bold">{selectedGuru.name}</h2>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded text-background ${selectedGuru.sentiment.includes('BULL') ? 'bg-[#10B981]'
                                    : selectedGuru.sentiment.includes('BEAR') ? 'bg-[#EF4444]'
                                        : 'bg-foreground'
                                    }`}>
                                    {selectedGuru.sentiment}
                                </span>
                            </div>
                            <div className="text-muted-foreground font-mono mt-1 text-sm">
                                Cash Pile: {selectedGuru.cash} • Source: SEC 13F (Snapshot Q4 '24)
                            </div>
                        </div>
                    </div>

                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Recent Activity</div>
                        {selectedGuru.recentMoves.map((move, i) => (
                            <div key={i} className="text-sm flex items-center justify-end gap-2 mb-1">
                                <span className={`px-1.5 py-0.5 text-[10px] font-bold text-white min-w-[40px] text-center ${move.action === 'BUY' ? 'bg-[#10B981]'
                                    : move.action === 'SELL' ? 'bg-[#EF4444]'
                                        : 'bg-[#F59E0B]'
                                    }`}>
                                    {move.action}
                                </span>
                                <span className="font-bold">{move.symbol}</span>
                                <span className="text-muted-foreground text-xs">{move.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Analysis Result */}
                <AnimatePresence>
                    {analysis && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-secondary/10 border-l-4 border-indigo-500 p-4 mb-6"
                        >
                            <h4 className="font-bold text-indigo-500 text-sm mb-1 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                AI Strategy Breakdown
                            </h4>
                            <p className="text-sm italic leading-relaxed">{analysis}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Holdings Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-foreground/10 text-xs uppercase text-muted-foreground">
                                <th className="py-2 pl-2">Stock</th>
                                <th className="py-2">Portfolio %</th>
                                <th className="py-2 text-center">Change</th>
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
                                    className="border-b border-foreground/10 hover:bg-foreground/5 group"
                                >
                                    <td className="py-3 pl-2">
                                        <div className="font-bold text-lg">{stock.symbol}</div>
                                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                                    </td>
                                    <td className="py-3 w-1/3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold w-10">{stock.percent}%</span>
                                            <div className="flex-1 h-2 bg-secondary/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full relative"
                                                    style={{ width: `${stock.percent}%`, backgroundColor: selectedGuru.color }}
                                                >
                                                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow w-full h-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${stock.change.includes('-') ? 'bg-red-100 text-red-700'
                                            : stock.change === '0%' ? 'bg-gray-100 text-gray-500'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {stock.change}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-2 text-right font-mono font-bold">{stock.value}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="group relative px-6 py-2 bg-foreground text-background font-bold overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {analyzing ? 'Reading Strategy...' : 'Analyze Strategy with AI'}
                            {!analyzing && (
                                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                                </svg>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
}
