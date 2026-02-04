'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StockAutocomplete } from './stock-autocomplete';

interface AgentVote {
    agentId: string;
    agentName: string;
    vote: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
    confidence: number;
    reasoning: string;
    keyMetrics: string[];
}

interface CouncilDecision {
    symbol: string;
    question: string;
    timestamp: string;
    votes: AgentVote[];
    consensus: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
    consensusStrength: number;
    summary: string;
}

const AGENT_INFO: Record<string, { avatar: string; color: string; title: string }> = {
    value: { avatar: '/avatars/buffett.png', color: '#10B981', title: 'Value Strategist' },
    growth: { avatar: '/avatars/lynch.png', color: '#3B82F6', title: 'Growth Hunter' },
    risk: { avatar: '/avatars/burry.png', color: '#EF4444', title: 'Risk Analyst' },
    macro: { avatar: '/avatars/druckenmiller.png', color: '#F59E0B', title: 'Macro Strategist' },
    quant: { avatar: '/avatars/greenblatt.png', color: '#8B5CF6', title: 'Quant Specialist' },
};

const VOTE_COLORS: Record<string, string> = {
    'STRONG_BUY': '#10B981',
    'BUY': '#34D399',
    'HOLD': '#F59E0B',
    'SELL': '#F87171',
    'STRONG_SELL': '#EF4444',
};

export function CouncilPanel() {
    const [symbol, setSymbol] = useState('');
    const [question, setQuestion] = useState('');
    const [decision, setDecision] = useState<CouncilDecision | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConveneCouncil = async () => {
        if (!symbol.trim()) {
            setError('Enter a stock symbol');
            return;
        }

        setLoading(true);
        setError('');
        setDecision(null);

        try {
            const res = await fetch('/api/council', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symbol: symbol.toUpperCase(),
                    question: question || `Should I invest in ${symbol.toUpperCase()}?`,
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setDecision(data);
        } catch (err: any) {
            setError(err.message || 'Failed to get council decision');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-2 border-foreground p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Investment Council
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
                Get analysis from 5 legendary investors with different perspectives
            </p>

            {/* Input */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="flex gap-2">
                    <StockAutocomplete
                        value={symbol}
                        onChange={setSymbol}
                        placeholder="Stock symbol (e.g., AAPL)"
                        className="flex-1"
                    />
                    <button
                        onClick={handleConveneCouncil}
                        disabled={loading}
                        className="px-4 py-2 bg-foreground text-background text-sm font-bold hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : 'Convene Council'}
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Your question (optional)"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="border-2 border-foreground bg-background px-3 py-2 text-sm focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor]"
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="inline-flex gap-3 animate-pulse">
                        {Object.values(AGENT_INFO).map((a, i) => (
                            <div key={i} className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: a.color, animationDelay: `${i * 0.1}s` }}>
                                <img src={a.avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Council is deliberating...</p>
                </div>
            )}

            {/* Results */}
            <AnimatePresence>
                {decision && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Consensus Banner */}
                        <div
                            className="p-4 mb-4 text-center"
                            style={{ backgroundColor: VOTE_COLORS[decision.consensus] + '20' }}
                        >
                            <div className="text-2xl font-bold mb-1" style={{ color: VOTE_COLORS[decision.consensus] }}>
                                {decision.consensus.replace('_', ' ')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Consensus Strength: {decision.consensusStrength}%
                            </div>
                            <p className="text-sm mt-2">{decision.summary}</p>
                        </div>

                        {/* Individual Votes */}
                        <div className="space-y-3">
                            {decision.votes.map((vote, idx) => {
                                const info = AGENT_INFO[vote.agentId] || { avatar: '/avatars/buffett.png', color: '#666', title: 'Analyst' };
                                return (
                                    <motion.div
                                        key={vote.agentId}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="border border-foreground/20 p-3"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
                                                style={{ borderColor: info.color }}
                                            >
                                                <img src={info.avatar} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div>
                                                        <span className="font-bold">{vote.agentName}</span>
                                                        <span className="text-xs text-muted-foreground ml-2">{info.title}</span>
                                                    </div>
                                                    <span
                                                        className="text-xs font-bold px-2 py-1"
                                                        style={{
                                                            backgroundColor: VOTE_COLORS[vote.vote],
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {vote.vote.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{vote.reasoning}</p>
                                                {vote.keyMetrics.length > 0 && (
                                                    <div className="flex gap-2 mt-2">
                                                        {vote.keyMetrics.slice(0, 3).map((metric, i) => (
                                                            <span key={i} className="text-xs bg-secondary px-2 py-0.5">
                                                                {metric}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Confidence: {vote.confidence}%
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
