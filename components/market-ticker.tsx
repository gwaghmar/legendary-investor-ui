'use client';

import { useState, useEffect } from 'react';

interface TickerItem {
  symbol: string;
  value: string;
  change: number;
  isAlert?: boolean;
  alertType?: 'panic' | 'euphoria';
}

// Fallback data when API unavailable
const fallbackData: TickerItem[] = [
  { symbol: 'S&P 500', value: '---', change: 0 },
  { symbol: 'NASDAQ', value: '---', change: 0 },
  { symbol: 'BTC', value: '---', change: 0 },
  { symbol: 'ETH', value: '---', change: 0 },
];

export function MarketTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>(fallbackData);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function fetchTickerData() {
      try {
        const res = await fetch('/api/ticker');
        const data = await res.json();

        if (data.success && data.items?.length > 0) {
          setTickerData(data.items);
          setIsLive(true);
        }
      } catch (error) {
        console.error('Ticker fetch error:', error);
      }
    }

    // Initial fetch
    fetchTickerData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchTickerData, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderTicker = () => (
    <>
      {isLive && (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-bold">
          ● LIVE
        </span>
      )}
      {tickerData.map((item, idx) => (
        <span
          key={`${item.symbol}-${idx}`}
          className={`inline-flex items-center gap-3 px-6 py-2 ${item.isAlert
            ? (item.alertType === 'panic' ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white')
            : ''
            }`}
        >
          <span className="font-extrabold tracking-tight">{item.symbol}</span>
          <span className="font-mono">{item.value}</span>
          {item.change !== 0 && (
            <span
              className={`font-bold flex items-center px-1.5 py-0.5 rounded text-xs ${item.isAlert
                ? 'bg-white/20 text-white'
                : (item.change >= 0 ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400')
                }`}
            >
              <span className="mr-1">{item.change >= 0 ? '▲' : '▼'}</span>
              {Math.abs(item.change).toFixed(2)}%
            </span>
          )}
          {!item.isAlert && <span className="text-border/40 font-light">|</span>}
        </span>
      ))}
    </>
  );

  return (
    <div className="bg-background border-y border-border overflow-hidden relative z-50 shadow-sm">
      <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] cursor-default">
        {renderTicker()}
        {renderTicker()}
        {renderTicker()}
      </div>
    </div>
  );
}
