'use server';

import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

interface FinnhubNews {
    category: string;
    datetime: number;
    headline: string;
    id: number;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export async function GET() {
    if (!FINNHUB_API_KEY) {
        return NextResponse.json({ error: 'Finnhub API key not configured' }, { status: 500 });
    }

    try {
        // Fetch general market news from Finnhub
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );

        if (!response.ok) {
            throw new Error(`Finnhub API error: ${response.status}`);
        }

        const newsData: FinnhubNews[] = await response.json();

        // Take top 8 most recent news items and format them
        const formattedNews = newsData.slice(0, 8).map((item, index) => ({
            id: item.id,
            topic: item.headline.length > 60 ? item.headline.substring(0, 57) + '...' : item.headline,
            fullHeadline: item.headline,
            date: new Date(item.datetime * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
            source: item.source,
            summary: item.summary,
            url: item.url,
            related: item.related, // Related ticker symbols
        }));

        return NextResponse.json({
            success: true,
            news: formattedNews,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Failed to fetch market news:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch market news',
                news: []
            },
            { status: 500 }
        );
    }
}
