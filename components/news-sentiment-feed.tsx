'use client';

import React, { useState, useEffect } from 'react';

interface NewsItem {
    id: string;
    headline: string;
    summary: string;
    source: string;
    url: string;
    datetime: number;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

export function NewsSentimentFeed({ symbol }: { symbol: string }) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSentiment() {
            try {
                const res = await fetch(`/api/news-sentiment?symbol=${symbol}`);
                const data = await res.json();
                if (data.news) {
                    setNews(data.news);
                }
            } catch (error) {
                console.error("Sentiment news fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSentiment();
    }, [symbol]);

    if (loading) return <div className="h-48 flex items-center justify-center border-2 border-foreground/10 bg-secondary/5 font-mono text-xs uppercase opacity-50 animate-pulse">Analyzing Headlines...</div>;
    if (news.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="text-primary italic">Live</span> AI News Sentiment
            </h3>
            <div className="space-y-4">
                {news.map((item) => (
                    <div key={item.id} className="border-2 border-foreground/10 p-4 transition-all hover:border-foreground/30 bg-secondary/5">
                        <div className="flex justify-between items-start gap-4 mb-2">
                            <h4 className="font-bold text-sm sm:text-base leading-tight">{item.headline}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border ${item.sentiment === 'Bullish' ? 'border-bullish text-bullish bg-bullish/5' :
                                item.sentiment === 'Bearish' ? 'border-bearish text-bearish bg-bearish/5' :
                                    'border-foreground/20 text-muted-foreground'
                                }`}>
                                {item.sentiment}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.summary}</p>
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tighter opacity-60">
                            <span>{item.source} • {new Date(item.datetime * 1000).toLocaleTimeString()}</span>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">See Source ↗</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
