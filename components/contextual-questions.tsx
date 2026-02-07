'use client';

import React from 'react';

interface ContextualQuestionsProps {
    symbol: string;
    onQuestionClick?: (question: string) => void;
}

export function ContextualQuestions({ symbol, onQuestionClick }: ContextualQuestionsProps) {
    const suggestions = [
        `How does ${symbol}'s ROIC compare to its 5-year average?`,
        `What are the most significant risks mentioned in the latest 10-K?`,
        `How does ${symbol}'s current P/E compare to its primary competitors?`,
        `What are the key growth catalysts for ${symbol} over the next 12 months?`,
    ];

    return (
        <div className="mt-8 pt-8 border-t-2 border-foreground/10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-secondary">✦</span> Deep Dive Suggestions
            </h3>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onQuestionClick?.(question)}
                        className="text-left px-4 py-2 bg-secondary/10 border-2 border-foreground/5 hover:border-foreground hover:bg-secondary/20 transition-all text-xs sm:text-sm font-medium rounded-sm group"
                    >
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">“</span>
                        {question}
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">”</span>
                    </button>
                ))}
            </div>
            <div className="mt-4 text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">
                Click to generate AI deep-dive based on latest filings
            </div>
        </div>
    );
}
