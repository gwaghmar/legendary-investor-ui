'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

// 20+ legendary investor quotes
const legendaryQuotes = [
    { quote: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
    { quote: "Be fearful when others are greedy and greedy when others are fearful.", author: "Warren Buffett" },
    { quote: "Price is what you pay. Value is what you get.", author: "Warren Buffett" },
    { quote: "It takes 20 years to build a reputation and five minutes to ruin it.", author: "Warren Buffett" },
    { quote: "The big money is not in the buying and selling, but in the waiting.", author: "Charlie Munger" },
    { quote: "Invert, always invert.", author: "Charlie Munger" },
    { quote: "All intelligent investing is value investing.", author: "Charlie Munger" },
    { quote: "I'm not a perma-bear, I'm a realist.", author: "Michael Burry" },
    { quote: "The market can stay irrational longer than you can stay solvent.", author: "John Maynard Keynes" },
    { quote: "Know what you own, and know why you own it.", author: "Peter Lynch" },
    { quote: "Go for a business that any idiot can run – because sooner or later, any idiot is going to run it.", author: "Peter Lynch" },
    { quote: "The key is not to predict but to be prepared.", author: "Stan Druckenmiller" },
    { quote: "I've learned many things from George Soros, but perhaps the most significant is that it's not whether you're right or wrong, but how much money you make when you're right.", author: "Stan Druckenmiller" },
    { quote: "The way to make money is to buy when blood is running in the streets.", author: "John D. Rockefeller" },
    { quote: "In investing, what is comfortable is rarely profitable.", author: "Robert Arnott" },
    { quote: "The four most dangerous words in investing are: 'This time it's different.'", author: "John Templeton" },
    { quote: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
    { quote: "Never confuse genius with a bull market.", author: "John Bogle" },
    { quote: "Time in the market beats timing the market.", author: "Ken Fisher" },
    { quote: "The individual investor should act consistently as an investor and not as a speculator.", author: "Benjamin Graham" },
];

interface RecentAnalysis {
    symbol: string;
    date: string;
    signal: string;
}

export default function DashboardPage() {
    const [dailyQuote, setDailyQuote] = useState(legendaryQuotes[0]);
    const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);

    useEffect(() => {
        // Select random quote on mount
        const randomIndex = Math.floor(Math.random() * legendaryQuotes.length);
        setDailyQuote(legendaryQuotes[randomIndex]);

        // Load recent analyses from localStorage
        try {
            const stored = localStorage.getItem('recentAnalyses');
            if (stored) {
                setRecentAnalyses(JSON.parse(stored).slice(0, 5));
            }
        } catch (e) {
            console.error('Failed to load recent analyses:', e);
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20 px-4 max-w-7xl mx-auto w-full">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-tight">Your Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Track your progress and AI insights.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Section 1: Recent Analysis */}
                    <div className="border-2 border-foreground p-6 bg-card">
                        <h2 className="font-bold text-xl mb-4 border-b-2 border-foreground/10 pb-2">Recent Analysis</h2>
                        {recentAnalyses.length > 0 ? (
                            <ul className="space-y-3">
                                {recentAnalyses.map((analysis, idx) => (
                                    <li key={idx} className="flex items-center justify-between py-2 border-b border-foreground/10">
                                        <div>
                                            <span className="font-bold">{analysis.symbol}</span>
                                            <span className="text-xs text-muted-foreground ml-2">{analysis.date}</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 ${analysis.signal === 'BUY' ? 'bg-green-600 text-white' :
                                                analysis.signal === 'SELL' ? 'bg-red-600 text-white' :
                                                    'bg-yellow-600 text-white'
                                            }`}>
                                            {analysis.signal}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No recent analysis found.</p>
                        )}
                        <div className="mt-4">
                            <Link href="/portfolio" className="text-sm font-bold underline hover:no-underline">
                                Analyze New Portfolio →
                            </Link>
                        </div>
                    </div>

                    {/* Section 2: Quick Actions */}
                    <div className="border-2 border-foreground p-6 bg-card">
                        <h2 className="font-bold text-xl mb-4 border-b-2 border-foreground/10 pb-2">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/screener" className="block w-full text-center border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors font-bold">
                                📊 Stock Screener
                            </Link>
                            <Link href="/portfolio" className="block w-full text-center border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors font-bold">
                                💼 Analyze Portfolio
                            </Link>
                            <Link href="/" className="block w-full text-center border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors font-bold">
                                🎭 Legend Debates
                            </Link>
                        </div>
                    </div>

                    {/* Section 3: Daily Wisdom */}
                    <div className="border-2 border-foreground p-6 bg-card">
                        <h2 className="font-bold text-xl mb-4 border-b-2 border-foreground/10 pb-2">Daily Wisdom</h2>
                        <blockquote className="italic border-l-4 border-foreground pl-4 py-2 my-2">
                            &ldquo;{dailyQuote.quote}&rdquo;
                        </blockquote>
                        <cite className="text-sm font-bold">— {dailyQuote.author}</cite>
                        <button
                            onClick={() => {
                                const randomIndex = Math.floor(Math.random() * legendaryQuotes.length);
                                setDailyQuote(legendaryQuotes[randomIndex]);
                            }}
                            className="block mt-4 text-xs text-muted-foreground hover:text-foreground underline"
                        >
                            Show another quote
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
