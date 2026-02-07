'use client';

import { useState, useEffect } from 'react';
import type { EarningsCall, TranscriptSegment } from '@/lib/transcripts';
import { getTranscript, searchTranscripts } from '@/lib/transcripts';

interface TranscriptSearchProps {
    symbol: string;
}

export function TranscriptSearch({ symbol }: TranscriptSearchProps) {
    const [transcript, setTranscript] = useState<EarningsCall | null>(null);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            const data = await getTranscript(symbol);
            setTranscript(data);
            setIsLoading(false);
        }
        load();
    }, [symbol]);

    const filteredSegments = transcript ? searchTranscripts(transcript, query) : [];

    if (isLoading) {
        return (
            <div className="p-8 space-y-4 animate-pulse">
                <div className="h-8 bg-foreground/10 rounded w-1/3 mb-6" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                        <div className="w-12 h-12 bg-foreground/10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-foreground/10 rounded w-1/4" />
                            <div className="h-4 bg-foreground/10 rounded w-full" />
                            <div className="h-4 bg-foreground/10 rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!transcript) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-foreground/20 text-muted-foreground">
                <p>No transcript data available for {symbol}.</p>
                <p className="text-xs mt-2">(Try AAPL, TSLA, or MSFT for demo)</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-foreground/10">
                <div>
                    <h3 className="font-bold text-lg">{transcript.quarter} {transcript.year} Earnings Call</h3>
                    <p className="text-sm text-muted-foreground">{transcript.date}</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search transcript..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-background border-2 border-foreground px-3 py-1.5 pr-8 text-sm focus:outline-none focus:bg-foreground/5 font-mono"
                    />
                    <svg className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Segments List */}
            <div className="space-y-6">
                {filteredSegments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No matches found for "{query}"
                    </div>
                ) : (
                    filteredSegments.map((segment) => (
                        <div key={segment.id} className="flex gap-4 group">
                            <div className="flex-shrink-0 flex flex-col items-center gap-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 
                            ${segment.role === 'executive' ? 'bg-primary/10 border-primary text-primary' :
                                        segment.role === 'analyst' ? 'bg-secondary border-foreground/50' :
                                            'bg-muted border-transparent'}`}>
                                    {segment.speaker.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">{segment.time}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">{segment.speaker}</span>
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-foreground/20 px-1.5 rounded-sm">
                                        {segment.role}
                                    </span>
                                    {segment.sentiment === 'positive' && <span className="text-green-500 text-xs">▲</span>}
                                    {segment.sentiment === 'negative' && <span className="text-red-500 text-xs">▼</span>}
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/90">
                                    {highlightText(segment.text, query)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Helper to highlight search matches
function highlightText(text: string, query: string) {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200 dark:bg-yellow-900 text-foreground font-semibold px-0.5 rounded-sm">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
}
