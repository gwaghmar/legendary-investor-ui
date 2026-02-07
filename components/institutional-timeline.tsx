'use client';

import React, { useState, useEffect } from 'react';

interface FilingEvent {
    id?: string;
    date: string;
    legend: string;
    action: 'BUY' | 'SELL' | 'NEW' | 'EXIT' | 'Activity' | 'Insight';
    amount: string;
    price: string;
}

export function InstitutionalTimeline({ symbol }: { symbol: string }) {
    const [events, setEvents] = useState<FilingEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTimeline() {
            try {
                const res = await fetch(`/api/institutional-filings?symbol=${symbol}`);
                const data = await res.json();
                if (data.events) {
                    setEvents(data.events.map((e: any) => ({
                        id: e.id,
                        date: e.date,
                        legend: e.legendId === 'anonymous' ? 'Institutional' : e.legendId,
                        action: e.action === 'Activity' ? 'BUY' : e.action === 'Insight' ? 'NEW' : e.action,
                        amount: 'Update',
                        price: 'Latest'
                    })));
                }
            } catch (error) {
                console.error("Timeline fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTimeline();
    }, [symbol]);

    if (loading) return <div className="h-64 flex items-center justify-center border-t-2 border-foreground/10 bg-secondary/5 font-mono text-xs uppercase opacity-50 animate-pulse">Syncing Filings...</div>;

    return (
        <div className="mt-8 py-8 border-t-2 border-foreground/10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-10 flex items-center gap-2">
                <span className="text-secondary">✦</span> Legendary Activity Timeline
            </h3>

            <div className="relative">
                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-foreground/10" />

                <div className="space-y-12">
                    {events.map((event, index) => (
                        <div key={index} className="relative pl-8 group">
                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background z-10 ${event.action === 'BUY' || event.action === 'NEW' ? 'bg-bullish' : 'bg-bearish'
                                } group-hover:scale-125 transition-transform`} />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{event.date}</span>
                                    <span className="font-bold text-sm underline decoration-secondary/30 decoration-2 underline-offset-4">{event.legend}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`px-2 py-0.5 text-[10px] font-bold uppercase border-2 ${event.action === 'BUY' || event.action === 'NEW' ? 'border-bullish/50 text-bullish' : 'border-bearish/50 text-bearish'
                                        }`}>
                                        {event.action}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold">{event.amount}</div>
                                        <div className="text-[10px] opacity-50">Avg Price: {event.price}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 px-4 py-2 border border-foreground/5 bg-secondary/5 text-[10px] uppercase font-bold tracking-tighter opacity-50 text-center">
                Visualizing SEC 13F-HR Filings via Legend Lenses™
            </div>
        </div>
    );
}
