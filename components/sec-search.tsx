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

interface FilingRaw {
    accessionNumber: string;
    filingDate: string;
    form: string;
    primaryDocument: string;
    url: string;
}

export function SecSearch() {
    const [query, setQuery] = useState('');
    const [symbol, setSymbol] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [liveFilings, setLiveFilings] = useState<FilingRaw[]>([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState('');

    const handleSearch = async () => {
        if (!query.trim() && !symbol.trim()) return;

        setLoading(true);
        setAnalysis('');
        setResults([]);
        setLiveFilings([]);

        try {
            // Parallel requests: RAG + Live SEC API
            const promises = [];

            // 1. RAG Search
            if (query.trim()) {
                promises.push(
                    fetch('/api/rag/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query,
                            symbol: symbol.toUpperCase() || undefined,
                            topK: 3
                        }),
                    }).then(res => res.json()).then(data => setResults(data.results || []))
                );
            }

            // 2. Live SEC API (if symbol provided)
            if (symbol.trim()) {
                promises.push(
                    fetch(`/api/sec/filings?symbol=${symbol}`)
                        .then(res => res.json())
                        .then(data => setLiveFilings(data.filings || []))
                        .catch(err => console.error("SEC API Error", err))
                );
            }

            await Promise.all(promises);

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
            const context = results.map(r => r.content).join('\n\n');

            const res = await fetch('/api/council', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: symbol || 'DATA',
                    question: `Analyze these SEC filing excerpts based on: "${query}". Give a summary of key insights.`,
                    agents: ['value', 'risk'],
                    context: context, // Only analyzing RAG content for now as Live content is not ingested yet
                }),
            });

            const data = await res.json();
            setAnalysis(data.summary || 'Could not analyze.');
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="border-2 border-foreground p-6 bg-background min-h-[600px]">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>📜</span> SEC Intelligence
                </h2>
                <p className="text-muted-foreground text-sm">
                    Access the EDGAR database directly. Search ingested vectors (RAG) or view live filing feeds.
                </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-2 mb-8 sticky top-0 bg-background z-10 py-2 border-b border-foreground/10">
                <input
                    type="text"
                    placeholder="Symbol (Required for Live Feed)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full md:w-48 border-2 border-foreground px-3 py-2 font-mono text-sm uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor]"
                />
                <input
                    type="text"
                    placeholder="Search query (e.g. 'Share buybacks', optional)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-2 border-foreground px-3 py-2 text-sm focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor]"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-foreground text-background px-6 py-2 font-bold hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                >
                    {loading ? 'Fetching...' : 'Search EDGAR'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEFT: RAG Results */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-foreground/20 pb-2">
                        <h3 className="font-bold text-sm uppercase tracking-wider">
                            🧠 RAG Knowledge Base
                        </h3>
                        {results.length > 0 && (
                            <button
                                onClick={handleAIAnalysis}
                                disabled={analyzing}
                                className="text-xs bg-indigo-600 text-white px-3 py-1 font-bold hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {analyzing ? 'Thinking...' : '✨ AI Insight'}
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-indigo-50 border border-indigo-200 p-4 rounded text-sm text-indigo-900"
                            >
                                <div className="font-bold mb-1">AI Summary:</div>
                                {analysis}
                            </motion.div>
                        )}

                        {results.length === 0 && !loading && <div className="text-muted-foreground text-sm italic py-4">No ingested documents match query.</div>}

                        {results.map((r, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="border border-foreground/10 p-4 bg-secondary/5 hover:bg-secondary/10 transition-colors"
                            >
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-xs bg-foreground text-background px-2 py-0.5 rounded-sm">
                                        {r.filingType}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-mono">{r.filingDate}</span>
                                </div>
                                <p className="text-sm font-serif leading-relaxed line-clamp-4">
                                    "{r.content}"
                                </p>
                                <div className="mt-2 text-[10px] text-right opacity-50 uppercase tracking-widest font-bold">
                                    Match Score: {(r.score * 100).toFixed(1)}%
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* RIGHT: Live Feed */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-foreground/20 pb-2">
                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="animate-pulse bg-green-500 w-2 h-2 rounded-full inline-block"></span>
                            Live EDGAR Feed
                        </h3>
                        <span className="text-xs text-muted-foreground">{liveFilings.length} found</span>
                    </div>

                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {liveFilings.map((f, i) => (
                            <motion.a
                                key={f.accessionNumber}
                                href={f.url}
                                target="_blank"
                                rel="noreferrer"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="block border border-foreground/10 p-3 hover:bg-foreground/5 hover:border-foreground/30 transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                                            {f.form}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-mono">
                                            File: {f.accessionNumber}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-xs">{f.filingDate}</div>
                                        <div className="text-[10px] text-muted-foreground">CLICK TO VIEW</div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                        {liveFilings.length === 0 && !loading && (
                            <div className="text-muted-foreground text-sm italic py-4">
                                Enter a symbol to see live filings.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
