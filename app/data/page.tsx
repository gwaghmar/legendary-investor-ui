'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GuruPortfolio } from '@/components/guru-portfolio';
import { SecSearch } from '@/components/sec-search';

export default function DataPage() {
    const [activeTab, setActiveTab] = useState<'gurus' | 'sec'>('gurus');

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">Legendary Data</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Access the raw intelligence behind the legends. Explore institutional holdings (13F)
                        or search SEC filings directly with AI.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex border-2 border-foreground p-1 gap-1">
                        <button
                            onClick={() => setActiveTab('gurus')}
                            className={`px-6 py-2 font-bold text-sm transition-all ${activeTab === 'gurus'
                                    ? 'bg-foreground text-background'
                                    : 'hover:bg-foreground/10 text-foreground'
                                }`}
                        >
                            👥 Guru Portfolios
                        </button>
                        <button
                            onClick={() => setActiveTab('sec')}
                            className={`px-6 py-2 font-bold text-sm transition-all ${activeTab === 'sec'
                                    ? 'bg-foreground text-background'
                                    : 'hover:bg-foreground/10 text-foreground'
                                }`}
                        >
                            📜 SEC Filings (RAG)
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px]">
                    {activeTab === 'gurus' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <GuruPortfolio />
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
                            <SecSearch />
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
