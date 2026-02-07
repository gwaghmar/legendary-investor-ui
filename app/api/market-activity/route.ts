import { NextResponse } from 'next/server';
import { getAlphaVantageMovers } from '@/lib/alpha-vantage';

export async function GET() {
    try {
        const movers = await getAlphaVantageMovers();
        if (!movers) {
            return NextResponse.json({ error: 'Failed to fetch movers' }, { status: 500 });
        }
        return NextResponse.json(movers);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
