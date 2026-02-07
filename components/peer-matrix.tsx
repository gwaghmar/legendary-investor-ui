'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PeerNode {
    symbol: string;
    growth: number;
    valuation: number; // 100 - P/E score (higher is cheaper)
    marketCap: string;
}

export function PeerMatrix({ symbol }: { symbol: string }) {
    const [peers, setPeers] = useState<PeerNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPeers() {
            try {
                const res = await fetch(`/api/peers?symbol=${symbol}`);
                const data = await res.json();
                if (data.peers) {
                    setPeers(data.peers);
                }
            } catch (error) {
                console.error("Peers fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPeers();
    }, [symbol]);

    if (loading) return <div className="h-64 flex items-center justify-center border-t-2 border-foreground/10 bg-secondary/5 font-mono text-xs uppercase opacity-50 animate-pulse">Mapping Ecosystem...</div>;
    if (peers.length === 0) return null;

    return (
        <div className="mt-12 py-12 border-t-2 border-foreground/10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-10 flex items-center gap-2">
                <span className="text-primary italic">Visual</span> Peer Matrix: Growth vs Valuation
            </h3>

            <div className="relative aspect-square sm:aspect-video border-2 border-foreground/20 bg-secondary/5 rounded-sm p-8">
                {/* Labels */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest opacity-40">High Growth</div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest opacity-40">Value / Low Growth</div>
                <div className="absolute left-4 top-1/2 -rotate-90 origin-left text-[10px] font-bold uppercase tracking-widest opacity-40">Expensive</div>
                <div className="absolute right-4 top-1/2 rotate-90 origin-right text-[10px] font-bold uppercase tracking-widest opacity-40">Cheap / Undervalued</div>

                {/* Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <div className="w-full h-0.5 bg-foreground" />
                    <div className="h-full w-0.5 bg-foreground -ml-0.5" />
                </div>

                {/* Quadrant Labels */}
                <div className="absolute top-8 right-8 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-20 text-right">Growth Traps?</div>
                <div className="absolute top-8 left-8 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-20">Perfect Setup?</div>
                <div className="absolute bottom-8 left-8 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-20">Value Traps?</div>
                <div className="absolute bottom-8 right-8 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-20">Unloved Gems?</div>

                {/* Peer Nodes */}
                {peers.map((peer) => (
                    <Link
                        key={peer.symbol}
                        href={`/analyze/${peer.symbol}`}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all hover:z-50`}
                        style={{
                            left: `${Math.min(90, Math.max(10, peer.valuation))}%`,
                            bottom: `${Math.min(90, Math.max(10, peer.growth))}%`
                        }}
                    >
                        <div className={`w-10 h-10 sm:w-14 sm:h-14 border-2 border-foreground flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold uppercase transition-all ${peer.symbol === symbol.toUpperCase()
                            ? 'bg-primary text-white scale-110'
                            : 'bg-background hover:bg-secondary'
                            } shadow-brutalist`}>
                            {peer.symbol}
                            <span className="text-[8px] opacity-50 font-mono tracking-tighter">{peer.marketCap}</span>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[8px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            Growth: {peer.growth.toFixed(1)}% | cheapness: {peer.valuation.toFixed(1)}/100
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-6 text-[10px] uppercase font-bold tracking-tighter opacity-50 text-center">
                Interactive Peer Positioning based on TTM Growth and Indicated Yield
            </div>
        </div>
    );
}
