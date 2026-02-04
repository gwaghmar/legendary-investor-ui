'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { createClient } from '@/lib/supabase/client';

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

export default function DashboardPage() {
    const [dailyQuote, setDailyQuote] = useState(legendaryQuotes[0]);
    const [stats, setStats] = useState({ portfolioCount: 0, watchlistCount: 0 });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Select random quote on mount
        const randomIndex = Math.floor(Math.random() * legendaryQuotes.length);
        setDailyQuote(legendaryQuotes[randomIndex]);

        const loadStats = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { count: pCount } = await supabase.from('portfolios').select('*', { count: 'exact', head: true });
                const { count: wCount } = await supabase.from('watchlists').select('*', { count: 'exact', head: true });
                setStats({
                    portfolioCount: pCount || 0,
                    watchlistCount: wCount || 0
                });
            }
            setLoading(false);
        };
        loadStats();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-12 px-4 max-w-7xl mx-auto w-full">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-tight">Your Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Track your progress and AI insights.</p>
                    </div>
                    {/* Stats Widget */}
                    <div className="flex gap-4">
                        <div className="bg-foreground text-background px-4 py-2 text-center">
                            <div className="text-2xl font-bold leading-none">{loading ? '-' : stats.portfolioCount}</div>
                            <div className="text-[10px] uppercase font-bold opacity-80">Holdings</div>
                        </div>
                        <div className="bg-muted text-foreground px-4 py-2 text-center border-2 border-transparent">
                            <div className="text-2xl font-bold leading-none">{loading ? '-' : stats.watchlistCount}</div>
                            <div className="text-[10px] uppercase font-bold opacity-80">Watchlist</div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Section 1: Portfolio Snapshot */}
                    <div className="border-2 border-foreground p-6 bg-card flex flex-col justify-between">
                        <div>
                            <h2 className="font-bold text-xl mb-4 border-b-2 border-foreground/10 pb-2">Your Portfolio</h2>
                            <p className="text-muted-foreground mb-4">
                                {stats.portfolioCount > 0
                                    ? `You are currently tracking ${stats.portfolioCount} positions.`
                                    : "You haven't added any positions yet."}
                            </p>
                        </div>
                        <Link href="/portfolio" className="block w-full text-center bg-foreground text-background px-4 py-3 hover:bg-foreground/90 transition-colors font-bold uppercase">
                            {stats.portfolioCount > 0 ? 'Manage Portfolio' : 'Create Portfolio'}
                        </Link>
                    </div>

                    {/* Section 2: Quick Actions */}
                    <div className="border-2 border-foreground p-6 bg-card">
                        <h2 className="font-bold text-xl mb-4 border-b-2 border-foreground/10 pb-2">Tools</h2>
                        <div className="space-y-3">
                            <Link href="/screener" className="flex items-center justify-between border-2 border-foreground px-4 py-3 hover:bg-foreground hover:text-background transition-colors font-bold group">
                                <span>📊 Stock Screener</span>
                                <span className="text-muted-foreground group-hover:text-background text-sm">Find Gems →</span>
                            </Link>
                            <Link href="/council" className="flex items-center justify-between border-2 border-foreground px-4 py-3 hover:bg-foreground hover:text-background transition-colors font-bold group">
                                <span>🔮 AI Council</span>
                                <span className="text-muted-foreground group-hover:text-background text-sm">Get Advice →</span>
                            </Link>
                            <Link href="/data" className="flex items-center justify-between border-2 border-foreground px-4 py-3 hover:bg-foreground hover:text-background transition-colors font-bold group">
                                <span>📂 SEC Intelligence</span>
                                <span className="text-muted-foreground group-hover:text-background text-sm">Research →</span>
                            </Link>
                        </div>
                    </div>

                    {/* Section 3: Daily Wisdom */}
                    <div className="border-2 border-foreground p-6 bg-card flex flex-col">
                        <h2 className="font-bold text-xl mb-4 border-b-2 border-foreground/10 pb-2">Wisdom</h2>
                        <div className="flex-1 flex flex-col justify-center">
                            <blockquote className="italic border-l-4 border-foreground pl-4 py-2 my-2 text-lg">
                                &ldquo;{dailyQuote.quote}&rdquo;
                            </blockquote>
                            <cite className="text-sm font-bold mt-2 block text-right">— {dailyQuote.author}</cite>
                        </div>
                        <button
                            onClick={() => {
                                const randomIndex = Math.floor(Math.random() * legendaryQuotes.length);
                                setDailyQuote(legendaryQuotes[randomIndex]);
                            }}
                            className="block mt-4 text-xs text-muted-foreground hover:text-foreground underline self-start"
                        >
                            New Quote
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
