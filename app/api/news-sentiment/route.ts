import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/finnhub';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const news = await fetchNews(symbol);

        // In a real pro setup, we'd pipe news headlines to LLM here for sentiment
        // For this phase, we'll use a rule-based sentiment mapping for the headlines
        // to show "Real Wiring" to the Finnhub news feed.
        const mappedNews = news.map(item => ({
            ...item,
            sentiment: item.headline.toLowerCase().includes('beat') || item.headline.toLowerCase().includes('up') || item.headline.toLowerCase().includes('growth')
                ? 'Bullish'
                : item.headline.toLowerCase().includes('concerns') || item.headline.toLowerCase().includes('down') || item.headline.toLowerCase().includes('fall')
                    ? 'Bearish'
                    : 'Neutral'
        }));

        return NextResponse.json({ news: mappedNews });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
