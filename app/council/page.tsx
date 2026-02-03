'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CouncilPanel } from '@/components/council-panel';

export default function CouncilPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Hero */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-3xl mr-2">👥</span>
                        The Council
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Get investment analysis from 5 legendary investors with different perspectives.
                        They&apos;ll analyze your stock and vote together.
                    </p>
                </div>

                {/* Council Members Preview */}
                <div className="grid grid-cols-5 gap-2 mb-8">
                    {[
                        { avatar: '🧓', name: 'Buffett', role: 'Value', color: '#10B981' },
                        { avatar: '📈', name: 'Lynch', role: 'Growth', color: '#3B82F6' },
                        { avatar: '🔍', name: 'Burry', role: 'Risk', color: '#EF4444' },
                        { avatar: '🌍', name: 'Druckenmiller', role: 'Macro', color: '#F59E0B' },
                        { avatar: '🧮', name: 'Greenblatt', role: 'Quant', color: '#8B5CF6' },
                    ].map((member) => (
                        <div
                            key={member.name}
                            className="text-center p-3 border border-foreground/20"
                            style={{ borderTopColor: member.color, borderTopWidth: 3 }}
                        >
                            <div className="text-2xl mb-1">{member.avatar}</div>
                            <div className="text-xs font-bold">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                    ))}
                </div>

                {/* Council Panel */}
                <CouncilPanel />

                {/* How It Works */}
                <div className="mt-8 border-2 border-foreground/20 p-6">
                    <h3 className="font-bold mb-4">How The Council Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex gap-3">
                            <span className="text-xl">1️⃣</span>
                            <div>
                                <div className="font-bold">Enter a Stock</div>
                                <div className="text-muted-foreground">Type any ticker symbol (AAPL, TSLA, etc.)</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-xl">2️⃣</span>
                            <div>
                                <div className="font-bold">AI Analysis</div>
                                <div className="text-muted-foreground">5 legends analyze from their unique perspectives</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="text-xl">3️⃣</span>
                            <div>
                                <div className="font-bold">Get Consensus</div>
                                <div className="text-muted-foreground">See individual votes and overall recommendation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
