'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchHistoryProps {
    onSelect: (search: string) => void;
    isOpen: boolean;
}

export function SearchHistory({ onSelect, isOpen }: SearchHistoryProps) {
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => {
        // Load history on mount
        const saved = localStorage.getItem('searchHistory');
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse search history", e);
            }
        }
    }, [isOpen]); // Reload when menu opens

    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        localStorage.removeItem('searchHistory');
        setHistory([]);
    };

    const removeHistoryItem = (e: React.MouseEvent, item: string) => {
        e.stopPropagation();
        const newHistory = history.filter(h => h !== item);
        setHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    if (!isOpen || history.length === 0) return null;

    return (
        <div className="absolute top-full left-0 right-0 bg-background border-2 border-t-0 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between p-2 pb-1 border-b border-foreground/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recent Searches</span>
                <button onClick={clearHistory} className="text-[10px] uppercase hover:text-red-500 font-bold">Clear All</button>
            </div>
            <ul className="py-1">
                {history.map((item) => (
                    <li key={item}>
                        <button
                            onClick={() => onSelect(item)}
                            className="w-full text-left px-3 py-2 text-sm font-mono hover:bg-foreground hover:text-background flex justify-between group items-center"
                        >
                            <div className="flex items-center gap-2">
                                <span className="opacity-50 group-hover:opacity-100">🕒</span>
                                {item}
                            </div>
                            <span
                                onClick={(e) => removeHistoryItem(e, item)}
                                className="opacity-0 group-hover:opacity-100 px-2 hover:bg-background/20 font-bold"
                            >
                                ✕
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Helper to save search
export function saveToHistory(query: string) {
    if (!query) return;
    const cleanQuery = query.toUpperCase().trim();

    try {
        const saved = localStorage.getItem('searchHistory');
        let history: string[] = saved ? JSON.parse(saved) : [];

        // Remove existing duplicate to move it to top
        history = history.filter(h => h !== cleanQuery);

        // Add to top
        history.unshift(cleanQuery);

        // Limit to 5
        if (history.length > 5) {
            history = history.slice(0, 5);
        }

        localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save search history", e);
    }
}
