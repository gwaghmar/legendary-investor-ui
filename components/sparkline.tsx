'use client';

import React from 'react';

interface SparklineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
}

export function Sparkline({
    data,
    color = 'currentColor',
    width = 60,
    height = 20
}: SparklineProps) {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // Padding to prevent clipping
    const padding = 2;
    const effectiveHeight = height - padding * 2;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = range === 0
            ? height / 2
            : height - padding - ((val - min) / range) * effectiveHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible inline-block ml-2 opacity-50 translate-y-0.5">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
}
