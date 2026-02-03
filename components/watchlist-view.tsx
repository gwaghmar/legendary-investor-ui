'use client';

import { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface WatchlistItem {
    symbol: string;
    price: number;
    change: number;
    aiSignal: 'BUY' | 'SELL' | 'HOLD';
    aiOneLiner: string;
}

// Mock data for demo - in real app, fetch from API
const MOCK_DATA: Record<string, Partial<WatchlistItem>> = {
    'NVDA': { price: 135.50, change: 2.5, aiSignal: 'BUY', aiOneLiner: 'Dominant moat in AI chips.' },
    'TSLA': { price: 250.00, change: -1.2, aiSignal: 'SELL', aiOneLiner: 'Valuation disconnected from fundamentals.' },
    'AAPL': { price: 230.10, change: 0.5, aiSignal: 'HOLD', aiOneLiner: 'Stable cash flow, low growth.' },
    'PLTR': { price: 65.00, change: 4.2, aiSignal: 'BUY', aiOneLiner: 'Gov contracts expanding rapidly.' },
};

export function WatchlistView() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [input, setInput] = useState('');

    const handleAddItem = async () => {
        const symbol = input.toUpperCase().trim();
        if (!symbol) return;
        if (items.find(i => i.symbol === symbol)) return; // No duplicates

        // Initialize with loading state
        const tempId = Date.now().toString();
        setItems(prev => [...prev, {
            symbol,
            price: 0, // Placeholder
            change: 0,
            aiSignal: 'HOLD',
            aiOneLiner: 'Loading AI Analysis...',
        }]);

        setInput('');

        // Fetch Real AI Analysis
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: JSON.stringify({ symbol, price: 100 }), // Sending dummy price for now
            });
            const data = await res.json();

            setItems(prev => prev.map(item => {
                if (item.symbol === symbol) {
                    return {
                        ...item,
                        price: 100 + (Math.random() * 10), // Still random price until I get a real API
                        change: (Math.random() * 10) - 5,
                        aiSignal: data.signal,
                        aiOneLiner: data.oneLiner
                    };
                }
                return item;
            }));
        } catch (e) {
            console.error(e);
            setItems(prev => prev.map(item => {
                if (item.symbol === symbol) {
                    return { ...item, aiOneLiner: 'AI Failed to analyze.' };
                }
                return item;
            }));
        }
    };

    const handleRemove = (symbol: string) => {
        setItems(prev => prev.filter(i => i.symbol !== symbol));
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add Symbol (e.g. MSFT)..."
                    className="flex-1 bg-background border-2 border-foreground px-4 py-3 font-mono uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor] transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                />
                <button
                    onClick={handleAddItem}
                    className="bg-foreground text-background px-6 font-bold uppercase hover:bg-foreground/80 transition-colors"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            <div className="space-y-3">
                {items.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-foreground/20 text-muted-foreground">
                        No symbols watching. Add one to see AI insights.
                    </div>
                )}

                {items.map((item) => (
                    <div key={item.symbol} className="border-2 border-foreground p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background group hover:translate-x-1 transition-transform">

                        {/* Left: Symbol & Price */}
                        <div className="flex items-center gap-4 min-w-[150px]">
                            <div className="w-12 h-12 bg-foreground text-background flex items-center justify-center font-bold text-xl">
                                {item.symbol[0]}
                            </div>
                            <div>
                                <div className="font-bold text-lg">{item.symbol}</div>
                                <div className="font-mono text-sm flex items-center gap-2">
                                    ${item.price.toFixed(2)}
                                    <span className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Middle: AI Signal */}
                        <div className="flex-1 border-l-2 border-foreground/10 pl-4 sm:pl-8">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`
                  text-xs font-bold px-2 py-0.5 rounded text-white
                  ${item.aiSignal === 'BUY' ? 'bg-green-600' : (item.aiSignal === 'SELL' ? 'bg-red-600' : 'bg-yellow-600')}
                `}>
                                    AI {item.aiSignal}
                                </span>
                                <span className="text-xs text-muted-foreground font-mono">
                                    Confidence: {(Math.random() * 40 + 60).toFixed(0)}%
                                </span>
                            </div>
                            <p className="text-sm font-medium leading-tight">
                                "{item.aiOneLiner}"
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <button
                            onClick={() => handleRemove(item.symbol)}
                            className="p-2 hover:bg-red-100 text-red-600 transition-colors self-end sm:self-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
