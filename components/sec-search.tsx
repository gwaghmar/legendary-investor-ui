import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StockAutocomplete } from './stock-autocomplete';

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

// Popular stocks to auto-load filings for
const POPULAR_SYMBOLS = ['AAPL', 'NVDA', 'GOOGL', 'MSFT', 'META', 'TSLA', 'AMZN'];

// Filing Definitions Dictionary
const FILING_DEFINITIONS: Record<string, { label: string; desc: string; isWhale?: boolean }> = {
    '10-K': { label: 'Annual Report', desc: 'The comprehensive truth about the company health. Read this.' },
    '10-Q': { label: 'Quarterly Report', desc: 'Updates on performance from the last 3 months.' },
    '8-K': { label: 'Major Event', desc: 'Something big happened: CEO fired, merger, lawsuit, or earnings release.' },
    '4': { label: 'Insider Trade', desc: ' Executives/Directors buying or selling their own stock.', isWhale: true },
    '13F': { label: 'Whale Report', desc: 'What big hedge funds (and Buffett) are buying.', isWhale: true },
    'S-1': { label: 'IPO Paperwork', desc: 'New company going public.' },
    'DEF 14A': { label: 'Proxy Statement', desc: 'Voting info: Executive pay, board members, and shareholder proposals.' },
};

function getFilingInfo(formType: string) {
    // Handle variations like "10-K/A" or "4/A" (Amendments)
    const baseType = formType.split('/')[0];
    return FILING_DEFINITIONS[baseType] || FILING_DEFINITIONS[formType] || { label: formType, desc: 'Official SEC Filing' };
}

export function SecSearch() {
    const [query, setQuery] = useState('');
    const [symbol, setSymbol] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [liveFilings, setLiveFilings] = useState<FilingRaw[]>([]);
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [currentSymbol, setCurrentSymbol] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Auto-fetch filings for a popular stock on mount
    useEffect(() => {
        const randomSymbol = POPULAR_SYMBOLS[Math.floor(Math.random() * POPULAR_SYMBOLS.length)];
        fetchFilings(randomSymbol);
    }, []);

    const fetchFilings = async (sym: string) => {
        if (!sym.trim()) return;

        setLoading(true);
        setCurrentSymbol(sym.toUpperCase());

        try {
            const res = await fetch(`/api/sec/filings?symbol=${sym}`);
            const data = await res.json();

            if (data.filings) {
                setLiveFilings(data.filings);
                setCompanyName(data.name || sym);
            } else if (data.error) {
                console.error('SEC Error:', data.error);
                setLiveFilings([]);
            }
        } catch (err) {
            console.error("SEC API Error", err);
            setLiveFilings([]);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    const handleSearch = async () => {
        if (!query.trim() && !symbol.trim()) return;

        setLoading(true);
        setAnalysis('');
        setResults([]);

        try {
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
                promises.push(fetchFilings(symbol));
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
                    context: context,
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    SEC Intelligence
                </h2>
                <p className="text-muted-foreground text-sm">
                    Access the EDGAR database directly. View live SEC filings for major companies.
                </p>
            </div>

            {/* Quick Symbol Buttons */}
            <div className="mb-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Quick Access:</div>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_SYMBOLS.map((sym) => (
                        <button
                            key={sym}
                            onClick={() => fetchFilings(sym)}
                            className={`px-3 py-1 text-xs font-bold border-2 transition-all ${currentSymbol === sym
                                ? 'bg-foreground text-background border-foreground'
                                : 'border-foreground/30 hover:border-foreground'
                                }`}
                        >
                            {sym}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-2 mb-8 sticky top-0 bg-background z-10 py-2 border-b border-foreground/10">
                <StockAutocomplete
                    value={symbol}
                    onChange={setSymbol}
                    onSelect={(sym) => fetchFilings(sym)}
                    placeholder="Any symbol (e.g. AAPL)"
                    className="w-full md:w-48"
                />
                <input
                    type="text"
                    placeholder="Search query (optional)"
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
                        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            RAG Knowledge Base
                        </h3>
                        {results.length > 0 && (
                            <button
                                onClick={handleAIAnalysis}
                                disabled={analyzing}
                                className="text-xs bg-indigo-600 text-white px-3 py-1 font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
                            >
                                {analyzing ? 'Thinking...' : (
                                    <>
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                                        </svg>
                                        AI Insight
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 p-4 rounded text-sm"
                            >
                                <div className="font-bold mb-1">AI Summary:</div>
                                {analysis}
                            </motion.div>
                        )}

                        {results.length === 0 && !loading && (
                            <div className="text-muted-foreground text-sm italic py-4">
                                Enter a search query to search the knowledge base.
                            </div>
                        )}

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
                            Live EDGAR Feed {companyName && `- ${companyName}`}
                        </h3>
                        <span className="text-xs text-muted-foreground">{liveFilings.length} filings</span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {loading && isInitialLoad && (
                            <div className="text-center py-8 text-muted-foreground animate-pulse">
                                Loading live SEC filings...
                            </div>
                        )}

                        {liveFilings.map((f, i) => {
                            const info = getFilingInfo(f.form);
                            return (
                                <motion.a
                                    key={f.accessionNumber}
                                    href={f.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`block border p-3 transition-all group relative overflow-hidden ${info.isWhale
                                        ? 'border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10'
                                        : 'border-foreground/10 hover:bg-foreground/5 hover:border-foreground/30'
                                        }`}
                                >
                                    {info.isWhale && (
                                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                                            WHALE ALERT
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <div className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                                                    {f.form}
                                                </div>
                                                <div className={`text-xs font-bold px-1.5 py-0.5 rounded border ${info.isWhale
                                                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                                                    : 'bg-secondary text-secondary-foreground border-transparent'
                                                    }`}>
                                                    {info.label}
                                                </div>
                                            </div>

                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                                                "{info.desc}"
                                            </div>

                                            <div className="text-[10px] text-muted-foreground font-mono mt-1 opacity-70">
                                                {f.accessionNumber}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 mt-1">
                                            <div className="font-bold text-xs">{f.filingDate}</div>
                                            <div className="text-[10px] text-blue-500 group-hover:underline mt-1">VIEW →</div>
                                        </div>
                                    </div>

                                    {/* Trader Explanation */}
                                    <div className="mt-2 text-[11px] bg-secondary/50 p-2 rounded border border-foreground/5 text-foreground/80">
                                        <div className="font-bold text-[10px] uppercase tracking-wider mb-0.5 opacity-70">What this means:</div>
                                        {info.isWhale
                                            ? "Big money movement. This investor manages over $100M and is disclosing their positions. Watch for new buys (bullish) or complete exits (bearish)."
                                            : info.label === 'Annual Report'
                                                ? "Review the 'Risk Factors' section closely. This is where they legally have to tell you what could kill the company."
                                                : info.label === 'Quarterly Report'
                                                    ? "Check if revenue is growing and if they are profitable. Compare to the same quarter last year."
                                                    : info.label === 'Insider Trade'
                                                        ? "Insiders sell for many reasons (college tuition, taxes), but they only buy for ONE reason: they think the stock is going up."
                                                        : "Official regulatory disclosure."}
                                    </div>
                                </motion.a>
                            );
                        })}

                        {liveFilings.length === 0 && !loading && (
                            <div className="text-muted-foreground text-sm italic py-4 text-center">
                                No filings found. Try a different symbol.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
