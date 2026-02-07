'use client';

import React, { useState } from 'react';

interface MetricTooltipProps {
    label: string;
    formula: string;
    children: React.ReactNode;
}

export function MetricTooltip({ label, formula, children }: MetricTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-block w-full"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className="absolute z-[100] bottom-full left-0 mb-2 w-64 bg-foreground text-background p-3 border-2 border-background shadow-xl text-xs animate-in fade-in duration-200">
                    <div className="font-bold uppercase tracking-wider mb-1 border-b border-background/20 pb-1">
                        {label} Calculation
                    </div>
                    <div className="font-mono bg-background/10 p-2 rounded mt-2 break-all">
                        {formula}
                    </div>
                    <div className="mt-2 text-[10px] opacity-70 italic">
                        *Standard industry formula used for analysis.
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full left-4 border-8 border-transparent border-t-foreground" />
                </div>
            )}
        </div>
    );
}
