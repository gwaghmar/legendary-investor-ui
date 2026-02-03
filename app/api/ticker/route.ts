import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Major indices and symbols to track
const TICKER_SYMBOLS = ['SPY', 'QQQ', 'MSFT', 'AAPL', 'NVDA'];

interface TickerItem {
    symbol: string;
    value: string;
    change: number;
    isAlert?: boolean;
    alertType?: 'panic' | 'euphoria';
}

async function getStockQuote(symbol: string): Promise<{ price: number; change: number } | null> {
    if (!FINNHUB_API_KEY) return null;

    try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const res = await fetch(url, { next: { revalidate: 60 } });
        const data = await res.json();

        if (data.c && data.dp !== undefined) {
            return {
                price: data.c, // Current price
                change: data.dp, // Percent change
            };
        }
        return null;
    } catch {
        return null;
    }
}

async function getCryptoPrice(id: string): Promise<{ price: number; change: number } | null> {
    try {
        // CoinGecko free API - no key needed
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`;
        const res = await fetch(url, { next: { revalidate: 60 } });
        const data = await res.json();

        if (data[id]) {
            return {
                price: data[id].usd,
                change: data[id].usd_24h_change || 0,
            };
        }
        return null;
    } catch {
        return null;
    }
}

function formatPrice(price: number): string {
    if (price >= 10000) {
        return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function createTickerItem(symbol: string, displayName: string, price: number, change: number): TickerItem {
    const isSignificantMove = Math.abs(change) > 3;

    return {
        symbol: displayName,
        value: formatPrice(price),
        change: Math.round(change * 100) / 100,
        isAlert: isSignificantMove,
        alertType: isSignificantMove ? (change > 0 ? 'euphoria' : 'panic') : undefined,
    };
}

export async function GET() {
    const tickerItems: TickerItem[] = [];

    // Fetch stock data in parallel
    const stockPromises = TICKER_SYMBOLS.map(async (symbol) => {
        const quote = await getStockQuote(symbol);
        if (quote) {
            const displayNames: Record<string, string> = {
                'SPY': 'S&P 500',
                'QQQ': 'NASDAQ',
                'MSFT': 'MSFT',
                'AAPL': 'AAPL',
                'NVDA': 'NVDA',
            };
            return createTickerItem(symbol, displayNames[symbol] || symbol, quote.price, quote.change);
        }
        return null;
    });

    // Fetch crypto data
    const cryptoPromises = [
        getCryptoPrice('bitcoin').then(data =>
            data ? createTickerItem('BTC', 'BTC', data.price, data.change) : null
        ),
        getCryptoPrice('ethereum').then(data =>
            data ? createTickerItem('ETH', 'ETH', data.price, data.change) : null
        ),
    ];

    // Wait for all
    const [stockResults, cryptoResults] = await Promise.all([
        Promise.all(stockPromises),
        Promise.all(cryptoPromises),
    ]);

    // Add valid results
    stockResults.forEach(item => item && tickerItems.push(item));
    cryptoResults.forEach(item => item && tickerItems.push(item));

    return NextResponse.json({
        success: tickerItems.length > 0,
        timestamp: new Date().toISOString(),
        items: tickerItems,
    });
}
