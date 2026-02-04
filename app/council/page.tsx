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
                    <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
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
                        { avatar: '/avatars/buffett.png', name: 'Buffett', role: 'Value', color: '#10B981' },
                        { avatar: '/avatars/lynch.png', name: 'Lynch', role: 'Growth', color: '#3B82F6' },
                        { avatar: '/avatars/burry.png', name: 'Burry', role: 'Risk', color: '#EF4444' },
                        { avatar: '/avatars/druckenmiller.png', name: 'Druckenmiller', role: 'Macro', color: '#F59E0B' },
                        { avatar: '/avatars/greenblatt.png', name: 'Greenblatt', role: 'Quant', color: '#8B5CF6' },
                    ].map((member) => (
                        <div
                            key={member.name}
                            className="text-center p-3 border border-foreground/20"
                            style={{ borderTopColor: member.color, borderTopWidth: 3 }}
                        >
                            <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2" style={{ borderColor: member.color }}>
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
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
                            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                            <div>
                                <div className="font-bold">Enter a Stock</div>
                                <div className="text-muted-foreground">Type any ticker symbol (AAPL, TSLA, etc.)</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                            <div>
                                <div className="font-bold">AI Analysis</div>
                                <div className="text-muted-foreground">5 legends analyze from their unique perspectives</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
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
