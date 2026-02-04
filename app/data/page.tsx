'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GuruPortfolio } from '@/components/guru-portfolio';
import { SecSearch } from '@/components/sec-search';
import { GuruFilingsCard } from '@/components/guru-filings-card';

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
                            className={`px-6 py-2 font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'gurus'
                                ? 'bg-foreground text-background'
                                : 'hover:bg-foreground/10 text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Guru Portfolios
                        </button>
                        <button
                            onClick={() => setActiveTab('sec')}
                            className={`px-6 py-2 font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'sec'
                                ? 'bg-foreground text-background'
                                : 'hover:bg-foreground/10 text-foreground'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            SEC Filings (RAG)
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-2">
                                <SecSearch />
                            </div>
                            <div className="lg:col-span-1">
                                <GuruFilingsCard />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
