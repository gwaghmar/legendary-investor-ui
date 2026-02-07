'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type StockData } from '@/lib/stock-data';

interface ThesisPoint {
    id: string;
    text: string;
    source?: string;
    type: 'bull' | 'bear';
}

interface ThesisMetric {
    id: string;
    metric: string;
    current: string;
    target: string;
    source: string;
}

interface ThesisPriceTargets {
    current: string;
    target: string;
    worstCase: string;
}

interface ThesisCatalyst {
    id: string;
    date: string;
    event: string;
    impact: 'positive' | 'negative' | 'neutral';
}

interface ThesisBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    stock: StockData;
}

export function ThesisBuilderModal({ isOpen, onClose, stock }: ThesisBuilderModalProps) {
    const [bullPoints, setBullPoints] = useState<ThesisPoint[]>([]);
    const [bearPoints, setBearPoints] = useState<ThesisPoint[]>([]);
    const [metrics, setMetrics] = useState<ThesisMetric[]>([]);
    const [priceTargets, setPriceTargets] = useState<ThesisPriceTargets>({ current: '', target: '', worstCase: '' });
    const [catalysts, setCatalysts] = useState<ThesisCatalyst[]>([]);
    const [invalidationTriggers, setInvalidationTriggers] = useState<string[]>([]);
    const [timeHorizon, setTimeHorizon] = useState('1 yr');
    const [confidence, setConfidence] = useState('Medium');
    const [verdict, setVerdict] = useState<'BULLISH' | 'BEARISH' | 'NEUTRAL'>('NEUTRAL');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleAiAssist = async () => {
        setIsAiLoading(true);
        try {
            const response = await fetch('/api/thesis/assist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol: stock.symbol })
            });
            const data = await response.json();

            if (data.bullPoints) {
                setBullPoints(prev => [...prev, ...data.bullPoints.map((p: any) => ({ ...p, id: generateId(), type: 'bull' }))]);
            }
            if (data.bearPoints) {
                setBearPoints(prev => [...prev, ...data.bearPoints.map((p: any) => ({ ...p, id: generateId(), type: 'bear' }))]);
            }
        } catch (e) {
            console.error("AI Assist failed", e);
        } finally {
            setIsAiLoading(false);
        }
    };

    const saveThesis = () => {
        const thesis = {
            id: generateId(),
            symbol: stock.symbol,
            date: new Date().toISOString(),
            verdict,
            confidence,
            timeHorizon,
            bullPoints,
            bearPoints,
            metrics,
            priceTargets,
            catalysts,
            invalidationTriggers
        };

        // Save to localStorage for MVP
        const saved = JSON.parse(localStorage.getItem('theses') || '[]');
        localStorage.setItem('theses', JSON.stringify([thesis, ...saved]));
        onClose();
        alert('Thesis saved to local storage!');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b-2 border-foreground bg-secondary/50">
                            <div>
                                <h2 className="text-xl font-bold uppercase">Build Thesis: {stock.symbol}</h2>
                                <p className="text-sm text-muted-foreground uppercase tracking-widest">{stock.name}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-foreground/10 text-xl font-bold">✕</button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Verdict & Horizon */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Stance</label>
                                    <div className="flex gap-2">
                                        {['BULLISH', 'NEUTRAL', 'BEARISH'].map(v => (
                                            <button
                                                key={v}
                                                onClick={() => setVerdict(v as any)}
                                                className={`flex-1 py-2 text-xs font-bold border-2 border-foreground transition-all ${verdict === v
                                                    ? (v === 'BULLISH' ? 'bg-green-600 text-white' : v === 'BEARISH' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white')
                                                    : 'hover:bg-foreground/5'
                                                    }`}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Time Horizon</label>
                                    <select
                                        value={timeHorizon}
                                        onChange={(e) => setTimeHorizon(e.target.value)}
                                        className="w-full bg-background border-2 border-foreground p-2 text-sm font-mono"
                                    >
                                        <option>1 Month</option>
                                        <option>3 Months</option>
                                        <option>6 Months</option>
                                        <option>1 Year</option>
                                        <option>3 Years</option>
                                        <option>Decade</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider">Confidence</label>
                                    <div className="flex gap-2">
                                        {['Low', 'Medium', 'High'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setConfidence(c)}
                                                className={`flex-1 py-2 text-xs font-bold border-2 border-foreground ${confidence === c ? 'bg-foreground text-background' : 'hover:bg-foreground/5'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-foreground/20" />

                            {/* Bull Case */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-green-600 uppercase">Bull Case</h3>
                                    <button
                                        onClick={() => setBullPoints([...bullPoints, { id: generateId(), text: '', type: 'bull' }])}
                                        className="text-xs font-bold border border-green-600 text-green-600 px-2 py-1 hover:bg-green-50"
                                    >
                                        + Add Point
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {bullPoints.map((point, idx) => (
                                        <div key={point.id} className="flex gap-2 items-start">
                                            <span className="text-green-600 mt-2">●</span>
                                            <textarea
                                                value={point.text}
                                                onChange={(e) => {
                                                    const newPoints = [...bullPoints];
                                                    newPoints[idx].text = e.target.value;
                                                    setBullPoints(newPoints);
                                                }}
                                                placeholder="Enter a bullish argument..."
                                                className="flex-1 bg-background border border-foreground/20 p-2 text-sm min-h-[60px]"
                                            />
                                            <button onClick={() => setBullPoints(bullPoints.filter(p => p.id !== point.id))} className="text-muted-foreground hover:text-red-500 px-2 py-1">×</button>
                                        </div>
                                    ))}
                                    {bullPoints.length === 0 && <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-foreground/20 text-center">No bullish points yet. Use AI Assist or add manually.</div>}
                                </div>
                            </div>

                            {/* Bear Case */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-red-600 uppercase">Bear Case (Steelman)</h3>
                                    <button
                                        onClick={() => setBearPoints([...bearPoints, { id: generateId(), text: '', type: 'bear' }])}
                                        className="text-xs font-bold border border-red-600 text-red-600 px-2 py-1 hover:bg-red-50"
                                    >
                                        + Add Point
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {bearPoints.map((point, idx) => (
                                        <div key={point.id} className="flex gap-2 items-start">
                                            <span className="text-red-600 mt-2">●</span>
                                            <textarea
                                                value={point.text}
                                                onChange={(e) => {
                                                    const newPoints = [...bearPoints];
                                                    newPoints[idx].text = e.target.value;
                                                    setBearPoints(newPoints);
                                                }}
                                                placeholder="Enter a bearish risk..."
                                                className="flex-1 bg-background border border-foreground/20 p-2 text-sm min-h-[60px]"
                                            />
                                            <button onClick={() => setBearPoints(bearPoints.filter(p => p.id !== point.id))} className="text-muted-foreground hover:text-red-500 px-2 py-1">×</button>
                                        </div>
                                    ))}
                                    {bearPoints.length === 0 && <div className="text-sm text-muted-foreground italic p-4 border border-dashed border-foreground/20 text-center">No bearish points yet. Use AI Assist or add manually.</div>}
                                </div>
                            </div>

                            <hr className="border-foreground/20" />

                            {/* Price Targets */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold uppercase">Price Targets</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Current Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <input
                                                type="number"
                                                value={priceTargets.current || stock.price}
                                                onChange={(e) => setPriceTargets({ ...priceTargets, current: e.target.value })}
                                                className="w-full bg-background border border-foreground/20 pl-6 p-2 text-sm font-mono"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-green-600 uppercase">Target Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <input
                                                type="number"
                                                value={priceTargets.target}
                                                onChange={(e) => setPriceTargets({ ...priceTargets, target: e.target.value })}
                                                className="w-full bg-background border-2 border-green-600/50 pl-6 p-2 text-sm font-mono"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-red-600 uppercase">Worst Case</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <input
                                                type="number"
                                                value={priceTargets.worstCase}
                                                onChange={(e) => setPriceTargets({ ...priceTargets, worstCase: e.target.value })}
                                                className="w-full bg-background border-2 border-red-600/50 pl-6 p-2 text-sm font-mono"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-foreground/20" />

                            {/* Catalysts */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold uppercase">Catalysts</h3>
                                    <button
                                        onClick={() => setCatalysts([...catalysts, { id: generateId(), date: '', event: '', impact: 'neutral' }])}
                                        className="text-xs font-bold border border-foreground px-2 py-1 hover:bg-foreground/5"
                                    >
                                        + Add Catalyst
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {catalysts.map((cat, idx) => (
                                        <div key={cat.id} className="flex gap-2 items-start">
                                            <input
                                                type="date"
                                                value={cat.date}
                                                onChange={(e) => {
                                                    const newCats = [...catalysts];
                                                    newCats[idx].date = e.target.value;
                                                    setCatalysts(newCats);
                                                }}
                                                className="bg-background border border-foreground/20 p-2 text-xs font-mono w-32"
                                            />
                                            <input
                                                type="text"
                                                value={cat.event}
                                                onChange={(e) => {
                                                    const newCats = [...catalysts];
                                                    newCats[idx].event = e.target.value;
                                                    setCatalysts(newCats);
                                                }}
                                                placeholder="Event description..."
                                                className="flex-1 bg-background border border-foreground/20 p-2 text-sm"
                                            />
                                            <select
                                                value={cat.impact}
                                                onChange={(e) => {
                                                    const newCats = [...catalysts];
                                                    newCats[idx].impact = e.target.value as any;
                                                    setCatalysts(newCats);
                                                }}
                                                className="bg-background border border-foreground/20 p-2 text-xs"
                                            >
                                                <option value="positive">Positive</option>
                                                <option value="neutral">Neutral</option>
                                                <option value="negative">Negative</option>
                                            </select>
                                            <button onClick={() => setCatalysts(catalysts.filter(c => c.id !== cat.id))} className="text-muted-foreground hover:text-red-500 px-2">×</button>
                                        </div>
                                    ))}
                                    {catalysts.length === 0 && <div className="text-xs text-muted-foreground italic p-2 border border-dashed border-foreground/20 text-center">No upcoming catalysts defined.</div>}
                                </div>
                            </div>

                            {/* Invalidation Triggers */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold uppercase text-red-600/80">Invalidation Triggers</h3>
                                    <button
                                        onClick={() => setInvalidationTriggers([...invalidationTriggers, ''])}
                                        className="text-xs font-bold border border-foreground px-2 py-1 hover:bg-foreground/5"
                                    >
                                        + Add Trigger
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {invalidationTriggers.map((trigger, idx) => (
                                        <div key={idx} className="flex gap-2 items-start">
                                            <span className="text-red-600 mt-2">⚠️</span>
                                            <input
                                                type="text"
                                                value={trigger}
                                                onChange={(e) => {
                                                    const newTriggers = [...invalidationTriggers];
                                                    newTriggers[idx] = e.target.value;
                                                    setInvalidationTriggers(newTriggers);
                                                }}
                                                placeholder="If this happens, the thesis is broken..."
                                                className="flex-1 bg-background border border-foreground/20 p-2 text-sm"
                                            />
                                            <button onClick={() => setInvalidationTriggers(invalidationTriggers.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-red-500 px-2">×</button>
                                        </div>
                                    ))}
                                    {invalidationTriggers.length === 0 && <div className="text-xs text-muted-foreground italic p-2 border border-dashed border-foreground/20 text-center">No invalidation triggers defined.</div>}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-background border-t-2 border-foreground p-4 flex justify-between items-center">
                            <button
                                onClick={handleAiAssist}
                                disabled={isAiLoading}
                                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 font-bold uppercase text-sm hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isAiLoading ? 'Thinking...' : '🤖 AI Assist'}
                            </button>

                            <div className="flex gap-4">
                                <button onClick={onClose} className="px-4 py-2 font-bold uppercase text-sm hover:underline">Cancel</button>
                                <button
                                    onClick={saveThesis}
                                    className="bg-foreground text-background px-6 py-2 font-bold uppercase text-sm hover:opacity-90"
                                >
                                    Save Thesis
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
