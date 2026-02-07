import { NextResponse } from 'next/server';
import { getStockData, formatStockContext } from '@/lib/finnhub';

export const runtime = 'nodejs';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const SITE_NAME = process.env.SITE_NAME || 'Legendary Investor';

export async function POST(req: Request) {
    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'OpenRouter API Key missing' }, { status: 500 });
    }

    try {
        const { symbol } = await req.json();

        // 1. Fetch Real Data
        const stockData = await getStockData(symbol);
        const context = formatStockContext(stockData);

        // 2. Prompt LLM
        const systemPrompt = `You are a world-class investment analyst (CFA/Hedge Fund).
        Analyze the following stock data and generate a steelmanned thesis.
        
        STOCK DATA:
        ${context}
        
        TASK:
        Generate 3 distinct Bullish Points and 3 distinct Bearish Points (Risks).
        Each point must be specific, data-backed, and cite the source from the context provided (e.g. "Source: Finnhub" or "Source: 10-K" if implied).
        
        OUTPUT FORMAT:
        JSON ONLY.
        {
          "bullPoints": [
            { "text": "Point 1... (Source: X)" },
            { "text": "Point 2... (Source: Y)" },
            { "text": "Point 3... (Source: Z)" }
          ],
          "bearPoints": [
            { "text": "Risk 1... (Source: A)" },
            { "text": "Risk 2... (Source: B)" },
            { "text": "Risk 3... (Source: C)" }
          ]
        }
        
        Keep points under 140 characters.
        `;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'google/gemini-2.0-flash-001',
                messages: [{ role: 'system', content: systemPrompt }],
                temperature: 0.5,
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();
        const content = data.choices[0].message.content;

        let parsed;
        try {
            const cleanJson = content.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            parsed = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse thesis JSON", content);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error('Thesis Assist Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
