'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
    content: string;
    symbol: string;
    filingType: string;
    filingDate: string;
    score: number;
}

export function SecSearch() {
    const [query, setQuery] = useState('');
    const [symbol, setSymbol] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState('');

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setAnalysis('');

        try {
            const res = await fetch('/api/rag/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    symbol: symbol.toUpperCase() || undefined,
                    topK: 3
                }),
            });

            const data = await res.json();
            if (data.results) {
                setResults(data.results);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAIAnalysis = async () => {
        if (results.length === 0) return;

        setAnalyzing(true);
        try {
            // We'll use the debate API slightly hacked for analysis, or create a new one.
            // For now, let's use the Council API which is robust enough to answer questions with context.
            const context = results.map(r => r.content).join('\n\n');

            const res = await fetch('/api/council', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: symbol || 'DATA',
                    question: `Analyze these SEC filing excerpts based on: "${query}". Give a summary of key insights.`,
                    agents: ['value', 'risk'], // Use Buffett and Burry for analysis
                    context: context,
                }),
            });

            const data = await res.json();
            setAnalysis(data.summary || data.votes?.[0]?.reasoning || 'Could not analyze.');
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="border-2 border-foreground p-6 bg-background">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span>📜</span> SEC Filing Search (RAG)
            </h2>
            <p className="text-muted-foreground mb-6">
                Search through millions of rows of SEC filings using AI.
                Ask questions like "What are the risk factors?" or "Revenue growth trends".
            </p>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Symbol (Optional, e.g. AAPL)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-32 border-2 border-foreground px-3 py-2 font-mono text-sm focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor]"
                />
                <input
                    type="text"
                    placeholder="Search query (e.g. 'Share buybacks')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-2 border-foreground px-3 py-2 text-sm focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor]"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-foreground text-background px-6 py-2 font-bold hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search Docs'}
                </button>
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                                Found {results.length} relevant excerpts
                            </h3>
                            <button
                                onClick={handleAIAnalysis}
                                disabled={analyzing}
                                className="text-xs bg-indigo-600 text-white px-3 py-1 font-bold hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {analyzing ? 'AI Analyzing...' : '✨ Generate AI Summary'}
                            </button>
                        </div>

                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-secondary/20 p-4 border border-indigo-500/30 rounded"
                            >
                                <div className="text-xs font-bold text-indigo-500 mb-1">AI INSIGHTS</div>
                                <p className="text-sm italic">{analysis}</p>
                            </motion.div>
                        )}

                        {results.map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="border border-foreground/10 p-3 bg-secondary/5"
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-xs bg-foreground text-background px-1.5 py-0.5">
                                        {r.symbol} {r.filingType}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{r.filingDate}</span>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                    "...{r.content}..."
                                </p>
                                <div className="mt-1 text-xs text-right opacity-50">
                                    Relevance: {Math.round(r.score * 100)}%
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
