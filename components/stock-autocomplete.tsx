'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StockResult {
    symbol: string;
    description: string;
}

interface StockAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (symbol: string, description: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
}

export function StockAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = 'Enter stock symbol...',
    className = '',
    inputClassName = '',
}: StockAutocompleteProps) {
    const [results, setResults] = useState<StockResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced search
    const searchStocks = useCallback(async (query: string) => {
        if (!query || query.length < 1) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
            setIsOpen(data.results?.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Stock search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle input change with debounce
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.toUpperCase();
        onChange(newValue);

        // Debounce the API call
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            searchStocks(newValue);
        }, 150);
    };

    // Handle selection
    const handleSelect = (result: StockResult) => {
        onChange(result.symbol);
        onSelect?.(result.symbol, result.description);
        setIsOpen(false);
        setResults([]);
        inputRef.current?.blur();
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) {
            if (e.key === 'Enter') {
                // Allow form submission if no dropdown
                return;
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                } else if (results.length > 0) {
                    handleSelect(results[0]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value && results.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className={`w-full border-2 border-foreground px-3 py-2 font-mono text-sm uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor] bg-background ${inputClassName}`}
                    autoComplete="off"
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1 bg-background border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] max-h-64 overflow-y-auto"
                    >
                        {results.map((result, index) => (
                            <button
                                key={result.symbol}
                                onClick={() => handleSelect(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${index === selectedIndex
                                    ? 'bg-foreground text-background'
                                    : 'hover:bg-secondary'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold font-mono">{result.symbol}</span>
                                    <span className="text-sm truncate opacity-70">{result.description}</span>
                                </div>
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
