import { NextResponse } from 'next/server';
import { getStockFilings } from '@/lib/finnhub';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const filings = await getStockFilings(symbol);

        // Map Finnhub filings to our visual timeline format
        const mappedEvents = filings.map((f: any) => ({
            id: f.id || Math.random().toString(),
            date: f.filedDate || f.acceptedDate,
            legendId: 'anonymous', // We can improve this highlighting known guru IDs later
            action: f.reportType === '10-Q' || f.reportType === '10-K' ? 'Insight' : 'Activity',
            description: `${f.reportType} Filing - ${f.form || 'Institutional'} update`,
            sentiment: 'Neutral'
        }));

        return NextResponse.json({ events: mappedEvents });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
