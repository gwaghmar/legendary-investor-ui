'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface WatchlistItem {
    id?: string; // DB ID
    symbol: string;
    price: number;
    change: number;
    aiSignal: 'BUY' | 'SELL' | 'HOLD' | 'ANALYZING';
    aiOneLiner: string;
}

export function WatchlistView() {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [input, setInput] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // 1. Load User & Watchlist
    const loadItems = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
            const { data } = await supabase
                .from('watchlists')
                .select('*')
                .order('added_at', { ascending: false });

            if (data) {
                // Initial load: Symbols only, analysis comes later
                const loadedItems: WatchlistItem[] = data.map((d: any) => ({
                    id: d.id,
                    symbol: d.symbol,
                    price: 0,
                    change: 0,
                    aiSignal: 'ANALYZING',
                    aiOneLiner: 'Queued for analysis...',
                }));
                setItems(loadedItems);

                // Trigger batch analysis (simulated one-by-one for now)
                loadedItems.forEach(item => analyzeItem(item.symbol));
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadItems();
    }, [loadItems]);

    // Helper to run analysis
    const analyzeItem = async (symbol: string) => {
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: JSON.stringify({ symbol, price: 0 }),
            });
            const data = await res.json();

            setItems(prev => prev.map(item => {
                if (item.symbol === symbol) {
                    return {
                        ...item,
                        price: 100 + (Math.random() * 20), // Placeholder price
                        change: (Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
                        aiSignal: data.signal || 'HOLD',
                        aiOneLiner: data.oneLiner || 'Analysis complete.'
                    };
                }
                return item;
            }));
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddItem = async () => {
        const symbol = input.toUpperCase().trim();
        if (!symbol) return;
        if (items.find(i => i.symbol === symbol)) return; // No duplicates

        const newItem: WatchlistItem = {
            symbol,
            price: 0,
            change: 0,
            aiSignal: 'ANALYZING',
            aiOneLiner: 'Processing...',
        };

        // Optimistic UI update
        setItems(prev => [newItem, ...prev]);
        setInput('');

        // Persist if logged in
        if (user) {
            const { data, error } = await supabase.from('watchlists').insert({
                user_id: user.id,
                symbol
            }).select().single();

            if (!error && data) {
                // Update with real ID
                setItems(prev => prev.map(i => i.symbol === symbol ? { ...i, id: data.id } : i));
            }
        }

        // Trigger Analysis
        analyzeItem(symbol);
    };

    const handleRemove = async (symbol: string, id?: string) => {
        // Optimistic remove
        setItems(prev => prev.filter(i => i.symbol !== symbol));

        if (user && id) {
            await supabase.from('watchlists').delete().eq('id', id);
        } else if (user) {
            // Fallback if ID missing (shouldn't happen often)
            await supabase.from('watchlists').delete().match({ user_id: user.id, symbol });
        }
    };

    if (loading) return <div className="text-center py-12 text-muted-foreground animate-pulse">Syncing Watchlist...</div>;

    return (
        <div className="space-y-6">
            {!user && (
                <div className="bg-yellow-50/50 border border-yellow-200 p-3 rounded text-xs text-yellow-800 text-center">
                    Note: Your watchlist is temporary. <a href="/login" className="underline font-bold">Sign In</a> to save it permanently.
                </div>
            )}

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
                    <div key={item.symbol} className="border-2 border-foreground p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background group hover:translate-x-1 transition-transform relative">
                        {/* Status Indicator */}
                        {item.aiSignal === 'ANALYZING' && (
                            <div className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                            </div>
                        )}

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
                                  ${item.aiSignal === 'BUY' ? 'bg-green-600' : (item.aiSignal === 'SELL' ? 'bg-red-600' : (item.aiSignal === 'ANALYZING' ? 'bg-gray-400' : 'bg-yellow-600'))}
                                `}>
                                    AI {item.aiSignal}
                                </span>
                            </div>
                            <p className="text-sm font-medium leading-tight">
                                "{item.aiOneLiner}"
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <button
                            onClick={() => handleRemove(item.symbol, item.id)}
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
