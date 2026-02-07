'use client';

import { useState, useEffect } from 'react';
import type { InsiderTransaction, ClusterSignal } from '@/lib/insider-trading';
import { getInsiderTransactions, analyzeCluster } from '@/lib/insider-trading';

interface InsiderTradingListProps {
    symbol: string;
}

export function InsiderTradingList({ symbol }: InsiderTradingListProps) {
    const [transactions, setTransactions] = useState<InsiderTransaction[]>([]);
    const [signal, setSignal] = useState<ClusterSignal>('Neutral');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setIsLoading(true);
            const data = await getInsiderTransactions(symbol);
            setTransactions(data);
            setSignal(analyzeCluster(data));
            setIsLoading(false);
        }
        load();
    }, [symbol]);

    if (isLoading) {
        return <div className="p-4 text-muted-foreground text-sm animate-pulse">Loading insider data...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Cluster Signal */}
            <div className="flex items-center justify-between p-4 border border-foreground/20 bg-secondary/10">
                <div>
                    <h3 className="font-bold text-sm uppercase tracking-wide">Insider Signal</h3>
                    <p className="text-xs text-muted-foreground">Based on recent cluster activity</p>
                </div>
                <div className={`px-3 py-1 font-bold text-sm border-2 ${signal === 'Bullish' ? 'border-green-500 text-green-600 bg-green-500/10' :
                        signal === 'Bearish' ? 'border-red-500 text-red-600 bg-red-500/10' :
                            'border-foreground/30 text-muted-foreground'
                    }`}>
                    {signal.toUpperCase()}
                </div>
            </div>

            {/* Transactions Table */}
            <div className="border-2 border-foreground overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-foreground text-background">
                        <tr>
                            <th className="p-3 text-left font-bold uppercase text-xs">Date</th>
                            <th className="p-3 text-left font-bold uppercase text-xs">Name / Title</th>
                            <th className="p-3 text-left font-bold uppercase text-xs">Type</th>
                            <th className="p-3 text-right font-bold uppercase text-xs">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className="border-b border-foreground/10 hover:bg-foreground/5 transition-colors">
                                <td className="p-3 font-mono text-xs">{t.date}</td>
                                <td className="p-3">
                                    <div className="font-bold">{t.insiderName}</div>
                                    <div className="text-xs text-muted-foreground">{t.title}</div>
                                </td>
                                <td className="p-3">
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${t.type === 'Buy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            t.type === 'Sell' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                        {t.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-3 text-right font-mono">
                                    ${(t.value).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No recent insider activity found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
                * Data is delayed by 15 minutes. Source: SEC Form 4 Filings.
            </p>
        </div>
    );
}
