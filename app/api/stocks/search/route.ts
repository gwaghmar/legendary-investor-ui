import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Common US stocks for instant fallback suggestions
const COMMON_STOCKS = [
    { symbol: 'AAPL', description: 'Apple Inc' },
    { symbol: 'GOOGL', description: 'Alphabet Inc' },
    { symbol: 'MSFT', description: 'Microsoft Corporation' },
    { symbol: 'AMZN', description: 'Amazon.com Inc' },
    { symbol: 'NVDA', description: 'NVIDIA Corporation' },
    { symbol: 'META', description: 'Meta Platforms Inc' },
    { symbol: 'TSLA', description: 'Tesla Inc' },
    { symbol: 'JPM', description: 'JPMorgan Chase & Co' },
    { symbol: 'V', description: 'Visa Inc' },
    { symbol: 'MA', description: 'Mastercard Inc' },
    { symbol: 'UNH', description: 'UnitedHealth Group' },
    { symbol: 'JNJ', description: 'Johnson & Johnson' },
    { symbol: 'XOM', description: 'Exxon Mobil Corporation' },
    { symbol: 'PG', description: 'Procter & Gamble Co' },
    { symbol: 'HD', description: 'Home Depot Inc' },
    { symbol: 'BAC', description: 'Bank of America Corp' },
    { symbol: 'DIS', description: 'Walt Disney Co' },
    { symbol: 'NFLX', description: 'Netflix Inc' },
    { symbol: 'AMD', description: 'Advanced Micro Devices' },
    { symbol: 'INTC', description: 'Intel Corporation' },
    { symbol: 'CRM', description: 'Salesforce Inc' },
    { symbol: 'ORCL', description: 'Oracle Corporation' },
    { symbol: 'COST', description: 'Costco Wholesale Corp' },
    { symbol: 'WMT', description: 'Walmart Inc' },
    { symbol: 'KO', description: 'Coca-Cola Co' },
    { symbol: 'PEP', description: 'PepsiCo Inc' },
    { symbol: 'MCD', description: 'McDonalds Corp' },
    { symbol: 'NKE', description: 'Nike Inc' },
    { symbol: 'SBUX', description: 'Starbucks Corp' },
    { symbol: 'PYPL', description: 'PayPal Holdings Inc' },
];

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toUpperCase() || '';

    if (!query || query.length < 1) {
        return NextResponse.json({ results: [] });
    }

    // First, filter common stocks for instant results
    const localMatches = COMMON_STOCKS.filter(
        s => s.symbol.includes(query) || s.description.toUpperCase().includes(query)
    ).slice(0, 5);

    // If we have Finnhub API key, also search their API
    if (FINNHUB_API_KEY && query.length >= 2) {
        try {
            const response = await fetch(
                `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`,
                { next: { revalidate: 300 } }
            );

            if (response.ok) {
                const data = await response.json();
                const apiResults = (data.result || [])
                    .filter((r: any) => r.type === 'Common Stock' && !r.symbol.includes('.'))
                    .slice(0, 8)
                    .map((r: any) => ({
                        symbol: r.symbol,
                        description: r.description,
                    }));

                // Merge and dedupe
                const allResults = [...localMatches];
                for (const r of apiResults) {
                    if (!allResults.find(lr => lr.symbol === r.symbol)) {
                        allResults.push(r);
                    }
                }

                return NextResponse.json({
                    results: allResults.slice(0, 8),
                    source: 'finnhub'
                });
            }
        } catch (error) {
            console.error('Finnhub search error:', error);
        }
    }

    // Fallback to local results only
    return NextResponse.json({
        results: localMatches,
        source: 'local'
    });
}
